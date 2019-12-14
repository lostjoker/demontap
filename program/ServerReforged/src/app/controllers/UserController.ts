import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException,
    Get,
    Post,
    Query,
    UnauthorizedException,
} from '@nestjs/common'
import { LoginDto, RegDto } from '../dto/UserDTO'
import { UserService } from '../services/modules/UserService'
import User from '../models/User'
import { Validator } from 'class-validator'
import { TokenToUserPipe } from '../guards/TokenToUserPipe'
import { UserFromToken } from '../../util/NestUtil'
import Player from '../game/Player'
import { GameService } from '../services/modules/GameService'
import EthService from '../services/external/EthService'
import GmudException from '../../core/GmudException'

type LoginResp = {}

@Controller('user')
export default class UserController {
    static getRedisKeyForResetCode(code: string) {
        return `emailresetpassword:${code}`
    }

    constructor(private readonly service: UserService, private readonly game: GameService) {}

    @Get('touch')
    touch() {
        return 'ok'
    }

    @Get('data')
    async getData(@Query('token', TokenToUserPipe) user: User, @Query('target') target?: number) {
        if (typeof target === 'undefined') {
            target = user.id
        }

        if (target !== user.id) {
            // todo 管理员获取其他人数据
            throw new UnauthorizedException('无权限')
        }

        return user.toClient()
    }

    /**
     * 检查token是否正确且未过期，如果是则刷新一个token，否则返回错误
     */
    @Post('token')
    async checkToken(@UserFromToken() user: User): Promise<LoginResp> {
        return { token: user.generateLoginToken(), id: user.id }
    }

    /**
     * 检查token是否正确且未过期，如果是则刷新一个token，否则返回错误
     */
    @Post('session')
    async updateSession(@UserFromToken() user: User) {
        return user.generateSession()
    }

    @Post('reg')
    async reg(@Body() data: RegDto): Promise<LoginResp> {
        const validator = new Validator()

        if (validator.isNumberString(data.username)) {
            throw new BadRequestException('用户名不能为纯数字')
        }

        return await this.service.reg(data)
    }

    @Post('login')
    async login(@Body() data: LoginDto): Promise<LoginResp> {
        const { username, password } = data

        let res: { user: User; token: string; player: Player }
        if (username && password) {
            res = await this.service.loginByPwd(username, password)
        } else if (data.token) {
            const verifyToken = await User.loginTokens.verify(data.token)
            const user = await User.findOne(verifyToken.id)

            if (!user) {
                throw new GmudException('请重新登录！')
            }

            const player = this.game.generatePlayerData(user)

            res = { user, player, token: user.generateLoginToken() }
        } else {
            throw new BadRequestException('缺少数据！')
        }

        const game = this.game

        res.player = game.generatePlayerData(res.user)

        let offlineData: any = {}
        if (data.oldPlayer) {
            game.syncPlayer(res.player, data.oldPlayer)
            offlineData = game.calcOfflineData(res.player)
            if (offlineData && offlineData.getgold) {
                res.player.gold += offlineData.getgold
                offlineData.getgold /= 10000
            }
            res.user.playerData = res.player
            await res.user.save()
        }

        return {
            player: res.player,
            token: res.user.generateLoginToken(),
            offlineData,
        }
    }

    @Post('changeUsername')
    async changeUsername(
        @Body('token', TokenToUserPipe) user: User,
        @Body('newUsername') newUsername: string,
    ) {
        // 只允许在用户名非法的条件下修改用户名为合法
        if (user.isUsernameValid()) {
            throw new ForbiddenException('当前禁止修改用户名！')
        }

        if (!user.isUsernameValid(newUsername)) {
            throw new BadRequestException('新用户名不合法！')
        }

        await this.service.changeUsername(user, newUsername)

        return user.generateSession()
    }
}
