import { RegDto } from '../../dto/UserDTO'
import { UsernameOrPasswordWrongException } from '../../../core/GmudException'
import User from '../../models/User'
import { ConflictException, forwardRef, Inject, Injectable } from '@nestjs/common'
import { MysqlService } from '../db/MysqlProvider'
import * as util from 'util'
import { lockParam, useLock } from '../util/AwaitLock'
import { Log } from '../../../core/Log'
import Player from '../../game/Player'
import EthService from '../external/EthService'

/**
 * 用户相关业务逻辑
 */
@Injectable()
export class UserService {
    private get repo() {
        return this.mysql.getRepo(User)
    }

    private readonly logger = new Log('user')

    constructor(
        private readonly mysql: MysqlService,
        @Inject(forwardRef(() => EthService))
        private readonly eth: EthService,
    ) {}

    /**
     * 通过登录名获取用户。
     * @param loginName 登录名，可为用户名/手机/邮箱。
     */
    async getByName(loginName: string): Promise<User | undefined> {
        if (!loginName) return undefined
        return this.repo.findOne({
            where: [
                { username: loginName },
                { email: loginName },
                { mobilePhoneNumber: loginName },
            ],
        })
    }

    /**
     * 通过登录名获取用户。
     * @param loginName 登录名，可为用户名/手机/邮箱。
     */
    async getAllByName(loginName: string): Promise<User[]> {
        return this.repo.find({
            where: [{ username: loginName }],
        })
    }

    /**
     * 通过用户ID获取用户。
     * @param userid
     */
    async getByUserid(userid: number) {
        return this.repo.findOne({ where: { id: userid } })
    }

    /**
     * 通过用户名和密码登录
     * @param username 用户名/手机/邮箱
     * @param password 密码
     */
    async loginByPwd(username: string, password: string) {
        let loginUser: User = null

        const users = await this.getAllByName(username)

        for (const user of users) {
            if (user.validatePassword(password)) {
                loginUser = user
                break
            }
        }

        if (!loginUser) {
            throw new UsernameOrPasswordWrongException('用户名或密码错误')
        }

        this.logger.i(`用户${loginUser.id}通过用户名${username}登录了`)
        return {
            user: loginUser,
            player: loginUser.playerData,
            token: loginUser.generateLoginToken(),
        }
    }

    /**
     * 注册新用户
     */
    @useLock()
    async reg(@lockParam() data: RegDto) {
        // const checkResult = await this.codeService.validate(data.phone, data.code)
        //
        // if (!checkResult) {
        //     throw new UnauthorizedException('验证码错误')
        // }

        // 假设bmob的用户名邮箱手机号均已迁移完成
        const p = await this.repo.findOne({
            where: [{ username: data.username }],
        })

        if (typeof p !== 'undefined') {
            throw new ConflictException('用户名已被占用')
        }

        const user = new User()
        const player = new Player({})

        user.username = data.username
        user.playerData = player

        const chargeAddr = this.eth.generateAddr()

        user.ethChargePrivkey = chargeAddr.privateKey
        user.ethChargeAddr = chargeAddr.address
        user.playerData.ethChargeAddr = chargeAddr.address

        await user.savePassword(data.password)

        this.logger.i(util.format('注册了新的账号：%O', user))

        return {
            player,
            token: user.generateLoginToken(),
        }
    }

    /**
     * 修改用户的用户名
     * @param user 用户
     * @param username 新用户名
     */
    @useLock()
    async changeUsername(user: User, @lockParam() username: string) {
        // 要求bmob的用户名邮箱手机号均已迁移完成
        const p = await this.repo.count({
            where: { username },
        })

        if (p > 0) {
            throw new ConflictException('用户名已被占用')
        }

        user.username = username
        return user.save()
    }

    /**
     * 增减用户的EGT字段值
     * @param user
     * @param value
     */
    async addEgt(user: User, value: number | string) {
        const sql = `update user
                     set egtCash = egtCash + ?
                     where id = ?
                     limit 1`
        return await this.mysql._connection.query(sql, [value, user.id])
    }
}
