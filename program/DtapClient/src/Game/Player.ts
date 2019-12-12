/**
 *
 * @author SeASon
 * 游戏中的玩家
 */
class Player {
    public get cash() {
        return this.gold / 10000 + this.egtCash
    }
    public static token: string = null
    public static me: Player = null

    // 玩家状态，与服务器同步
    public static STATUE = {
        OFFLINE: 100,
    }

    /**
     * 等级别称
     */
    public static LEVEL_NAME = [
        {
            NAME: '小骑士',
            VALUE: 0,
            BGCOLOR: 0x999999,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '骑士学徒',
            VALUE: 2000,
            BGCOLOR: 0x58ff97,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '见习骑士',
            VALUE: 5000,
            BGCOLOR: 0x3fdc7a,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '新骑士',
            VALUE: 10000,
            BGCOLOR: 0x2db661,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '青铜骑士I',
            VALUE: 15000,
            BGCOLOR: 0x408d17,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '青铜骑士II',
            VALUE: 25000,
            BGCOLOR: 0x408d17,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '青铜骑士III',
            VALUE: 40000,
            BGCOLOR: 0x408d17,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '白银骑士I',
            VALUE: 60000,
            BGCOLOR: 0xbbd0c1,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '白银骑士II',
            VALUE: 80000,
            BGCOLOR: 0xbbd0c1,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '白银骑士III',
            VALUE: 100000,
            BGCOLOR: 0xbbd0c1,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '白银骑士IV',
            VALUE: 125000,
            BGCOLOR: 0xbbd0c1,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '黄金骑士I',
            VALUE: 150000,
            BGCOLOR: 0xffb400,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '黄金骑士II',
            VALUE: 175000,
            BGCOLOR: 0xffb400,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '黄金骑士III',
            VALUE: 200000,
            BGCOLOR: 0xffb400,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '黄金骑士IV',
            VALUE: 250000,
            BGCOLOR: 0xffb400,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '黄金骑士V',
            VALUE: 300000,
            BGCOLOR: 0xffb400,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '白金骑士I',
            VALUE: 350000,
            BGCOLOR: 0xfff8be,
            TEXT_COLOR: 0xe3c574,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '白金骑士II',
            VALUE: 400000,
            BGCOLOR: 0xfff8be,
            TEXT_COLOR: 0xe3c574,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '白金骑士III',
            VALUE: 500000,
            BGCOLOR: 0xfff8be,
            TEXT_COLOR: 0xe3c574,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '白金骑士IV',
            VALUE: 600000,
            BGCOLOR: 0xfff8be,
            TEXT_COLOR: 0xe3c574,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '白金骑士V',
            VALUE: 700000,
            BGCOLOR: 0xfff8be,
            TEXT_COLOR: 0xe3c574,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '黑金骑士I',
            VALUE: 800000,
            BGCOLOR: 0x5e5719,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '黑金骑士II',
            VALUE: 1000000,
            BGCOLOR: 0x5e5719,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '黑金骑士III',
            VALUE: 1200000,
            BGCOLOR: 0x5e5719,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '黑金骑士IV',
            VALUE: 1400000,
            BGCOLOR: 0x5e5719,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '黑金骑士V',
            VALUE: 1600000,
            BGCOLOR: 0x5e5719,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '钻石骑士I',
            VALUE: 1800000,
            BGCOLOR: 0x93e5fd,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '钻石骑士II',
            VALUE: 2000000,
            BGCOLOR: 0x93e5fd,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '钻石骑士III',
            VALUE: 2500000,
            BGCOLOR: 0x93e5fd,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '钻石骑士IV',
            VALUE: 3000000,
            BGCOLOR: 0x93e5fd,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '钻石骑士V',
            VALUE: 3500000,
            BGCOLOR: 0x93e5fd,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '圣骑士',
            VALUE: 4000000,
            BGCOLOR: 0x01c3fb,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
        {
            NAME: '神圣骑士',
            VALUE: 5000000,
            BGCOLOR: 0x915cfc,
            TEXT_COLOR: 0xffffff,
            STROKE_COLOR: 0x000000,
        },
    ]

    /**
     * 箱子数据列表
     */
    public static CHEST = {
        1001: {
            TIME: 10000,
        },
        1002: {
            TIME: 20000,
        },
        1003: {
            TIME: 120000,
        },
        1004: {
            TIME: 1200000,
        },
        1005: {
            TIME: 12000000,
        },
    }

    /**
     * 物品列表
     */
    public static ITEM = {
        1001: {
            name: '测试物品1',
            img: 'icon_help_png',
            desc: '11111',
            max: 999,
        },
        1002: {
            name: '测试物品2',
            img: 'icon_help_png',
            desc: '22222',
            max: 111,
        },
        1003: {
            name: '测试物品3',
            img: 'icon_help_png',
            desc: '22222',
            max: 111,
        },
        1004: {
            name: '测试物品4',
            img: 'icon_help_png',
            desc: '22222',
            max: 111,
        },
        1005: {
            name: '测试物品5',
            img: 'icon_help_png',
            desc: '22222',
            max: 111,
        },
        1006: {
            name: '测试物品6',
            img: 'icon_help_png',
            desc: '22222',
            max: 111,
        },
        1007: {
            name: '测试物品7',
            img: 'icon_help_png',
            desc: '22222',
            max: 111,
        },
    }

    // 成就数据
    public static ACHIEVEMENT = {
        1001: {
            name: '我是梅林',
            desc: '以梅林获得 1 场胜利',
            desc_got: '以梅林获得 1 场胜利（已完成）',
        },
        3000: {
            name: '神秘成就',
            desc: '这个世纪确实存在着一些未知的秘密，也许只有你能发现',
            desc_got: '所以这个游戏叫刺杀奥伯伦！（已完成）',
        },
        10000: {
            name: '神秘成就',
            desc: '这个世纪确实存在着一些未知的秘密，也许只有你能发现',
            desc_got: '这个世纪确实存在着一些未知的秘密，也许只有你能发现（已完成）',
        },
    }

    /**
     * 生成随机头像
     */
    public static randomFace(): string {
        const count: number = 0
        return 'MERLIN_001'
    }

    /**
     * 根据总经验计算玩家等级
     */
    public static CalCPlayerLevel(exp: number): number {
        for (let i = 0; i < Player.LEVEL_NAME.length; ++i) {
            if (Player.LEVEL_NAME[i].VALUE > exp) {
                return i - 1
            }
        }
        return 0
    }

    /**
     * 某状态玩家在数据列表中的数目
     */
    public static StatueCount(players: Player[], statue: number): number {
        let count = 0
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < players.length; ++i) {
            if (players[i].statue === statue) {
                ++count
            }
        }
        return count
    }

