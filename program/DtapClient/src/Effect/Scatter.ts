/**
 * 抛洒效果
 * SeASon 20171029
 */
class Scatter {
    public group: eui.Group
    public items: any[] = []
    public showval = {
        amount: 0,
        eachval: 0,
    }

    public constructor(parent: eui.Group, totalval: number) {
        this.group = parent
        this.gen(totalval)
    }

    /**
     * 生成
     */
    public gen(totalval: number): void {
        const result = this.split(totalval)
        for (let i = 0; i < result.amount; ++i) {
            const img_scatter: eui.Image = new eui.Image('egt_png')
            img_scatter.scaleX = 3
            img_scatter.scaleY = 3
            img_scatter.x = this.group.width / 2
            img_scatter.y = this.group.height / 2
            this.items.push({
                img: img_scatter,
                val: result.eachval,
            })
            this.group.addChild(img_scatter)
        }
        // 显示在前
        // this.group.parent.setChildIndex(this.group, Const.ZINDEX.EFFECT_SCATTER);
    }

    /**
     * 分割散落量和值
     */
    public split(totalval: number, amount: number = 5): any {
        const result = {
            amount: 0,
            eachval: 0,
        }
        if (!totalval) {
            return result
        }
        result.amount = amount
        result.eachval = Math.floor(totalval / result.amount)
        if (result.eachval < 1) {
            result.eachval = 1
            result.amount = totalval
        }
        return result
    }

    public start(): void {
        for (let i = 0; i < this.items.length; ++i) {
            const item = this.items[i]
            const img = item.img as eui.Image
            let ori_x = img.x
            let ori_y = img.y
            // 速度
            const v = Tools.RandInt(120, 90)
            const angle = Tools.RandInt(80, 89)
            const theta = (angle * Math.PI) / 180
            // 加速度
            const g = -9.8
            // 时间叠加
            let t = 0
            let nx,
                ny,
                totalt = 20
            const negate = [5, 4, 3, -3, -4, -5]
            // 方向
            const direction = negate[Math.floor(Math.random() * negate.length)]

            let timer: egret.Timer = new egret.Timer(10, 0)
            timer.addEventListener(
                egret.TimerEvent.TIMER,
                () => {
                    const ux = Math.cos(theta) * v * direction
                    const uy = Math.sin(theta) * v - -g * t
                    nx = ux * t
                    ny = uy * t + 5 * g * Math.pow(t, 2)
                    img.x = ori_x + nx
                    img.y = ori_y - ny
                    if (img.y >= img.parent.height - img.height) {
                        img.y = img.parent.height - img.height
                        // timer.stop()触发不了事件，只能用再重复一次来变相解决
                        timer.repeatCount = 1
                    }
                    if (img.x < 0) {
                        img.x = 0
                    }
                    if (img.x > img.parent.width - img.width) {
                        img.x = img.parent.width - img.width * img.scaleX
                    }
                    // 提升时间倍率
                    t = t + 0.1
                },
                this,
            )
            timer.addEventListener(
                egret.TimerEvent.TIMER_COMPLETE,
                () => {
                    // 弹起动画
                    ori_x = img.x
                    ori_y = img.y
                    let t = 0
                    let nx,
                        ny = 20
                    timer = new egret.Timer(10, 0)
                    timer.addEventListener(
                        egret.TimerEvent.TIMER,
                        () => {
                            const ux = Math.cos(theta) * v * direction
                            const uy = Math.sin(theta) * v - -g * t
                            nx = ux * t
                            ny = uy * t + 10 * g * Math.pow(t, 2)
                            if (ori_y - ny >= img.parent.height - img.height * img.scaleY) {
                                img.y = img.parent.height - img.height * img.scaleY
                                timer.repeatCount = 50
                            } else if (ori_x + nx <= 0) {
                                img.x = 0
                                img.y = ori_y - ny
                            } else if (ori_x + nx >= img.parent.width - img.width * img.scaleX) {
                                img.x = img.parent.width - img.width * img.scaleX
                                img.y = ori_y - ny
                            } else {
                                img.x = ori_x + nx
                                img.y = ori_y - ny
                            }
                            t = t + 0.1
                        },
                        this,
                    )
                    timer.addEventListener(
                        egret.TimerEvent.TIMER_COMPLETE,
                        () => {
                            // 拾取消失
                            const bl: eui.BitmapLabel = new eui.BitmapLabel(item.val)
                            bl.x = img.x
                            bl.y = img.y
                            bl.font = 'dmg_fnt'
                            bl.scaleX = 0.75
                            bl.scaleY = 0.75
                            img.parent.addChild(bl)
                            img.parent.removeChild(img)
                            timer = new egret.Timer(10, 30)
                            timer.addEventListener(
                                egret.TimerEvent.TIMER,
                                () => {
                                    bl.y -= 1
                                },
                                this,
                            )
                            timer.addEventListener(
                                egret.TimerEvent.TIMER_COMPLETE,
                                () => {
                                    bl.parent.removeChild(bl)
                                },
                                this,
                            )
                            timer.start()
                        },
                        this,
                    )
                    timer.start()
                },
                this,
            )
            timer.start()
        }
    }
}
