class MainBtnGroup extends eui.Component {
    public btnGroupFight: BtnGroupFight

    @byLanguage()
    btn_tab_dungeon

    @byLanguage()
    btn_tab_market

    @byLanguage()
    btn_tab_treasure

    constructor() {
        super()
    }

    createChildren() {
        super.createChildren()
        this.setChildIndex(this.btnGroupFight, Const.ZINDEX.MAIN_MENU)
    }

    @tapListener('btn_tab_dungeon')
    changeTabDungeon() {
        Tools.Hint('尚未开放')

        // GameUI.Instance.currentState = GameUI.STATUE.DUNGEON
    }

    @tapListener('btn_tab_market')
    changeTabMarket() {
        Tools.Hint('尚未开放')
        // GameUI.Instance.currentState = GameUI.STATUE.MARKET
    }

    @tapListener('btn_tab_treasure')
    changeTabTreasure() {
        Tools.Hint('尚未开放')
        // GameUI.Instance.currentState = GameUI.STATUE.TREASURE
    }
}
