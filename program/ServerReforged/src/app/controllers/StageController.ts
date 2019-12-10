import { Body, Controller, Injectable, Post } from '@nestjs/common'
import GamedataService from '../services/core/GamedataService'
import { UserFromToken } from '../../util/NestUtil'
import User from '../models/User'
import { GameService } from '../services/modules/GameService'
import Player from '../game/Player'

@Controller('stage')
export default class StageController {
    constructor(private readonly gamedata: GamedataService, private readonly game: GameService) {}

    @Post('kill')
    kill(@UserFromToken() user: User) {
        const player = this.game.generatePlayerData(user)

        //
    }

    /**
     * 同步 临时用 之后改掉
     * @param user
     * @param clientPlayer
     */
    @Post('sync')
    async sync(@UserFromToken() user: User, @Body('player') clientPlayer: Player) {
        user.playerData = this.game.syncPlayer(this.game.generatePlayerData(user), clientPlayer)
        await user.save()
        return { player: user.playerData }
    }
}
