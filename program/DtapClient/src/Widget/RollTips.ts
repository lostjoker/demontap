/**
 *
 * @author 滚动小提示
 *
 */
class RollTips extends eui.Component {
    public constructor() {
        super();
    }

    protected createChildren(): void {
        super.createChildren();
    }

    //qq群标签动画
    public tween_rolltips: egret.Tween;

    /**
     * 设置大厅右上角滚动标幅动画
     */
    public setRollTipsTween(tips:string[]): void {
        this.changeRollTips(tips);
        this.tween_rolltips = egret.Tween.get(this.lbl_content,{ loop: true })
            .wait(Const.TIMER_INTERVAL.ROLLTIPS_CD)
            .to({ y: this.lbl_content.y - 25, alpha:0 },500)
            .to({ y: this.lbl_content.y + 25, alpha:1 })
            .call(this.changeRollTips,this,[tips])
            .to({ y: this.lbl_content.y },500)
    }

    public rolltips_idx: number = 0;

    /**
     * 动画回调，改变文本
     */
    public changeRollTips(tips:string[]): void {
        this.lbl_content.text = tips[Math.floor(Math.random() * tips.length)];
        if(this.rolltips_idx >= tips.length) {
            this.rolltips_idx = 0;
        } else {
            ++this.rolltips_idx;
        }
    }
    
    public lbl_content:eui.Label;
}
