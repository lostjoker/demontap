/**
 *
 * @author SeASon
 * 更新公告面板
 */
class DialogNoticeBoard extends Dialog {

    public constructor(gameui: GameUI) {
        super(gameui,"dialogNoticeBoard");
    }

    protected createChildren(): void {
        super.createChildren();
        this.initBlock();
        this.x = this.gameui.width / 2 - this.width / 2;
        this.y = this.gameui.height / 2 - this.height / 2;
        this.initOther();
    }

    public initOther(): void {
        this.hide();
        //垂直布局
        var v_layout: eui.VerticalLayout = new eui.VerticalLayout();
        v_layout.horizontalAlign = egret.HorizontalAlign.CENTER;
        this.g_content.layout = v_layout;
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP,this.hide,this);
        this.lbl_content.text = Lang.UPDATE_LOG[0].text;
        this.lbl_content.validateNow();
        this.img_content.source = Lang.UPDATE_LOG[0].img;//RES.getRes("loyal2_001_png");
        this.img_content.visible = true;
    }
    
    public g_content:eui.Group;
    public btn_close:eui.Button;
    public lbl_title:eui.Label;
    public lbl_content:eui.Label;
    public img_content:eui.Image;
    
}
