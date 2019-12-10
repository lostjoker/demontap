import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'
import UUID from '../../core/UUID'
import TokenManager from '../../core/TokenManager'
import TimedEntity from '../../core/TimedEntity'
import { Validator } from 'class-validator'
import md5 = require('md5')
import Player from '../game/Player'

@Entity()
export default class User extends TimedEntity {
    public static readonly loginTokens = new TokenManager<{ id: number }>('Lostjoker0')

    /**
     * 对密码进行MD5加盐变换。
     * @param password 原密码
     * @param salt 盐
     */
    public static transformPassword(password: string, salt: string) {
        return md5(salt + md5(salt + password))
    }

    /**
     * 自增ID
     */
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number

    /**
     * 用户名，可以用来登录
     */
    @Index()
    @Column({
        default: '',
        collation: 'utf8mb4_bin',
    })
    username: string

    /**
     * 加盐变换过的密码
     */
    @Column({ default: '' })
    password: string
    /**
     * 盐，用于变换密码
     */
    @Column({ default: '' })
    salt: string

    @Column({ type: 'json' })
    playerData: Player

    @Column()
    ethChargePrivkey: string

    @Index()
    @Column()
    ethChargeAddr: string

    // @ts-ignore
    @Column({ type: 'decimal', default: '0', width: '38,5', update: false })
    egtCash: number

    /**
     * 删除敏感数据。
     */
    toClient(): Partial<User> {
        const obj: Partial<User> = Object.assign({}, this)
        delete obj.password
        delete obj.salt
        // delete this.passwordMigrated
        delete obj.id
        return obj
    }

    /**
     * 保存用户的新密码。
     * @param password 新密码
     */
    public async savePassword(password: string) {
        const salt = UUID()
        this.salt = salt
        this.password = User.transformPassword(password, salt)

        return this.save()
    }

    /**
     * 验证给定密码是否正确。
     * @param password 密码
     */
    public validatePassword(password: string) {
        return this.password === User.transformPassword(password, this.salt)
    }

    // /**
    //  * 改变用户的手机号
    //  * @param phone 手机号
    //  */
    // public async internalChangePhone(phone: string) {
    //     if (
    //         this.mobilePhoneNumber !== phone &&
    //         0 < (await User.getRepository().count({ mobilePhoneNumber: phone }))
    //     ) {
    //         throw new ConflictException('手机号已被占用')
    //     }
    //
    //     this.mobilePhoneNumber = phone
    //     this.phoneVerified = true // 使用此方法改变的手机号已经验证过
    //     await this.save()
    // }

    /**
     * 生成用户的登录令牌
     */
    public generateLoginToken() {
        return User.loginTokens.generate({
            id: this.id,
        })
    }

    /**
     * 生成用户的登录数据
     */
    public generateSession() {
        return {
            id: this.id,
            token: this.generateLoginToken(),
            user: this.toClient(),
        } as const
    }

    /**
     * 检查用户名是否合法（符合新用户注册标准）
     * *旧用户仍然允许使用不合法的用户名*
     */
    public isUsernameValid(username = this.username) {
        const validator = new Validator()
        if (validator.isNumberString(username)) {
            return false
        }

        if (validator.contains(username, '@')) {
            return false
        }

        // noinspection RedundantIfStatementJS
        if (username.length < 5 || username.length > 20) {
            return false
        }

        return true
    }
}
