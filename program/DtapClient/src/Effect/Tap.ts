/**
 * 点击效果
 */
class Tap {
    public parent: eui.Component

    public mc_tap: egret.MovieClip // 点击按钮效果

    public constructor(parent: eui.Component) {
        this.parent = parent
        this.gen()
    }

    public gen(): void {
        // 点击序列帧动画
        const data = RES.getRes('effect_json')
        const txtr = RES.getRes('effect_png')
        const mcfactory = new egret.MovieClipDataFactory(data, txtr)
        this.mc_tap = new egret.MovieClip(mcfactory.generateMovieClipData('effect'))
        this.mc_tap.scaleX = 3
        this.mc_tap.scaleY = 3
        this.mc_tap.anchorOffsetX = this.mc_tap.width / 2
        this.mc_tap.anchorOffsetY = this.mc_tap.height / 2
        this.mc_tap.x = (this.parent.width - this.mc_tap.width) / 2
        this.mc_tap.y = (this.parent.height - this.mc_tap.height) / 2
        this.parent.addChild(this.mc_tap)
        this.parent.setChildIndex(this.mc_tap, Const.ZINDEX.EFFECT_TAP)
    }

    public start(): void {
        if (!this.mc_tap.visible) {
            this.mc_tap.visible = true
        }
        this.mc_tap.addEventListener(
            egret.MovieClipEvent.COMPLETE,
            () => {
                this.mc_tap.visible = false
            },
            this,
        )
        const rand: number = Math.floor(Math.random() * 4) + 1
        this.mc_tap.gotoAndPlay('tap' + rand, 1)
    }
}
