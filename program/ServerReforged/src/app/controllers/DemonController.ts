import { Body, Controller, ForbiddenException, Post } from '@nestjs/common'
import { UserFromToken } from '../../util/NestUtil'
import User from '../models/User'
import Player from '../game/Player'
import { GameService } from '../services/modules/GameService'
import GamedataService from '../services/core/GamedataService'

@Controller('demon')
export default class DemonController {
    constructor(private readonly game: GameService, private readonly gamedata: GamedataService) {}

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
        const cashCost = goldCost / 10000
        if (player.cash >= cashCost) {
            player.gold -= goldCost
            player.demon.level[uptype] += 1

            await user.save()

            return {
                goldCost,
                level: player.demon.level,
                player,
            }
        } else {
            throw new ForbiddenException(this.gamedata.getText('UI/hint_not_enough_egt'))
        }
    }
}
