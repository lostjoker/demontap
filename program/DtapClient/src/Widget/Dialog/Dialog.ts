/**
 *
 * @author SeASon
 * 游戏中的常用对话框
 */
class Dialog extends eui.Component {
    static STATES = {
        NORMAL: 'normal',
        YESNO: 'yesno',
    }

    /**
     * 【静态】显示模态对话框，并返回结果的promise。
     * @param content 对话框配置
     */
    static Show(content?: string): Promise<DialogResult>

    /**
     * 【静态】显示模态对话框，并返回结果的promise。
     * @param config 对话框显示内容
     */
    static Show(config: {
        content?: string
        title?: string
        img?: string
        parent?: eui.Component
        skinName?: string
        state?: string
        quickclose?: boolean
    }): Promise<DialogResult>

    /**
     * 【静态】显示模态对话框，并返回结果的promise。
     * @param content 对话框显示内容
     * @param title 标题
     * @param img 图片
     * @param parent 对话框的父级节点
     * @param skinName 对话框皮肤
     * @param state 状态
     * @param quickclose 是否允许快速关闭
     */
    static Show(
        content: any = '',
        title: string = '',
        img: string = '',
        parent: eui.Component = GameUI.Instance,
        skinName: string = 'dialog',
        state: string = Dialog.STATES.YESNO,
        quickclose: boolean = true,
    ): Promise<DialogResult> {
        if (typeof content === 'object') {
            const config = content
            content = config.content || ''
            title = config.title || ''
            img = config.img || ''
            parent = config.parent || GameUI.Instance
            skinName = config.skinName || 'dialog'
            state = config.state || Dialog.STATES.NORMAL
            quickclose = config.quickclose || true
        } else {
            content = content || ''
        }

        return new Promise((resolve, reject) => {
            const dialog = new Dialog(parent, skinName, state, quickclose)
            parent.addChildAt(dialog, Const.ZINDEX.TOSHOW)
            dialog.lbl_title.text = title
            dialog.img_res.source = img
            dialog.lbl_content.text = content
            dialog.btn_yes.addEventListener(
                egret.TouchEvent.TOUCH_TAP,
                evt => {
                    dialog.hide()
                    parent.removeChild(dialog)
                    resolve(DialogResult.YES)
                },
                dialog,
            )
            dialog.btn_no.addEventListener(
                egret.TouchEvent.TOUCH_TAP,
                evt => {
                    dialog.hide()
                    parent.removeChild(dialog)
                    resolve(DialogResult.NO)
                },
                dialog,
            )

            if (dialog.quickclose) {
                dialog.bb.addEventListener(
                    egret.TouchEvent.TOUCH_TAP,
                    evt => {
                        dialog.hide()
                        parent.removeChild(dialog)
                        resolve(DialogResult.CANCEL)
                    },
                    dialog,
                )
            }

            dialog.show()
        })
    }
    gameui: eui.Component

    /**
     * 表示已经显示过，给一些避免重复弹出使用
     */
    hasshown: boolean = false

    /**
     * 表示已经关闭过，给一些避免重复弹出使用
     */
    hashidden: boolean = false

    quickclose: boolean = true

    bb: BlockBoard
    lbl_title: eui.Label
    img_res: eui.Image
    lbl_content: eui.Label
    btn_yes: eui.Button
    btn_no: eui.Button

    constructor(
        gameui: eui.Component,
        skinname: string = 'dialog',
        state: string = Dialog.STATES.NORMAL,
        quickclose: boolean = true,
    ) {
        super()
        this.gameui = gameui
        this.skinName = skinname
        this.currentState = state
        this.quickclose = quickclose
    }

    initOther(): void {
        if (this.btn_no) this.btn_no.addEventListener(egret.TouchEvent.TOUCH_TAP, this.hide, this)
        if (this.btn_yes) this.btn_yes.addEventListener(egret.TouchEvent.TOUCH_TAP, this.hide, this)
        // this.visible = false;
    }

    initBlock(): void {
        this.bb = new BlockBoard()
        this.bb.width = BlockBoard.DEFAULT_WIDTH
        this.bb.height = BlockBoard.DEFAULT_HEIGHT
        this.bb.horizontalCenter = 0
        this.bb.verticalCenter = 0
        if (this.quickclose) {
            this.bb.addEventListener(egret.TouchEvent.TOUCH_TAP, this.hide, this)
        }
        this.addChild(this.bb)
        this.setChildIndex(this.bb, 0)
    }

    /**
     * 呈现
     */
    show(): void {
        this.gameui.setChildIndex(this, Const.ZINDEX.TOSHOW)
        this.visible = true
        this.hasshown = true
    }

    /**
     * 隐藏新手教程提示
     */
    hide(): void {
        this.visible = false
        this.hashidden = true
    }

    protected createChildren(): void {
        super.createChildren()
        this.initBlock()
        this.horizontalCenter = 0 // = this.gameui.width / 2 - this.width / 2;
        this.verticalCenter = 0 // = this.gameui.height / 2 - this.height / 2;
        if (this.img_res) {
            this.lbl_content.top = this.img_res.top + this.img_res.height + 10
        }
        this.initOther()
    }
}
