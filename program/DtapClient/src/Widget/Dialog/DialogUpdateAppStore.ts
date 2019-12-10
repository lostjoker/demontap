/**
 *
 * @author SeASon
 * 更新公告面板
 */
class DialogUpdateAppStore extends Dialog {

    public constructor(gameui: GameUI) {
        super(gameui,"dialogUpdateAppStore");
    }

    public initOther(): void {
        this.hide();
        //垂直布局
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {

            if(egret.RuntimeType.NATIVE == egret.Capabilities.runtimeType) {
                // native中没有window！
                return;
            }
            //https://itunes.apple.com/cn/app/阿瓦隆/id1225479549?mt=8
        },this);
    }
    
    public btn_close:eui.Button;
    public lbl_title:eui.Label;
    
}
