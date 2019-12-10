/**
 *
 * @author 
 *
 */
class PbCustomColor extends eui.Component {
    public min: number;
    public max: number;

    public constructor() {
        super();
        this.skinName = "pbCustomColor";
    }

    protected createChildren(): void {
        super.createChildren();
    }

    /**
     * 初始化进度条最大值
     * rate表示max的倍率，例如秒还是毫秒等
     */
    public init(max: number = 100,min: number = 0): void {
        this.min = min;
        this.max = max;
        this.lbl_value.text = "";
    }

    /**
     * 更新进度条
     * 反向缩小遮挡层宽度
     */
    public update(progress: number): void {
        if(!this.max) {
            this.lbl_progress.percentWidth = 100;
            return;
        }
        var rate = 1 - (progress / this.max);
        this.lbl_progress.percentWidth = rate * this.lbl_progress_bg.percentWidth;
    }

    public updateValue(val:string): void {
        this.lbl_value.text = val;
    }

    public changeColor1(color: number): void {
        this.lbl_progress_bg.backgroundColor = color;
    }

    public changeColor2(color: number): void {
        this.lbl_progress.backgroundColor = color;
    }

    public lbl_progress_bg: eui.Label;
    public lbl_progress: eui.Label;
    public lbl_value: eui.Label;
}