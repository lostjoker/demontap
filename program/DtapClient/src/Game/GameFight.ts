/**
 * 战斗界面
 */
@disposable()
class GameFight extends eui.Component {
    @byLanguage()
    btn_moreMonsters

    monsterlist: eui.ArrayCollection

    timer_tap: egret.Timer

    timer_syn: egret.Timer

    /**
     * 正在掠夺
     */
    robbing: boolean = false

    tween_ingame = {
        damage: null,
        enemyshake: null,
    }

    boneres_hero = []

    bonesfactory: dragonBones.EgretFactory[] = [] // = new dragonBones.EgretFactory()
    armature: dragonBones.Armature
    armatureClip: dragonBones.EgretArmatureDisplay[] = []

    effect_tap: Tap

    g_currentdata: eui.Group
    g_activeskill: eui.Group

    img_bg: eui.Image
    lbl_stage: eui.Label
    img_enemy: eui.Image
    lbl_enemyinfo: eui.Label
    lbl_damage: eui.Label
    img_gold: eui.Image
    lbl_gold: eui.Label
    g_scatter: eui.Group
    g_currentmonster: eui.Group
    scroller_monster: eui.Scroller
    g_monster: eui.DataGroup
    g_mscroller: eui.Group

    lbl_robInfo: eui.Label
    lbl_remaintime: eui.Label
    btn_giveupRob: eui.Button

    gpb_hp: GameProgressBar
    gpb_remaintime: GameProgressBar

    rect_matching: eui.Rect
    btn_startrob: eui.Button
    btn_changerob: eui.Button

    currentEnemy: Hero
    currentArea: Area

    percentHeight = null
    percentWidth = null
    mainBtnGroup: MainBtnGroup

    lblDemonDmg: eui.Label
    lblMonsterDmg: eui.Label
    lblTotalDmg: eui.Label
    lblMp: eui.Label

    /**
     * 剩余掠夺时间
     */
    private robTime = 100
    private robbingPlayer: any

    private timer_rob: egret.Timer

    private currentTaps = 0

    constructor() {
        super()
        this.skinName = 'gameFight'
    }

    @eventListener(egret.Event.ENTER_FRAME)
    update() {
        if (this.isNotFighting()) {
            return
        }
        //
        if (this.currentTaps > 0) {
            this.currentTaps--
            this.dealDamage()
        }

        this.updateGameDataAndView()
    }

    /**
     * 初始化龙骨
     */
    initDragonBones(): void {
        // 初始化龙骨部分
        // for (let i = 0; i < Hero.TYPES.length; ++i) {
        //     let res = {
        //         ske_json: RES.getRes("hero" + i + "_ske_json"),
        //         tex_json: RES.getRes("hero" + i + "_tex_json"),
        //         tex_png: RES.getRes("hero" + i + "_tex_png")
        //     };
        //     this.boneres_hero.push(res);
        //     this.bonesfactory[i] = new dragonBones.EgretFactory();
        //     this.bonesfactory[i].parseDragonBonesData(res.ske_json);
        //     this.bonesfactory[i].parseTextureAtlasData(res.tex_json, res.tex_png);
        //     this.armatureClip[i] = this.bonesfactory[i].buildArmatureDisplay("Armature");
        //     this.armatureClip[i].x = (this.width - this.armatureClip[i].width) / 2;
        //     this.armatureClip[i].y = this.img_bg.top + this.img_bg.height - this.armatureClip[i].height;
        // (this.height - this.armatureClip[i].height) / 2;
        //     //暂以此方式居中，之后需同步龙骨中的坐标
        //     this.armatureClip[i].anchorOffsetX = - this.armatureClip[i].width / 2;
        //     this.armatureClip[i].anchorOffsetY = - this.armatureClip[i].height / 2;
        //     // console.log(this.armatureClip[i].anchorOffsetX + " , " + this.armatureClip[i].anchorOffsetY);
        //     this.addChild(this.armatureClip[i]);
        //     this.armatureClip[i].visible = false;
        // }
    }

    /**
     * 掠夺
     */
    async robPlayer() {
        if (!NetWork.isOnline()) {
            await Dialog.Show('网络已断开！')
            return
        }

        // 显示界面
        this.img_enemy.visible = false
        this.rect_matching.visible = true
        this.btn_startrob.visible = false
        this.btn_changerob.visible = false

        // 模拟一段随机时间来匹配玩家
        const time = dtap.randInt(1000, 3000)
        const [res] = await Promise.all([
            NetWork.requestWithToken('game/rob', { player: Player.me }),
            dtap.waitTime(time),
        ])

        // const res = await NetWork.requestWithToken("game/rob", { player: Player.me });
        if (res.ok) {
            const { player } = res.data

            this.rect_matching.visible = false
            this.btn_startrob.visible = true
            this.btn_changerob.visible = true
            // this.startRob(player);
        } else {
            this.giveupRob()
            Tools.Hint(res.msg, this)
        }
    }

