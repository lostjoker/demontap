import { Injectable } from '@nestjs/common'
import moment from 'moment'
import GamedataService from '../core/GamedataService'
import { randInt } from '../../../util/CommonUtil'
import User from '../../models/User'
import Player from '../../game/Player'
import _ from 'lodash'

@Injectable()
export class GameService {
    constructor(private readonly gamedata: GamedataService) {}

    /**
     * 计算离线收益
     * @param player
     */
    calcOfflineData(player: Player) {
        if (!player.updateTime) return
        const now = moment()
        const offlineTime = now.diff(moment(player.updateTime))

        const c = this.gamedata.C

        const taps = offlineTime / (c.TIME.SPEED_BASE / (1 + this.calcSpd(player) / 100))
        if (taps <= 0) {
            return {}
        }
        // 平均点击伤害
        const damagePerTap =
            this.calcAtk(player) * (1 + this.calcCri(player) / 100) * c.VALUES.CRI_RATE
        const areadata = {
            area: player.area,
            stage: player.stage,
        }
        const enemy = this.genHero(areadata)
        // 击倒敌人数量
        const enemydefeats = Math.floor((damagePerTap * taps) / enemy.hp)
        if (enemydefeats <= 0) {
            return {}
        }
        const getgold = enemydefeats * enemy.gold
        return {
            enemydefeats,
            getgold,
        }
    }

    /**
     * 计算demon的攻击最终值
     */
    calcAtk(player: Player) {
        return player.demon.level.atk * 2
    }

    /**
     * 计算demon的暴击最终值
     */
    calcCri(player: Player) {
        return player.demon.level.cri
    }

    /**
     * 计算demon的速度最终值
     */
    calcSpd(player: Player) {
        return player.demon.level.spd
    }

    /**
     * 生成英雄
     * 英雄HP = (英雄LV * 英雄LV * 英雄HP系数) * 稀有系数
     */
    genHero(data?: { area?: number; stage?: number }) {
        const hero: any = {}
        hero.level = 1
        if (data && data.area && data.stage) {
            const { area } = data

            const areaData = _.find(this.gamedata.areaData.Area, it => it.id === area)

            const heros = areaData.hero_list.split(',')

            hero.id = Number(_.sample(heros))
            const heroData = this.gamedata.heroData.Hero[hero.id]
            hero.level = randInt(areaData.level_min, areaData.level_max)
            hero.hp_min = heroData.hp_min
            hero.hp_max = heroData.hp_max

            // hero.level = (data.area + 1) * c.VALUES.AREA_STAGES + (data.stage + 1);
            //
            // const heroid = parseInt(App.areaData.Area[data.area].hero_list.split(",")[0]);
            // hero = App.heroData.Hero[heroid];
        } else {
            const c = this.gamedata.C
            hero.hp_min = Math.floor(
                this.gamedata.DATA_HERO_BASE.BaseHero.HP_MIN *
                    (hero.level / c.VALUES.AREA_STAGES + 1),
            )
            hero.hp_max = Math.floor(
                this.gamedata.DATA_HERO_BASE.BaseHero.HP_MAX *
                    (hero.level / c.VALUES.AREA_STAGES + 1),
            )
            hero.gold = Math.floor(
                this.gamedata.DATA_HERO_BASE.BaseHero.GOLD *
                    (hero.level / c.VALUES.AREA_STAGES + 1),
            )
        }

        hero.hp = randInt(hero.hp_min, hero.hp_max)

        // 英雄HP = (英雄LV * 英雄LV * 英雄HP系数) * 稀有系数
        hero.hp *= hero.level * hero.level * (hero.hp_ratio || 1)

        return hero
    }

    /**
     * 将服务端玩家与客户端玩家同步。
     * @param serverPlayer 服务端玩家数据
     * @param clientPlayer 客户端玩家数据
     * @param unreliable 客户端不可靠数据
     */
    syncPlayer(serverPlayer: Player, clientPlayer: Player, unreliable: any = {}) {
        // TODO: 加入验证

        // FIXME: 暂时均以客户端数据为准，稍后加入更精确的同步判断
        if (unreliable.goldEarned) {
            serverPlayer.gold += unreliable.goldEarned
        }

        serverPlayer.gold = clientPlayer.gold
        serverPlayer.area = clientPlayer.area
        serverPlayer.stage = clientPlayer.stage
        serverPlayer.demon = clientPlayer.demon
        serverPlayer.defendhero = clientPlayer.defendhero
        serverPlayer.updateTime = clientPlayer.updateTime

        return serverPlayer
    }

    generatePlayerData(user: User) {
        const res = new Player(user.playerData)
        res.ethChargeAddr = user.ethChargeAddr
        res.egtCash = Number(user.egtCash)
        user.playerData = res
        return res
    }
}
