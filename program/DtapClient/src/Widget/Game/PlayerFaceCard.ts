/**
 *
 * @author SeASon
 * 玩家头像
 *
 */
class PlayerFaceCard extends eui.Component {
    
    public static STATUE = {
        NORMAL:"normal",
        REG:"reg"
    }

    public constructor() {
        super();
        this.skinName = "playerFaceCard";
    }

    protected createChildren(): void {
        super.createChildren();
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.showDetailMore,this);
        if(this.parent instanceof GameTown){
            this.drawInTown();
        }else{
            this.drawInNormal();
        }
    }
    
    /**
     * 普通绘制圆形
     */ 
    public drawInNormal(): void {
        let shape: egret.Shape = new egret.Shape();
        shape.graphics.beginFill(Const.GAME_COLOR.WHITE);
        shape.graphics.drawCircle(0,0,72);
        shape.graphics.endFill();
        shape.x = 86;
        shape.y = 85;
        shape.touchEnabled = false;
        this.addChild(shape);
        this.img_player.mask = shape;
    }
    
    /**
     * 大厅绘制圆形
     */ 
    public drawInTown(): void {
        let shape: egret.Shape = new egret.Shape();
        shape.graphics.beginFill(Const.GAME_COLOR.WHITE);
        shape.graphics.drawCircle(0,0,102);
        shape.graphics.endFill();
        shape.x = 127;
        shape.y = 126;
        shape.touchEnabled = false;
        this.addChild(shape);
        this.img_player.mask = shape;
    }

    /**
     * 赋予数据
     */
    public dataIn(player: Player): void {
        this.player = player;
        if(this.player.sex == "female" || this.player.sex == "f"){
            this.img_sex.source = "icon_female_png";
        } else if(this.player.sex == "male" || this.player.sex == "m"){
            this.img_sex.source = "icon_male_png";
        } else {
            this.img_sex.source = "icon_female_png";
        }
        if(player.avatarkey) {
            this.img_player.source = Tools.GetAvatar(player.avatarkey);
            return;
        }
        if(player.authdata.icon) {
            this.img_player.source = player.authdata.icon;
            return;
        }
        // this.img_player.source = Hero.SKIN_ME[this.player.face];
    }

    /**
     * 数据清除
     */
    public dataOut(): void {
        this.player = null;
        // this.img_player.source = Hero.SKIN_GAME["NODATA"].AVALON;
        this.img_sex.source = null;
    }

    /**
     * 显示信息详情
     */
    public showDetailMore(): void {
        // if(!(<GameUI>this.parent).pdm)
        //     return;
        if(!this.player)
            return;
        if(!this.player.isreg) {
            Tools.Hint(Lang.TEXT.MSG_NOREG,<GameUI>this.parent);
            return;
        }
    }

    public player: Player;

    public img_facebg: eui.Image;
    public img_player: eui.Image;
    public img_sex: eui.Image;

}