    @egretTimer({
        name: 'timer_rob',
        delay: 1000,
    })
    robTick() {
        if (!this.robbing) {
            this.timer_rob.stop()
            return
        }

        this.robTime--
        this.gpb_remaintime.update(this.robTime)
        this.lbl_remaintime.text = '剩余时间：' + this.robTime

        if (this.robTime <= 0) {
            this.giveupRob()
        }
    }

    @tapListener('btn_giveupRob')
    giveupRob() {
        this.robbing = false
        this.robbingPlayer = null
        this.currentState = 'skill'

        const herodata = {
            area: this.currentArea.id,
            stage: this.currentArea.stage,
        }
        this.currentEnemy = Hero.Factory(herodata)
        this.img_enemy.visible = true
        this.updateGameDataAndView()
    }

    /**
     * 点点点！！
     */
    @tapListener()
    tap(): void {
        if (this.isNotFighting()) {
            return
        }
        this.updateGameDataAndView()
        this.tapEffect()
        if (this.currentTaps < 5) this.currentTaps++
    }

    /**
     * 点击技能
     */
    tapSkill(e: egret.TouchEvent): void {
        const whichskill = parseInt(e.target.name.replace('btn_activeskill', ''))
        if (Player.me.getSkillLvl(whichskill) <= 0) {
            Tools.Hint('技能未解锁', this)
            e.stopPropagation()
            return
        }
        const data = {
            gameui: this,
            tapdmg: Player.me.demon.value.atk,
        }
        let result = Player.me.demon.skills[whichskill - 1].doEffect(data)
        result = parseInt(result + '')
    }

    /**
     * 点击效果
     */
    tapEffect(): void {
        // this.armatureClip[this.currentHero.type].animation.gotoAndPlay("beated", 0, 0, 1);
        if (!this.effect_tap) {
            this.effect_tap = new Tap(this)
        }
        this.effect_tap.start()
        const colorMatrix = [1, 0, 0, 0, 30, 0, 1, 0, 0, 30, 0, 0, 1, 0, 30, 0, 0, 0, 1, 0]
        const colorFlilter = new egret.ColorMatrixFilter(colorMatrix)
        this.tween_ingame.enemyshake = egret.Tween.get(this.img_enemy)
            .to({ filters: [colorFlilter] })
            .to({ horizontalCenter: this.img_enemy.horizontalCenter - 10, alpha: 1 }, 30)
            .to({ horizontalCenter: 0, alpha: 1 }, 30)
            .to({ horizontalCenter: this.img_enemy.horizontalCenter + 10, alpha: 1 }, 30)
            .to({ horizontalCenter: 0, alpha: 1 }, 30)
            .to({ filters: [] })

        // this.img_enemy.filters = [colorFlilter];
    }

    updateGameDataAndView(data = null): void {
        if (!this.currentEnemy) {
            return
        }

        this.gpb_hp.update(this.currentEnemy.hp)
        // this.dealDamage(data)

        // 外部字体没生效
        this.lbl_enemyinfo.fontFamily = 'fangzhengxiangsu'
        // this.lbl_enemyinfo.text =
        //     this.currentEnemy.name + '   ' + Tools.C_Num(this.currentEnemy.hp) + ''

        this.lbl_enemyinfo.text =
            GameData.getText(`HeroName/${this.currentEnemy.id}`) +
            '   ' +
            Tools.C_Num(this.currentEnemy.hp) +
            ''
    }

    /**
     * 刷新英雄资源贴图
     */

    refreshHeroSrc(): void {
        this.img_enemy.source = 'hero' + this.currentEnemy.res + '_png'
        this.img_enemy.visible = true
        this.img_enemy.validateNow()
        // this.img_enemy.smoothing = false;

        // for (let i = 0; i < this.armatureClip.length; ++i) {
        //     this.armatureClip[i].visible = false;
        // }
        // this.armatureClip[this.currentHero.type].visible = true;
        // for (let slotpart = 0; slotpart < this.currentHero.srcparts.length; ++slotpart) {
        //     let slot: dragonBones.Slot = this.armatureClip[this.currentHero.type].armature.getSlot(slotpart + "");
        //     let herosrctype: string = this.currentHero.srcparts[slotpart] + "";
        //     this.bonesfactory[this.currentHero.type].replaceSlotDisplay("hero" + this.currentHero.type,
        //         "Armature", slotpart + "", herosrctype + "_" + slotpart, slot);
        // }
    }

