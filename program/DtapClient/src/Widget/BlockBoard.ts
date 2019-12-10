/**
 *
 * @author SeASon
 * 带loading的蒙板
 */
class BlockBoard extends eui.Component {
    public static DEFAULT_WIDTH: number = 1500
    public static DEFAULT_HEIGHT: number = 1800

    public lbl_loading: eui.Label

    public constructor(skinname: string = 'blockBoard') {
        super()
        this.skinName = skinname
    }

    /**
     * 呈现
     */

    public show(ifloading: boolean = true, reconnecting: boolean = false): void {
        const parent = this.parent || GameUI.Instance
        parent.setChildIndex(this, Const.ZINDEX.TOSHOW)
        this.lbl_loading.visible = ifloading
        this.lbl_loading.text = Lang.TEXT.MSG_LOADING
        if (reconnecting) {
            this.lbl_loading.text = Lang.TEXT.MSG_RECONNECTING
        }
        this.visible = true
        parent.touchChildren = false
    }

    /**
     * 隐藏
     */

    public hide(): void {
        this.visible = false
        this.parent.touchChildren = true
    }

    protected createChildren(): void {
        super.createChildren()
        this.touchEnabled = false
        this.touchChildren = false
        this.percentWidth = 100
        this.percentHeight = 100
    }
}
