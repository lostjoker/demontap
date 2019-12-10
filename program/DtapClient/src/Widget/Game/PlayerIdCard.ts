/**
 *
 * @author SeASon
 * 玩家基本id卡
 *
 */
class PlayerIdCard extends eui.Component {
    
    constructor() {
        super();
        this.skinName = "playerIdCard";
    }

    protected createChildren(): void {
        super.createChildren();
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.showDetailMore,this);
    }
    
    /**
     * 开放该座位
     */ 
    open():void{
        this.isopen = true;
        this.currentState = PlayerIdCard.STATE.WAITIN;
        this.lbl_kickcd.visible = false;
    }
    
    /**
     * 关闭该座位
     */ 
    close(): void {
        this.isopen = false;
        this.currentState = PlayerIdCard.STATE.CLOSED;
    }
    
    /**
     * 赋予数据
     */ 
    dataIn(player:Player):void{
        this.player = player;
//        this.lbl_playername.text = this.player.name;
        if(player.avatarkey) {
            this.img_player.source = Tools.GetAvatar(player.avatarkey);
            return;
        }
        if(player.authdata.icon){
            this.img_player.source = player.authdata.icon;
            return;
        }
        // this.img_player.source = Hero.SKIN_ME[this.player.face];
    }
    
    /**
     * 数据清除
     */ 
    dataOut(): void {
        this.player = null;
//        this.lbl_playername.text = "";
        // this.img_player.source = Hero.SKIN_GAME["NODATA"].AVALON;
    }

    /**
     * 是否已准备完毕
     */
    ready(yes: boolean): void {
        this.currentState = yes ? PlayerIdCard.STATE.READY : PlayerIdCard.STATE.NOTREADY;
    }
    
    /**
     * 显示信息详情
     */ 
    showDetailMore(): void {
        // if(!(<GameUI>this.parent).pdm)
        //     return;
        if(!this.player)
            return;
        if(!this.player.isreg){
            Tools.Hint(Lang.TEXT.MSG_NOREG,<GameUI>this.parent);
            return;
        }
    }
    
    /**
     * 显示/隐藏同IP标记
     */ 
    showSameIp(visible:boolean):void{
        this.img_sameip.visible = visible;
        this.lbl_sameip.visible = visible;
    }
    
    /**
     * 状态，对应exml
     */ 
    static STATE = {
        NORMAL:"normal",
        OPEN: "open",
        CLOSED: "closed",
        WAITIN:"waitin",
        NOTREADY:"notready",
        READY:"ready",
        MASTER:"master",
        INTOWN: "inTown",
        INLOBBY: "inLobby",
        INTABLE: "inTable"
    };

    player: Player;
    isopen: boolean = false;
    
    img_player: eui.Image;
    lbl_seat: eui.Label;
//    lbl_playername: eui.Label;
    lbl_nodata:eui.Label;
    lbl_kickcd: eui.Label;
    img_sameip: eui.Image;
    lbl_sameip:eui.Label;
    img_closed: eui.Image;
    lbl_ready: eui.Label;
    lbl_info: eui.Label;
    g_voice: eui.Group;
    img_voice: eui.Image;

}

