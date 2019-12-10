/**
 *
 * @author SeASon
 * 20170414
 */
class DialogRewardUsOver extends Dialog {

    public constructor(gameui: GameUI) {
        super(gameui,"dialogRewardUsOver");
    }

    public initOther(): void {
        this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP,this.hide,this);
        this.visible = false;
    }

    public btn_sure: eui.Button;
}
