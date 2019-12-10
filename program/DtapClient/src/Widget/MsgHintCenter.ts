/**
 * @author SeASon
 */
class MsgHintCenter extends eui.Component {
    
    //背景色
    public bg_color:number;
    
    //滞留时间
    public showtime:number;
    
    public constructor(color:number = Const.GAME_COLOR.BLACK, time:number = Const.HINT_TIME.DEFAULT) {
        super();
        this.bg_color = color;
        this.showtime = time;
        this.skinName = "msgHintCenter";
    }

    protected createChildren(): void {
        super.createChildren();
    }
    
    /**
     * 显示信息
     */ 
    public show(msg:string):void{
        this.x = this.parent.width / 2 - this.width / 2;
        this.y = this.parent.height / 2 - this.height / 2 - 20;
        this.lbl_msg.backgroundColor = this.bg_color;
        this.lbl_msg.text = msg;
        egret.Tween.get(this)
            .to({ y: this.y - 80 },750,egret.Ease.quintOut)
            .wait(1000)
            .to({alpha:0},this.showtime)
            .call(() => {
                if(this.parent){
                    this.parent.removeChild(this);
                }
            });
    }
	
	public lbl_msg:eui.Label;
}
