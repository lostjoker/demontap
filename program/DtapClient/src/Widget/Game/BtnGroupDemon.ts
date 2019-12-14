/**
 * 战斗按钮组
 */
class BtnGroupDemon extends eui.Component {
    public bottom = 0
    public currentState = null
    public skinname = null
    public x = 0

    public STATUES = {
        NORMAL: 'normal',
        EXTEND: 'extend',
    }

    @byLanguage()
    public btn_showevo: eui.Button
    @byLanguage()
    public btn_showbreak: eui.Button
    @byLanguage()
    public btn_showattr: eui.Button
    @byLanguage()
    public btn_tab2demon: eui.Button

    public constructor() {
        super()
    }

    @tapListener('btn_showevo')
    public showEvo(): void {
        GameUI.Instance.currentState = GameUI.STATUE.DEMON
        this.currentState = this.STATUES.NORMAL
        // this.allHide();
        // GameUI.Instance.demon.g_evo.visible = true;
        GameUI.Instance.demon.currentState = 'evo'
        GameUI.Instance.demon.updatePlayer()
    }

    @tapListener('btn_showbreak')
    public showBreak(): void {
        GameUI.Instance.currentState = GameUI.STATUE.DEMON
        this.currentState = this.STATUES.NORMAL
        // this.allHide();
        // GameUI.Instance.demon.g_break.visible = true;
        GameUI.Instance.demon.currentState = 'break'
        GameUI.Instance.demon.updatePlayer()
    }

    @tapListener('btn_showattr')
    public showAttr(): void {
        GameUI.Instance.currentState = GameUI.STATUE.DEMON
        this.currentState = this.STATUES.NORMAL
        // this.allHide();
        // GameUI.Instance.demon.g_attr.visible = true;
        GameUI.Instance.demon.currentState = 'attr'
        GameUI.Instance.demon.updatePlayer()
    }

    @tapListener('btn_tab2demon')
    public changeTab(): void {
        GameUI.Instance.currentState = GameUI.STATUE.DEMON
        this.currentState = this.STATUES.NORMAL
        GameUI.Instance.demon.currentState = 'attr'
        // GameUI.Instance.demon.updatePlayer()

        setTimeout(() => GameUI.Instance.updatePlayer(), 100)

        // if (this.currentState == this.STATUES.NORMAL) {
        //     this.currentState = this.STATUES.EXTEND
        // } else if (this.currentState == this.STATUES.EXTEND) {
        //     this.currentState = this.STATUES.NORMAL
        // }
    }

    public allHide(): void {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < GameUI.Instance.fight.armatureClip.length; ++i) {
            GameUI.Instance.fight.armatureClip[i].visible = false
        }
        GameUI.Instance.demon.g_attr.visible = false
        GameUI.Instance.demon.g_break.visible = false
        GameUI.Instance.demon.g_evo.visible = false
    }

    protected createChildren(): void {
        super.createChildren()
    }
}
