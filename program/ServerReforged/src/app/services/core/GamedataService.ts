import { Injectable, OnModuleInit } from '@nestjs/common'

import jsonfile from 'jsonfile'
import { AltarData, AreaData, HeroData, ItemData, MonsterData } from 'Gamedata'
import * as log4js from 'log4js'
import Player from '../../game/Player'

@Injectable()
export default class GamedataService implements OnModuleInit {
    monsterData: MonsterData
    areaData: AreaData
    heroData: HeroData
    itemData: ItemData
    altarData: AltarData

    readonly C = {
        TIME: {
            SECOND: 1000,
            SPEED_BASE: 1000,
        },
        VALUES: {
            AREA_STAGES: 10,
            CRI_RATE: 1.5,
        },
    } as const

    readonly DATA_HERO_BASE = {
        BaseHero: {
            HP_MIN: 5,
            HP_MAX: 10,
            GOLD: 2,
        },
        WarriorHero: {
            HP_MIN: 8,
            HP_MAX: 12,
            GOLD: 3,
        },
        MageHero: {
            HP_MIN: 5,
            HP_MAX: 10,
            GOLD: 3,
        },
    } as const

    private readonly logger = log4js.getLogger(this.constructor.name)

    loadJsonFile(fileName: string): Promise<any | object> {
        this.logger.debug(`正在加载游戏数据JSON文件：${fileName}`)
        return new Promise((resolve, reject) => {
            jsonfile.readFile(fileName, (err, obj) => {
                if (obj) {
                    resolve(obj)
                } else {
                    reject(err)
                }
            })
        })
    }

    async onModuleInit() {
        this.monsterData = await this.loadJsonFile('./data/converted/monster_data.json')
        this.areaData = await this.loadJsonFile('./data/converted/area_data.json')
        this.heroData = await this.loadJsonFile('./data/converted/hero_data.json')
        this.itemData = await this.loadJsonFile('./data/converted/item_data.json')
        this.altarData = await this.loadJsonFile('./data/converted/altar_data.json')
    }
}
