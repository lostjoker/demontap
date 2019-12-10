/**
 *
 * @author SeASon
 * 游戏信息面板
 */
class GameMsgPanel extends eui.Component {
    public game: GameUI;
    public gameMsglist: eui.ArrayCollection[] = [];//Array<Object>[] = [];

    public watcherMsglist: eui.ArrayCollection;
    
    public msg_max_length: number = 25;
    
    //正在查阅谁的信息
    public seewho = 0;
    
    public static STATE = {
        player_ongame: "player_ongame",
        watcher_ongame: "watcher_ongame",
        watcher_onwatch: "watcher_onwatch",
        player_ongame_mini: "player_ongame_mini",
        watcher_ongame_mini: "watcher_ongame_mini",
        watcher_onwatch_mini: "watcher_onwatch_mini"
    };
    
    public btn_msgtab_state = {
        up:"up",
        down:"down"
    };
    
    public constructor() {
        super();
        // for(var i = 0; i <= Const.GAMETABLE_10.PLAYERS; ++i){
        //     this.gameMsglist[i] = new eui.ArrayCollection();//[];//0为全部内容
        // }
        this.watcherMsglist = new eui.ArrayCollection();
        this.skinName = "gameMsgPanel";
    }

    protected createChildren(): void {
        super.createChildren();
        this.btn_msgtab_zoom.addEventListener(egret.TouchEvent.TOUCH_TAP,this.zoom,this);
        this.btn_msgtab_all.addEventListener(egret.TouchEvent.TOUCH_TAP,this.changeTabToGame,this);
        this.sc_gamemsg.addEventListener(egret.Event.CHANGE,this.receiveScroll,this);
        this.sc_gamemsg.addEventListener(egret.Event.ENTER_FRAME,this.autoScroll,this);
        this.list_gamemsg.dataProvider = this.gameMsglist[0];
        this.list_gamemsg.itemRenderer = GameMsgListIRSkin;
        
        //设置document事件
    }
    
    /**
     * 初始化面板
     */ 
    public initView(game:GameUI): void {
        this.game = game;
        this.array_btn_msgtab = [];
        //添加玩家分类信息通道

        //first
        this.changeTabToGame();
    }
    
    /**
     * 滚动区间修正操作提取
     */
    public scrollerFixed(sc: eui.Scroller, height:number = sc.viewport.height): number {
        return sc.viewport.contentHeight - height;
    }

    //是否有新游戏信息进来而没读到，用于动画等判断
    public newGameMsg: boolean = false;
    public gameTabTween: egret.Tween;

    /**
     * 更新游戏过程信息列表
     */
    public updateGameMsg(fromseat: number,msg: string,textColor: number = Const.GAME_COLOR.GAME_MSG): void {
        if(!msg){
            return;
        }
        var currentscrollV: number = 0;//防止加入数据后回弹
        currentscrollV = this.sc_gamemsg.viewport.scrollV;//记录，防止加入数据后回弹
        if(this.gameMsglist[this.seewho].length ==0){
            this.gameMsglist[this.seewho].refresh();
        }
        if(fromseat) {
            msg = fromseat + "号: " + msg;
        } else {
            msg = Lang.TEXT.MSG_SIGN_GAMEMSG + msg;
        }
        var formatmsg: string[] = Tools.MsgSlice(msg,this.msg_max_length);
        for(var i = 0;i < formatmsg.length;++i) {
            var msgobj = {
                msg: formatmsg[i],
                color: textColor,
                time: new Date().getTime()
            };
            this.gameMsglist[0].addItem(msgobj);//.push(msgobj);
            if(fromseat){
                this.gameMsglist[fromseat].addItem(msgobj);//.push(msgobj);
            }
        }
//        this.list_gamemsg.dataProvider = this.gameMsglist[this.seewho];//new eui.ArrayCollection(this.gameMsglist[this.seewho]);
        if(currentscrollV == (this.sc_gamemsg.viewport.contentHeight
            - this.sc_gamemsg.viewport.height)) {
            this.list_gamemsg.validateNow();//需调用此才能保证刷新到底
            this.sc_gamemsg.viewport.scrollV = this.scrollerFixed(this.sc_gamemsg);
        } else {//保持滚动位置原状
            this.list_gamemsg.validateNow();
            this.sc_gamemsg.viewport.scrollV = currentscrollV;
        }
        if(this.currentState != GameMsgPanel.STATE.player_ongame) {
            if(!this.newGameMsg) {
                this.newGameMsg = true;
//                this.gameTabTween.setPaused(false);
            }
        }
    }
    
    /**
     * 查阅某分类玩家所有信息
     */ 
    public seePlayerMsg(): void {
        var currentscrollV = this.scrollerFixed(this.sc_gamemsg);
        this.list_gamemsg.dataProvider = this.gameMsglist[this.seewho];
        if(currentscrollV == (this.sc_gamemsg.viewport.contentHeight
            - this.sc_gamemsg.viewport.height)) {
            this.list_gamemsg.validateNow();
            this.sc_gamemsg.viewport.scrollV = this.scrollerFixed(this.sc_gamemsg);
        } else {
            this.list_gamemsg.validateNow();
            this.sc_gamemsg.viewport.scrollV = currentscrollV;
        }
    }

