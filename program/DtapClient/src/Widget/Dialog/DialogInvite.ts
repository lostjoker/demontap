/**
 *
 * @author SeASon
 * 邀请面板
 *
 */
class DialogInvite extends Dialog {

    public constructor(gameui:GameUI) {
        super(gameui,"dialogInvite");
    }
    
    public initOther(): void {
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP,this.hide,this);
        this.btn_invitewx.addEventListener(egret.TouchEvent.TOUCH_TAP,this.inviteWX,this);
        this.btn_invitepyq.addEventListener(egret.TouchEvent.TOUCH_TAP,this.invitePYQ,this);
        this.btn_inviteqq.addEventListener(egret.TouchEvent.TOUCH_TAP,this.inviteQQ,this);
        this.btn_invitefollow.addEventListener(egret.TouchEvent.TOUCH_TAP,this.inviteFollow,this);
        this.visible = false;
    }
    
    public inviteWX():void{

    }

    public inviteQQ(): void {

    }

    /**
     * 分享至朋友圈
     */ 
    public invitePYQ(): void {

    }
    
    /**
     * 关注邀请
     */ 
    public inviteFollow():void{
        if(this.operateHoldOn) {
            Tools.Hint(Lang.TEXT.MSG_CONTROL_TOOMUCH,this.gameui);
            return;
        }
    }

    //操作屏蔽中
    public operateHoldOn: boolean = false;

    /**
     * 客户端对一些向服务端发送数据的频繁操作屏蔽
     */
    public operateHold(): void {
        this.operateHoldOn = true;
        var self = this;
        setTimeout(function() {
            self.operateHoldOn = false;
        },Const.OPERATE_HOLD_TIME * 5);
    }

    public btn_invitewx: eui.Button;
    public btn_invitepyq: eui.Button;
    public btn_inviteqq: eui.Button;
    public btn_invitefollow: eui.Button;
    public btn_close: eui.Button;
}
