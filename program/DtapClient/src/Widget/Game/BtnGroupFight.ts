/**
 * 战斗按钮组
 */
class BtnGroupFight extends eui.Component {
    public STATUES = {
        NORMAL: 'normal',
        EXTEND: 'extend',
    }

    @byLanguage()
    public btn_robplayer: eui.Button

    @byLanguage()
    public btn_showmonsters: eui.Button

    @byLanguage()
    public btn_showskills: eui.Button

    @byLanguage()
    public btn_tab2fight: eui.Button

    public constructor() {
        super()
    }

    @tapListener('btn_robplayer')
    public async readyRob() {
        GameUI.Instance.currentState = GameUI.STATUE.FIGHT
        this.currentState = this.STATUES.NORMAL
        GameUI.Instance.validateNow()
        this.validateNow()

        Tools.HintByLanguage('UI/hint_na')

        // const result = await Dialog.Show({
        //     content: Lang.TEXT.ROB_TIPS,
        //     parent: GameUI.Instance,
        //     state: Dialog.STATES.YESNO,
        // })
        //
        // if (result === DialogResult.YES) {
        //     GameUI.Instance.fight.robPlayer()
        // } else if (result === DialogResult.NO) {
        //     // ignore
        // }
    }

    @tapListener('btn_showmonsters')
    public showMonsters(): void {
        GameUI.Instance.currentState = GameUI.STATUE.FIGHT
        this.currentState = this.STATUES.NORMAL
        // this.allHide();
        // GameUI.Instance.fight.g_currentmonster.visible = true;
        GameUI.Instance.fight.currentState = 'monster'
    }

    @tapListener('btn_showskills')
    public showSkills(): void {
        GameUI.Instance.currentState = GameUI.STATUE.FIGHT
        this.currentState = this.STATUES.NORMAL
        // this.allHide();
        // GameUI.Instance.fight.g_currentdata.visible = true;
        GameUI.Instance.fight.currentState = 'skill'
    }

    @tapListener('btn_tab2fight')
    public changeTab(): void {
        GameUI.Instance.currentState = GameUI.STATUE.FIGHT
        // this.currentState = this.STATUES.NORMAL
        // GameUI.Instance.fight.currentState = 'skill'

        if (this.currentState == this.STATUES.NORMAL) {
            this.currentState = this.STATUES.EXTEND
        } else if (this.currentState == this.STATUES.EXTEND) {
            this.currentState = this.STATUES.NORMAL
        }
    }

    public allHide(): void {
        GameUI.Instance.fight.g_currentdata.visible = false
        GameUI.Instance.fight.g_currentmonster.visible = false
    }

    protected createChildren(): void {
        super.createChildren()
    }
}
