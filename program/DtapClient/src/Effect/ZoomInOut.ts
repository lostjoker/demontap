/**
 * 缩放动画
 */
class ZoomInOut {
	public comp:eui.Image;

	public constructor(comp:eui.Image) {
		this.comp = comp;
	}

	public init():void{

	}

	public start():void{
		// this.comp.anchorOffsetX = this.comp.width / 2;
		// this.comp.anchorOffsetY = this.comp.height / 2;
        let tween:egret.Tween = egret.Tween.get(this.comp,{loop:false})
            .to({ scaleX: 1.3, scaleY: 1.3},100)
            .to({ scaleX: 1, scaleY: 1},100);
        tween.play();
		// let timer:egret.Timer = new egret.Timer(10,1);
		// timer.addEventListener(egret.TimerEvent.TIMER, () =>{
		// 	comp.scaleX = 2;
		// 	comp.scaleY = 2;
		// },this);
	}
}