/**
 *
 * @author SeASon
 * 怪物扭蛋弹出框
 */
class DialogMonsterGaCha extends eui.Component {
    @byLanguage()
    btn_gacha0
    @byLanguage()
    btn_gacha1
    @byLanguage()
    lblGachaTitle
    @byLanguage()
    lblGachaDesc

    public gameui: eui.Component
    bb: BlockBoard
    sc_monster: eui.Scroller
    monsterlist: eui.ArrayCollection

    public constructor(gameui: eui.Component, skinname: string = 'dialogMonsterGaCha') {
        super()
        this.gameui = gameui
        this.skinName = skinname
    }

    /**
     * 金币蛋
     */
    @tapListener('btn_gacha0')
    async gacha0() {
        if (Player.me.gold < 1000) {
            await Dialog.Show('你的金币不足！')
            return
        }

        await this.gacha('确定要消耗金币开一个银蛋吗？', { gachaType: 'gold' })
    }

    /**
     * 宝石蛋
     */
    @tapListener('btn_gacha1')
    async gacha1() {
        if (Player.me.egtCash < 1) {
            await Dialog.Show('你的EGT不足！')
            return
        }

        await this.gacha('确定要消耗EGT开一个金蛋吗？', { gachaType: 'egt' })
    }

    /**
     * 关闭窗口
     */
    @tapListener('btn_ok')
    @tapListener('btn_close')
    close() {
        this.parent.removeChild(this)
        GameUI.Instance.fight.updateMonsters()
    }

    protected createChildren(): void {
        super.createChildren()

        this.bb = new BlockBoard()
        this.bb.width = BlockBoard.DEFAULT_WIDTH
        this.bb.height = BlockBoard.DEFAULT_HEIGHT
        this.bb.horizontalCenter = 0
        this.bb.verticalCenter = 0
        this.addChild(this.bb)
        this.setChildIndex(this.bb, 0)

        // this.initBlock();
        this.x = this.gameui.width / 2 - this.width / 2
        this.y = this.gameui.height / 2 - this.height / 2
        // this.initOther();

        // 用ArrayCollection包装
        this.monsterlist = new eui.ArrayCollection(Player.me.monsters)

        const dataGroup: eui.DataGroup = new eui.DataGroup()
        dataGroup.dataProvider = this.monsterlist
        dataGroup.percentWidth = 100
        dataGroup.percentHeight = 100

        const tLayout: eui.TileLayout = new eui.TileLayout()
        tLayout.horizontalGap = 10
        tLayout.verticalGap = 10
        tLayout.columnAlign = eui.ColumnAlign.LEFT
        tLayout.rowAlign = eui.RowAlign.TOP
        tLayout.paddingTop = 30
        tLayout.paddingRight = 30
        tLayout.paddingLeft = 30
        tLayout.paddingBottom = 10
        tLayout.requestedColumnCount = 3 /// 设置两列显示
        dataGroup.layout = tLayout /// 网格布局
        dataGroup.itemRenderer = MonsterGachaRenderer

        this.sc_monster.viewport = dataGroup
    }

    private async gacha(msg: string, data: { gachaType: string }) {
        const dr = await Dialog.Show(msg)
        if (dr === DialogResult.YES) {
            GameUI.Instance.bb.show()

            const res = await NetWork.requestWithToken('gacha/gacha0', data, true, true)
            GameUI.Instance.bb.hide()

            if (res.ok) {
                // tslint:disable-next-line:no-shadowed-variable
                const { newSouls, msg, player } = res.data
                Player.me.update(player)
                Player.me.updateMonsterList(newSouls)
                this.monsterlist.replaceAll(Player.me.monsters)
                this.monsterlist.refresh()

                if (msg) {
                    await Dialog.Show(msg)
                }
            }
        }
    }
}

class MonsterGachaRenderer extends eui.ItemRenderer {
    img_monster: eui.Image

    gpb_count: GameProgressBar

    @byLanguageByState()
    btnActivate: eui.Button
    data: Monster

    public constructor() {
        super()
        this.touchChildren = true
        this.skinName = 'monsterActivate'
    }

    // @tapListener('img_monster')
    showDetail() {
        const dialogMonsterInfo = new DialogMonsterInfo(this.data)
        dialogMonsterInfo.verticalCenter = 0
        dialogMonsterInfo.horizontalCenter = 0
        GameUI.Instance.addChild(dialogMonsterInfo)
    }

    @tapListener('btnActivate')
    async activate() {
        if (this.data.activated) return

        const res = await NetWork.requestWithToken(
            'gacha/activate',
            { id: this.data.id },
            true,
            true,
        )
        if (res.ok) {
            if (res.data && res.data.newSouls) {
                Player.me.updateMonsterList(res.data.newSouls)
                this.data.soulCount = res.data.newMonster.soulCount
                this.data.activated = res.data.newMonster.activated
                this.dataChanged()
            }
        } else {
            // Tools.Hint("激活失败！");
        }
    }

    protected dataChanged(): void {
        this.img_monster.source = this.data.res
        this.gpb_count.lbl_value.text = `${this.data.soulCount}/${this.data.soulToActivate}`
        this.currentState = this.data.activated ? 'gotten' : 'normal'
    }
}
