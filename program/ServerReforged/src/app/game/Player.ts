/**
 * 玩家类
 */
import Monster, { PlayerMonsterData } from './Monster'
import ShopItem from './ShopItem'
import GameItem from './GameItem'
import _ from 'lodash'
import GamedataService from '../services/core/GamedataService'
import { getService } from '../../util/GetService'

export default class Player {
    /**
     * 战力（暂定）
     */
    public get fightingStrength(): number {
        return this.area
    }

    public get cash(): number {
        return this.gold / 10000 + this.egtCash
    }

    /**
     * 创建新的玩家，并加入到数据库中。
     * @param obj
     * @return {Promise<Player>}
     */
    static create(obj: Player | any): Promise<Player> {
        const player = new Player(obj)
        // return playermodel.create(player).then(() => {
        //     return Promise.resolve(player)
        // })
        return Promise.resolve(player)
    }
    egtCash: number

    /**
     * eth充值地址
     */
    ethChargeAddr: string = ''

    /**
     * 魔王名
     */
    name: string = ''

    /**
     * 手机号
     */
    phone: string = ''

    /**
     * 注册时间
     * @readonly
     */
    regtime: number = new Date().valueOf()

    /**
     * 上次登录时间
     */
    logintime: number = new Date().valueOf()

    /**
     * 上次活动时间
     */
    acttime: number = new Date().valueOf()

    /**
     * 客户端更新时间
     */
    updateTime: number = new Date().valueOf()

    /**
     * 上次商店刷新点
     */
    shopRefreshPoint: number = 0

    /**
     * 注册时的ip
     */
    regip: string = ''

    /**
     * 金币
     */
    gold: number = 0

    /**
     * 不可靠金钱
     */
    goldEarned: number = 0

    /**
     * 宝石
     */
    gem: number = 0

    /**
     * 区域
     */
    area: number = 0

    /**
     * 关卡
     */
    stage: number = 0

    /**
     * 掠夺点数
     */
    robPoint: number = 0

    /**
     * 魔王
     */
    demon: any = {
        id: 100,
        level: {
            lvl: 1,
            atk: 1,
            cri: 1,
            spd: 1,
        },
        skill: [],
    }

    /**
     * 防守英雄
     */
    defendhero: any = {}

    /**
     * 怪物
     */
    monsters: Monster[] = []

    /**
     * 商店中的物品
     */
    shop: ShopItem[][] = []

    /**
     * 物品栏
     */
    inventory: GameItem[] = []

    /**
     * @param obj
     * @param clientData {boolean} 是否为发给客户端的数据
     * @private
     */
    constructor(obj: Partial<Player>, clientData = false) {
        Object.assign(this, obj)

        this.initMonsterList(obj.monsters ?? [])
        this.initShop(obj.shop ?? [])
        this.initInventory(obj.inventory ?? [])
    }

    /**
     * 整理物品栏
     */
    public orderInventory() {
        const newInv: GameItem[] = []
        _.forEach(getService(GamedataService).itemData.Item, itemTemplate => {
            const items = _.filter(this.inventory, it => it.id === itemTemplate.id)
            let count = _.sumBy(items, it => it.count)

            while (count > 0) {
                const giveCount = Math.min(count, itemTemplate.troop)
                newInv.push(new GameItem(itemTemplate.id, giveCount))
                count -= giveCount
            }
        })

        this.inventory = newInv
    }

    public giveMonsterSoul(id: number, count: number) {
        this.monsters = this.monsters || []

        const record = this.monsters.find(it => it.id === id)
        if (!record) {
            throw new Error('怪物列表中不存在id:' + id)
        }

        record.soulCount += count
    }

    addCash(value: number) {
        this.gold += value * 10000
    }

    /**
     * 初始化物品栏
     * @param data 物品栏数据
     */
    private initInventory(data: GameItem[]): void {
        this.inventory = _.map(data, it => new GameItem(it.id, it.count))
        this.orderInventory()
    }

    /**
     * 初始化怪物列表
     * @param data 怪物列表数据
     */
    private initMonsterList(data: PlayerMonsterData[]): void {
        this.monsters = _.chain(getService(GamedataService).monsterData.Monster as any)
            .toArray()
            .filter(it => it.vaild > 0)
            .map(it => {
                const id = it.id
                const datum = _.find(data, mdata => mdata.id === id) || { id }

                return new Monster(datum)
            })
            .value()
    }

    /**
     * 初始化商店数据
     * @param data 用于初始化的数据
     */
    private initShop(data: ShopItem[][]): void {
        const SHOP_COUNT = 6

        if (!this.shop) this.shop = []
        while (this.shop.length < SHOP_COUNT) {
            this.shop.push([])
        }

        for (let i = 0; i < this.shop.length; i++) {
            const shopData = data[i]
            if (shopData) {
                for (const j of shopData) {
                    if (j && j.id && j.count) this.shop[i].push(new ShopItem(j.id, j.count, j.sold))
                }
            }
        }
    }
}
