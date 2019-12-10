/**
 *
 * @author SeASon
 * 游戏设置
 */
class GameSetting extends eui.Component {

    public constructor(skinname: string = "gameSetting") {
        super();
        this.skinName = skinname;
    }

    protected createChildren(): void {
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP,this.hide,this);
    }

    public show(): void {
        this.btn_openreplay.enabled = true;
        this.btn_loadreplay.enabled = false;
        this.visible = true;
    }
    
    public hide():void{
        this.visible = false;
    }
    
    public btn_openreplay:eui.Button;
    public btn_loadreplay: eui.Button;
    public btn_close: eui.Button;
}