    /**
     * 更新当前数据区域
     */
    updateCurrentData(): void {
        //
    }

    /**
     * 更新主动技能区域
     */
    updateActiveSkill(): void {
        for (let i = 1; i <= DemonSkill.MAX_COUNT; ++i) {
            const btn: eui.Button = this.g_activeskill.getChildByName(
                'btn_activeskill' + i,
            ) as eui.Button
            ;(btn as any).imgDisplay.source = 'skill' + i + '_png'
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tapSkill, this)
        }
    }

    /**
     * 同步自身数据到界面上
     */
    @eventListener(dtap.EVENT_PLAYER_UPDATED, '@gameui')
    updatePlayer(): void {
        this.updateGoldDisplay()

        this.lblDemonDmg.text = GameData.getText(
            'UI/lblDemonDmg',
            Tools.C_Num(Player.me.demon.level.atk),
        )
        this.lblMonsterDmg.text = GameData.getText('UI/lblMonsterDmg', Tools.C_Num(0))
        this.lblTotalDmg.text = GameData.getText(
            'UI/lblTotalDmg',
            Tools.C_Num(Player.me.demon.level.atk),
        )
        this.lblMp.text = GameData.getText('UI/lblMp', '10 / 10')

        this.currentArea.id = Player.me.area
        this.currentArea.stage = Player.me.stage
        // 刷新，同步数据
        this.updateStageLabel()

        this.updateGameDataAndView()
        this.updateCurrentData()
        this.updateActiveSkill()
        this.updateMonsters()
    }

    setTapTimer(): void {
        if (this.timer_tap == null) {
            const cycle = Const.TIMER_INTERVAL.SPEED_BASE / (1 + Player.me.demon.value.spd / 100)
            this.timer_tap = new egret.Timer(cycle, 0)
        }

        this.timer_tap.addEventListener(egret.TimerEvent.TIMER, this.tap, this)
        this.timer_tap.start()
    }

    /**
     * 向服务端同步验证数据
     */
    @egretTimer({
        name: 'timer_syn',
        delay: Const.TIMER_INTERVAL.SYN_CIRCLE,
        autoStart: true,
    })
    async synEmit() {
        if (this.robbing) {
            // 掠夺中暂不同步
            return
        }
        await Player.me.syncWithServer()
    }

    /**
     * 获取更多怪物
     */
    @tapListener('btn_moreMonsters')
    moreMonsters() {
        this.addChildAt(new DialogMonsterGaCha(this), Const.ZINDEX.MAIN_MENU)
    }

    /**
     * 更新怪物区域
     */
    updateMonsters(): void {
        this.monsterlist.replaceAll(Player.me.monsters.filter(it => it.activated))
    }

    public dealDamage(data = null) {
        if (!this.currentEnemy) {
            return
        }

        let damage: number
        if (data && data.damage) {
            // 来自非自动计算和点击的伤害
            damage = data.damage
            const ifcri: boolean = data.ifcri
            this.currentEnemy.hp -= damage
        } else {
            // 普通点击伤害
            damage = Math.floor(Math.random() * Player.me.demon.value.atk) + 1
            const cri: number = Player.me.demon.value.cri / 100
            let ifcri: boolean = false
            if (Math.random() < cri) {
                // 暴击
                ifcri = true
                damage = Math.floor(damage * 1.5)
            }
            this.currentEnemy.hp -= damage
        }

        // 击杀
        if (this.currentEnemy.hp < 1) {
            // // 掠夺完成
            // if (this.robbing) {
            //     this.robbing = false
            //     const goldget = this.robbingPlayer.defendhero.gold
            //     Player.me.earnGold(goldget)
            //     this.giveupRob()
            //     this.validateNow()
            //     Dialog.Show({
            //         content: `你通过掠夺获得了${goldget}金币！`,
            //         parent: this,
            //     })
            //
            //     return
            // }

            const goldget = this.currentEnemy.gold ? this.currentEnemy.gold : 0
            Player.me.earnGold(goldget)
            const sc = new Scatter(this.g_scatter, goldget)
            sc.start()
            const zoom = new ZoomInOut(this.img_gold)
            zoom.start()
            // Tools.Hint("获得金币: " + goldget, this);
            this.updateGoldDisplay()
            const herodata = {
                area: this.currentArea.id,
                stage: this.currentArea.stage,
                // type: Math.floor(Math.random() * Hero.TYPES.length)
            }
            this.currentEnemy = Hero.Factory(herodata)
            this.gpb_hp.init(this.currentEnemy.hp)
            this.refreshHeroSrc()
            ++this.currentArea.stage
            if (this.currentArea.stage >= this.currentArea.maxstage) {
                this.currentArea.toNew()
                this.img_bg.source = this.currentArea.res
            }
            this.updateStageLabel()
        }

        const bl_dmg: eui.BitmapLabel = new eui.BitmapLabel()
        bl_dmg.font = 'dmg_fnt'
        bl_dmg.x = 300
        bl_dmg.y = 500
        bl_dmg.textAlign = 'center'
        bl_dmg.text = damage + ''
        // bl_dmg.text = ifcri ? "暴击!!" + Tools.C_Num(damage) : Tools.C_Num(damage) + "";
        this.addChild(bl_dmg)

        this.tween_ingame.damage = egret.Tween.get(bl_dmg)
            .to({ x: bl_dmg.x + 100, y: bl_dmg.y - 275, alpha: 0.7 }, 800, egret.Ease.cubicOut)
            .call(() => {
                this.removeChild(bl_dmg)
            })
        ;(this.tween_ingame.damage as egret.Tween).play()
    }

    protected createChildren() {
        super.createChildren()

        this.setChildIndex(this.mainBtnGroup, Const.ZINDEX.MAIN_MENU)

        this.scroller_monster.viewport = this.g_mscroller
        this.monsterlist = new eui.ArrayCollection()

        // const dataGroup: eui.DataGroup = new eui.DataGroup();
        // dataGroup.dataProvider = this.monsterlist;
        // dataGroup.percentWidth = 100;
        // dataGroup.percentHeight = 100;
        // dataGroup.itemRenderer = MonsterGachaRenderer;

        // this.g_monster.addChild(dataGroup);
        this.g_monster.dataProvider = this.monsterlist
        this.g_monster.itemRenderer = MonsterThumbRenderer

        this.currentArea = new Area(Player.me.area)
        const herodata = {
            area: this.currentArea.id,
            stage: this.currentArea.stage,
        }
        this.currentEnemy = Hero.Factory(herodata)
        this.gpb_hp.init(this.currentEnemy.hp)

        // this.initDragonBones();

        this.updatePlayer()
        this.refreshHeroSrc()
        this.setTapTimer()
    }

    private updateStageLabel() {
        this.lbl_stage.text =
            GameData.getText(`AreaName/${this.currentArea.id}`) +
            `   ${this.currentArea.stage + 1} / ${this.currentArea.maxstage}`

        // this.lbl_stage.text = `${this.currentArea.name}  ${this.currentArea.stage + 1} / ${
        //     this.currentArea.maxstage
        // }`
    }

    private isNotFighting() {
        return GameUI.Instance.currentState && GameUI.Instance.currentState !== GameUI.STATUE.FIGHT
    }

    private updateGoldDisplay() {
        this.lbl_gold.text = GameData.getText('UI/lbl_gold', Tools.C_Num(Player.me.gold))
    }

    /**
     * 开始掠夺
     */
    private startRob(player: any | Player) {
        const heroname = player.defendhero.name
        this.robbingPlayer = player

        this.mainBtnGroup.btnGroupFight.showSkills()
        this.currentState = 'rob'
        this.validateNow()

        // 此处需加入重新搜索阻挡询问

        this.robbing = true
        this.lbl_robInfo.text = `你正在掠夺${player.name}的领地！时限内击败守卫即可夺得丰厚宝藏！`

        const robTime = 15
        this.robTime = robTime
        this.gpb_remaintime.init(robTime)

        this.lbl_remaintime.text = '剩余时间：' + this.robTime

        this.currentEnemy = Hero.Factory(player.defendhero)
        this.currentEnemy.name = heroname
        this.gpb_hp.init(this.currentEnemy.hp)
        this.updateGameDataAndView()

        this.rect_matching.visible = false
        this.img_enemy.visible = true
        this.btn_startrob.visible = false
        this.btn_changerob.visible = false

        this.timer_rob.start()
    }
}

class MonsterThumbRenderer extends eui.ItemRenderer {
    img_monster: eui.Image

    @byLanguage()
    btn_lvlup: eui.Button

    data: Monster

    constructor() {
        super()
        this.touchChildren = true
        this.skinName = 'monsterThumb'
    }

    @tapListener('img_monster')
    showDetail() {
        // DialogMonsterInfo.Show(this.data)
    }

    @tapListener('btn_lvlup')
    async lvlup() {
        Tools.Hint('尚未开放！')
        //
    }

    protected dataChanged(): void {
        this.img_monster.source = this.data.res
    }
}
