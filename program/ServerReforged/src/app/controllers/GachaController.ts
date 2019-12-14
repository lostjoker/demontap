import { Body, Controller, Post } from '@nestjs/common'
import { UserFromToken } from '../../util/NestUtil'
import User from '../models/User'
import GamedataService from '../services/core/GamedataService'
import { GameService } from '../services/modules/GameService'
import GmudException from '../../core/GmudException'
import * as log4js from 'log4js'
import { randInt } from '../../util/CommonUtil'
import _ from 'lodash'
import { UserService } from '../services/modules/UserService'

@Controller('gacha')
export default class GachaController {
    private readonly logger = log4js.getLogger(this.constructor.name)

    constructor(
        private readonly gamedata: GamedataService,
        private readonly game: GameService,
        private readonly userService: UserService,
    ) {}

    @Post('gacha0')
    async gacha0(@UserFromToken() user: User, @Body('gachaType') gachaType: string) {
        const player = this.game.generatePlayerData(user)
        user.playerData = player

        let cashCost = 1000

        if (gachaType === 'egt') {
            cashCost = 10000
        }

        if (player.cash < cashCost) {
            throw new GmudException(this.gamedata.getText('UI/hint_not_enough_egt'))
        }

        const monsterData = this.gamedata.monsterData.Monster

        let totalWeight = 0
        const monsterPool: any[] = []

        // tslint:disable-next-line:no-shadowed-variable
        _.forEach(monsterData, monster => {
            if (monster.gold_gacha > 0) {
                totalWeight += monster.gold_gacha
                monsterPool.push(monster)
            }
        })

        let randomNumber = Math.random() * totalWeight
        let i = 0
        while (randomNumber > monsterPool[i].gold_gacha) {
            randomNumber -= monsterPool[i].gold_gacha
            i++
        }

        const monster = monsterPool[i]

        player.addCash(-cashCost)

        let soul = 0
        let msg = ''

        const playerMonster = player.monsters.find(it => it.id === monster.id)
        const monsterName = this.gamedata.getText('MonsterName/' + playerMonster.id)

        if (monster.gold_gacha_whole > Math.random() * 100) {
            // 获得完整怪
            if (!playerMonster.activated) {
                playerMonster.activated = true
                msg = this.gamedata.getText('UI/hint_monster_got', monsterName)
            } else {
                soul = monster.gold_gacha_max + 2
                msg = this.gamedata.getText('UI/hint_monster_got_1', monsterName, soul)
                // msg = `你获得了【${playerMonster.name}】（已自动分解为${soul}个灵魂）`
            }
        } else {
            // 获得灵魂碎片数量
            soul = randInt(monster.gold_gacha_min, monster.gold_gacha_max)
            msg = this.gamedata.getText('UI/hint_soul_got', soul, monsterName)
            // msg = `你获得了${soul}个【${playerMonster.name}】灵魂`
        }

        player.giveMonsterSoul(monster.id, soul)

        this.logger.trace(`玩家${player.name}扭蛋结果：${msg}`)

        await user.save()

        return {
            player,
            newSouls: player.monsters,
            msg,
        }
    }

    @Post('activate')
    async activate(@UserFromToken() user: User, @Body('id') id: number) {
        const player = this.game.generatePlayerData(user)
        user.playerData = player

        const monsterData = this.gamedata.monsterData.Monster[id]

        if (!(monsterData && monsterData.vaild)) {
            throw new GmudException('数据错误！')
        }

        const playerMonster = player.monsters.find(it => it.id === id)

        if (playerMonster.activated) {
            throw new GmudException('已激活过！')
        }

        if (playerMonster.soulCount < monsterData.compose) {
            throw new GmudException(this.gamedata.getText('UI/hint_soul_not_enough'))
        }

        playerMonster.activated = true
        playerMonster.soulCount -= monsterData.compose

        await user.save()

        return {
            newSouls: player.monsters,
            newMonster: playerMonster,
        }
    }
}
