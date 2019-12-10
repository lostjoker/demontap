import { Body, Controller, ForbiddenException, Post } from '@nestjs/common'
import { UserFromToken } from '../../util/NestUtil'
import User from '../models/User'
import Player from '../game/Player'
import { GameService } from '../services/modules/GameService'

@Controller('demon')
export default class DemonController {
    constructor(private readonly game: GameService) {}

    /**
     * 【请求】升级恶魔
     */
    @Post('upDemonLevel')
    async upDemonLevel(
        @UserFromToken() user: User,
        @Body('uptype') uptype: string,
        @Body('player') clientPlayer: Player,
    ) {
        let player = this.game.generatePlayerData(user)
        player = await this.game.syncPlayer(player, clientPlayer)

        const goldCost = player.demon.level[uptype] * 10
        if (player.gold >= goldCost) {
            player.gold -= goldCost
            player.demon.level[uptype] += 1

            await user.save()

            return {
                goldCost,
                level: player.demon.level,
                player,
            }
        } else {
            throw new ForbiddenException('金钱不足')
        }
    }
}