    /**
     * 根据玩家名返回玩家对象
     */
    public static GetPlayerByName(players: Player[], name: string): Player {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < players.length; ++i) {
            if (players[i].name === name) {
                return players[i]
            }
        }
        return null
    }

    // /**
    //  * 初始化怪物数据
    //  */
    // public initMonsterList(monsters): void {
    //     if (!monsters)
    //         return;
    //     this.monsterlist = [];
    //     for (let i = 0; i < monsters.length; ++i) {
    //         this.monsterlist[i] = new Monster(monsters[i]);
    //     }
    // }
    egtCash: number = 0

    // 金钱变化量
    public goldEarned = 0

    // 玩家id
    public id: string

    // 玩家名
    public name: string

    // 性别
    public sex: string

    // 玩家密码
    public pwd: string

    // 头像
    public face: string

    // 玩家状态，与服务器同步：游戏状态，观看状态等
    public statue: number

    // 是否是注册玩家
    public isreg: boolean

    // 是否被禁止的玩家
    public isbanned: boolean

    // 使用的恶魔
    public demon: Demon

    public monsters: Monster[]

    // 守卫的英雄
    public defendhero: Hero

    // 头像卡
    public facecard: PlayerFaceCard

    // 关联的IdCard
    public idcard: PlayerIdCard

    // 标记是否为玩家自己
    public me: boolean = false

    // 注册时间
    public regtime: number

    // 最后登录时间
    public logintime: number

    // 等级
    public level: number

    // 关注列表
    public follow: string

    // 仓库
    public bag: string

    // 当前区域idx
    public area: number

    // 当前关卡id
    public stage: number

    // 时间箱
    public chest: string

    // 最后个箱子开启时间
    public lastchestopenedtime: number

    // 社交消息列表
    public social_msg = {}

    // 社交状态列表
    public social_statue = {}

    // 排名
    public rank: number

    // 使用自定义头像
    public useCustomAvatar: boolean = false

    public avatarkey: string = ''

    public inventory: GameItem[]

    public altar: { [key: number]: number }

    // eth充值地址
    ethChargeAddr: string

    /**
     * 本地更新时间
     */
    public updateTime = 0

    // 授权获得的信息
    public authdata = {
        platform: null,
        username: null,
        userid: null,
        gender: null,
        icon: null,
    }

    gold = 0

    public constructor(data = null) {
        this.update(data)
    }
    public earnGold(gold: number) {
        // this.goldEarned += gold
        this.gold += gold
    }

    /**
     * 将数据与服务器同步
     */
    public async syncWithServer() {
        await this.updateLocal()
        // const goldEarnedBefore = this.goldEarned
        const res = await NetWork.requestWithToken('stage/sync', {
            player: this,
            goldEarned: this.goldEarned,
        })

        if (res.ok) {
            const playerdata = res.data
            this.update(playerdata.player)

            // const goldEarnedAfter = this.goldEarned
            // const goldChanged = goldEarnedAfter - goldEarnedBefore
            // if (goldChanged !== 0) {
            //     dtap.debug(`${goldChanged} gold changed during sync`)
            // }
            // this.goldEarned = goldChanged
        }
    }

    /**
     * 更新本地储存
     */
    public updateLocal(): Promise<void> {
        // TODO: 遇到特殊情况可能会需要更改
        if (GameUI.Instance && GameUI.Instance.fight && GameUI.Instance.fight.currentArea) {
            this.area = GameUI.Instance.fight.currentArea.id
            this.stage = GameUI.Instance.fight.currentArea.stage
        }

        this.updateTime = Date.now()
        return DemonStorage.DemonKV.put('player', this)
    }

    public updateMonsterList(data: any[] = []) {
        this.monsters = data ? data.map(it => new Monster(it)) : []
    }

    public updateInventory(data: any[] = []) {
        this.inventory = data ? data.map(it => new GameItem(it)) : []
    }

    /**
     * 根据数据更新玩家信息
     */
    public update(data = null): void {
        if (data) {
            Object.assign(this, data)

            this.updateTime = data.updateTime || Date.now()
            this.area = data.area ? data.area : 0
            this.stage = data.stage ? data.stage : 0
            this.demon = Demon.Factory(data.demon)

            const herodata = data.defendhero
            if (herodata) {
                herodata.isdefend = true
                this.defendhero = Hero.Factory(herodata)
            }
            this.altar = data.altar || {}
            this.isreg = data.isreg
            this.id = data.id
            this.name = data.name
            this.sex = data.sex
            this.pwd = data.pwd
            this.face = data.face
            this.regtime = data.regtime
            this.logintime = data.logintime
            this.follow = data.follow ? data.follow : ''
            this.bag = data.bag ? data.bag : ''
            this.chest = data.chest ? data.chest : ''
            this.lastchestopenedtime = data.lastchestopenedtime ? data.lastchestopenedtime : 0
            this.statue = data.statue

            this.rank = data.rank
            this.useCustomAvatar = data.useCustomAvatar
            this.avatarkey = data.avatarkey

            this.updateMonsterList(data.monsters)
            this.updateInventory(data.inventory)

            if (GameUI.Instance) {
                GameUI.Instance.updatePlayer()
            }
        }
    }

    /**
     * 已登录
     */
    public logged(): void {
        this.facecard.dataIn(this)
    }

    /**
     * 同步来自服务端的玩家信息
     */
    public updateInGame(data): void {
        //
    }

    /**
     * 检查指定的祭坛技能是否已学会
     */
    public isAltarSkillLearned(id: number): boolean {
        const group = GameData.getAltarData().AltarSkill[id].group
        const level = this.altar[group] || 0
        const findLvl = GameData.getAltarGroup(group).findIndex(value => value.id === id)

        return level > findLvl
    }

    public getSkillLvl(skillid: number): number {
        const DemonSkillLevel = GameData.getDemonData().DemonSkillLevel
        const column = `skill${skillid}_demon_lvl`

        let result = 0

        for (let lvl = 1; DemonSkillLevel[lvl]; ++lvl) {
            const line = DemonSkillLevel[lvl]
            if (this.demon.level.lvl >= line[column]) {
                result = lvl
            } else {
                break
            }
        }

        return result
    }
}
