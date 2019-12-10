/**
 *
 * @author SeASon
 * 进度条控件
 */
class GameProgressBar extends eui.Component {
    public min: number = 0
    public max: number = 100
    public date: Date
    public timestart: number
    public timeend: number
    public timenow: number

    public lbl_progress_bg: eui.Label
    public lbl_progress: eui.Label
    public lbl_value: eui.Label

    public constructor(skinname: string = 'gameProgressBar') {
        super()
        this.skinName = skinname
    }

    /**
     * 初始化进度条最大值
     * rate表示max的倍率，例如秒还是毫秒等
     */

    public init(max: number, min: number = 0, color: number = Const.GAME_COLOR.TIME_ENOUGH): void {
        this.min = min
        this.max = max
        this.lbl_progress.percentWidth = 0
        // this.changeColor(color);
        //        this.lbl_progress.x = 0;
        // this.lbl_value.text = "";
        // this.date = new Date();
        // this.timestart = this.date.getTime();
        // this.timenow = this.timestart;
        // this.timeend = this.timestart + max;
    }

    /**
     * 更新进度条
     * 反向缩小遮挡层宽度
     */

    public update(progress: number): void {
        if (!this.max) {
            this.lbl_progress.percentWidth = 0
            return
        }
        let rate = 1 - progress / this.max
        if (rate > 1) rate = 1
        if (rate < 0) rate = 0
        this.lbl_progress.percentWidth = rate * this.lbl_progress_bg.percentWidth
    }

    public updateValue(): void {
        //        this.lbl_value.text = "倒计时：" + (this.max - (this.timenow - this.timestart));
    }

    public changeColor(color: number): void {
        // this.lbl_progress_bg.backgroundColor = color;
    }

    protected createChildren(): void {
        super.createChildren()
    }
}