    /**
     * 设置游戏tab动画暂停
     */
    public stopGameTabTween(): void {
        if(!this.newGameMsg) {
            this.gameTabTween.setPaused(true);
        }
    }

    //是否有新聊天信息进来而没读到，用于动画等判断
    public newGameChat: boolean = false;
    public gameChatTabTween:egret.Tween;
    
    /**
     * 更新游戏聊天信息列表
     */
    public updateGameChatMsg(player: Player,msg): void {
        var chatobj = {
            msg: msg
        };
    }
    
    /**
     * 设置聊天tab动画暂停
     */ 
    public stopChatTabTween():void{
        if(!this.newGameChat){
            this.gameChatTabTween.setPaused(true);
        }
    }

    /**
     * 切换到信息面板
     */
    public changeTabToGame(): void {
        if(!this.game)
            return;
        this.allTabUp();
        this.btn_msgtab_all.currentState = this.btn_msgtab_state.down;
        this.validateNow();
        this.sc_gamemsg.viewport.scrollV = this.scrollerFixed(this.sc_gamemsg);
        this.newGameMsg = false;
        this.seewho = 0;
        this.seePlayerMsg();
    }

    public scrolled: boolean = false;

    //手动滚动
    public receiveScroll(): void {
        this.scrolled = true;
    }

    //自动滚动
    public autoScroll(): void {
        if(!this.scrolled) {
            this.list_gamemsg.validateNow();
            this.sc_gamemsg.viewport.scrollV = this.scrollerFixed(this.sc_gamemsg);
            this.scrolled = true;
        }
    }
    
    
    /**
     * replay加载msglist
     */ 
    public loadReplayMsg():void{
        if(!this.gameMsglist) {
            return;
        }
        var currentscrollV: number = 0;
        currentscrollV = this.sc_gamemsg.viewport.scrollV;
        this.list_gamemsg.dataProvider = this.gameMsglist[this.seewho];
        if(currentscrollV == (this.sc_gamemsg.viewport.contentHeight
            - this.sc_gamemsg.viewport.height)) {
            this.list_gamemsg.validateNow();
            this.sc_gamemsg.viewport.scrollV = this.scrollerFixed(this.sc_gamemsg);
        } else {
            this.list_gamemsg.validateNow();
            this.sc_gamemsg.viewport.scrollV = currentscrollV;
        }
        if(this.currentState != GameMsgPanel.STATE.player_ongame) {
            if(!this.newGameMsg) {
                this.newGameMsg = true;
            }
        }
    }
    
    /**
     * 所有标签设置弹起状态
     */ 
    public allTabUp(): void {
        for(var i = 0;i < this.array_btn_msgtab.length;++i) {
            if(this.array_btn_msgtab[i]) {
                this.array_btn_msgtab[i].currentState = this.btn_msgtab_state.up;
            }
        }
        this.btn_msgtab_all.currentState = this.btn_msgtab_state.up;
    }
    
    /**
     * 缩放本信息面板
     */ 
    public zoom():void{
        if(this.currentState == GameMsgPanel.STATE.player_ongame){
            this.currentState = GameMsgPanel.STATE.player_ongame_mini;
            this.validateNow();
            this.sc_gamemsg.viewport.scrollV = this.scrollerFixed(this.sc_gamemsg);
            return;
        }
        if(this.currentState == GameMsgPanel.STATE.player_ongame_mini) {
            this.currentState = GameMsgPanel.STATE.player_ongame;
            this.validateNow();
            this.sc_gamemsg.viewport.scrollV = this.scrollerFixed(this.sc_gamemsg);
            return;
        }
    }

    public img_bgmsg: eui.Image;
    public list_gamemsg: eui.List;
    public sc_gamemsg: eui.Scroller;
    public array_btn_msgtab: eui.Button[];
    public btn_msgtab_all: eui.Button;
    public btn_msgtab_zoom: eui.Button;
}

/**
 * 游戏信息列表项的渲染器
 */
class GameMsgListIRSkin extends eui.ItemRenderer {
    public lbl_msg: eui.Label;
    public panel: GameMsgPanel;

    constructor() {
        super();
        this.skinName = "listItemGameMsg";
    }

    protected createChildren(): void {
        super.createChildren();
    }

    protected dataChanged(): void {
        this.panel = <GameMsgPanel>this.data.parent;
        this.currentState = this.data.ifvoice ? "voice" : "default";
        if(this.currentState == "default") {
            if(this.lbl_msg.textColor == this.data.color)
                return;
            this.lbl_msg.textColor = this.data.color;
            return;
        }
    }
}

/**
 * 旁观聊天信息列表项的渲染器
 */
class WatcherMsgListIRSkin extends eui.ItemRenderer {
    public lbl_msg: eui.Label;

    constructor() {
        super();
        this.skinName = "listItemGameMsg";
    }

    protected createChildren(): void {
        super.createChildren();
    }

    protected dataChanged(): void {
        this.lbl_msg.textColor = this.data.color;
    }
}