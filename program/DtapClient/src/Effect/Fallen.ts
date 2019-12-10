/* tslint:disable:triple-equals */
/**
 * 洒落效果
 * SeASon 20171028
 */
class Fallen {
    public static parent: eui.Group

    public static arrPoolCoin: eui.Image[] = []

    public static settings: any
    public static count: number
    public static timeLag: number
    public static coinWidth: number
    public static coinHeight: number
    public static wrapWidth: number
    public static wrapHeight: number

    /**
     * 初始化对象池
     *
     */
    public static initPool(): void {
        for (let i = 0; i < 200; i++) {
            const img: eui.Image = new eui.Image()
            Fallen.arrImg.push(img)
            img.name = 'img_scatter'
            img.source = RES.getRes('icon_coin_png')
            this.arrPoolCoin.push(img)
        }
    }
    /**
     * 从对象池获取
     */
    public static getPoolByCoinImg(): eui.Image {
        let img: eui.Image
        const len: number = this.arrPoolCoin.length
        if (len) {
            img = this.arrPoolCoin.shift()
            return img
        }
        img = new eui.Image()
        Fallen.arrImg.push(img)
        img.name = 'img_scatter'
        img.source = RES.getRes('icon_coin_png')
        return img
    }
    /**
     * 归还给对象池
     */
    public static backPoolCoinImg(coinImg: eui.Image): void {
        coinImg.name = 'img_scatter'
        this.arrPoolCoin.push(coinImg)
    }

    /**
     * 从舞台中获取
     */
    public static getStageByCoinImg(name: string): eui.Image {
        let img: eui.Image
        const len: number = Fallen.arrImg.length
        for (let i = 0; i < len; i++) {
            if (Fallen.arrImg[i].name === name) {
                img = Fallen.arrImg[i]
                Fallen.arrImg.splice(i, 1)
                return img
            }
        }
        img = this.getPoolByCoinImg()
        return img
    }

    /**
     * 动画初始化方法
     * @method _init
     */
    public static init(parent: eui.Group) {
        this.parent = parent
        if (!this.arrPoolCoin.length) {
            this.initPool()
        }

        this.dispose()
        // 默认参数
        this.settings = {
            // 金币宽度
            coinWidth: 31,
            // 金币高度
            coinHeight: 31,
            count: 10,
        }
        // 密度，即金币个数
        this.count = this.settings.count
        // 金币散落的事件间隔，数字越大表示间隔越大，过小会导致看似同时落下
        this.timeLag = 500
        // 金币宽度
        this.coinWidth = this.settings.coinWidth * 3
        // 金币高度
        this.coinHeight = this.settings.coinHeight * 3

        this._startCacheCanvasAnim()
    }

    public static dispose(): void {
        while (this.arrImg.length) {
            if (this.arrImg[0].parent) {
                this.arrImg[0].parent.removeChild(this.arrImg[0])
            }
            this.backPoolCoinImg(this.arrImg[0])
            this.arrImg.splice(0, 1)
        }
    }

    private static arrImg: eui.Image[] = []
    private static num: number = 0

    /**
     * 执行金币绘制动画
     * @method _startCanvasAnim
     */
    private static _startCacheCanvasAnim() {
        const availWidth = this.wrapWidth - this.coinWidth
        const availHeight = this.wrapHeight - this.coinHeight
        // let disX=availWidth/this.count;  //每个硬币X轴的间距
        const coinRange = availWidth // * this.count / (this.count + 15);
        const rangeStart = 0 // (availWidth - coinRange) / 2;
        const g = 9.8 * 1000 // 重力加速度 280
        let bPlayAudio = false
        const coinAttrArr = [] // 存储金币下落过程中的一些属性参数
        for (let i = 0; i < Fallen.count; i++) {
            coinAttrArr[i] = {
                // 金币开始降落x轴随机值
                rndX: Math.random(),
                // 金币撒落顺序的一个数组
                rndOrder: Math.round((Math.random() * Fallen.timeLag) / 17),
                // 金币绘制的具体时间
                time: 0,
                // 金币绘制距离顶部的距离
                top: 0,
                // 金币弹起后距离左边的距离
                left: 0,
                // 金币第一次接触地面的速度
                endSpeed: 0,
                // 金币是否触碰到地面
                bEnd: false,
                // 金币弹起后重新降落的速度
                reDownSpeed: 0,
                // 金币弹起的高度参数，随机值250~350之间
                reDownHDelta: Math.random() * 100 + 250,
                // 金币x轴的偏移量，随机值0.97~1.03之间
                rndOffsetX: Math.random() * 0.06 + 0.97,
            }
        }
        let startTime = Date.now() // 开始绘制前的时间
        function draw() {
            const drawStart = Date.now() // 记录重绘的结束时间
            const diff = (drawStart - startTime) / 1000 // 计算每次重绘所需要的时间，单位为秒
            startTime = drawStart // 结束事件传给开始时间
            //            Coin.dispose();
            // 根据金币个数循环绘制金币
            for (let i = 0; i < Fallen.count; i++) {
                // 如果顺序为0，表示开始下落，同时下落的初始时间为0时，赋值初始时间
                if (coinAttrArr[i].rndOrder == 0 && coinAttrArr[i].time == 0) {
                    coinAttrArr[i].time = diff
                }
                // 如果初始事件大于0，表示已经在下落过程中,则每次的初始时间递增
                if (coinAttrArr[i].time > 0) {
                    coinAttrArr[i].time = coinAttrArr[i].time + diff
                }
                // 如果顺序为0，开始下落，则开始绘制金币
                if (coinAttrArr[i].rndOrder == 0) {
                    // 金币下落（过程一），自由落体运动
                    if (!coinAttrArr[i].bEnd) {
                        // 自由落体加速度运动，求下落的高度
                        coinAttrArr[i].top =
                            (g * Math.pow(coinAttrArr[i].time, 2)) / 2 - Fallen.coinHeight
                        // coinAttrArr[i].left=disX*coinAttrArr[i].rndX+i*disX;
                        coinAttrArr[i].left = coinRange * coinAttrArr[i].rndX + rangeStart
                    } else if (coinAttrArr[i].endSpeed == 0) {
                        // 金币弹起后在空中重新下落（过程三）
                        coinAttrArr[i].reDownSpeed = coinAttrArr[i].reDownSpeed * 1.1
                        coinAttrArr[i].top = coinAttrArr[i].top + coinAttrArr[i].reDownSpeed
                        coinAttrArr[i].left = coinAttrArr[i].left * coinAttrArr[i].rndOffsetX
                    } else {
                        // 金币弹起（过程二）
                        coinAttrArr[i].endSpeed = -Math.abs(coinAttrArr[i].endSpeed * 0.96)
                        if (Math.abs(coinAttrArr[i].endSpeed) < 1) coinAttrArr[i].endSpeed = 0
                        coinAttrArr[i].top = coinAttrArr[i].top + coinAttrArr[i].endSpeed
                        coinAttrArr[i].left = coinAttrArr[i].left * coinAttrArr[i].rndOffsetX
                    }
                    // 金币第一次降落超过地面时，将其高度设置和地面齐平
                    if (
                        coinAttrArr[i].top > Fallen.wrapHeight - Fallen.coinHeight &&
                        !coinAttrArr[i].bEnd
                    ) {
                        coinAttrArr[i].top = Fallen.wrapHeight - Fallen.coinHeight
                    }
                    // 金币落地时，计算落地的速度
                    if (coinAttrArr[i].top == Fallen.wrapHeight - Fallen.coinHeight) {
                        coinAttrArr[i].endSpeed =
                            (g * coinAttrArr[i].time) / coinAttrArr[i].reDownHDelta
                        coinAttrArr[i].reDownSpeed = coinAttrArr[i].endSpeed / 5
                        coinAttrArr[i].bEnd = true
                    }
                    // 绘制金币
                    const name: string = 'img_scatter' + i
                    const img: eui.Image = Fallen.getStageByCoinImg(name)
                    img.name = name
                    Fallen.arrImg.push(img)
                    img.x = coinAttrArr[i].left
                    img.y = coinAttrArr[i].top
                    img.width = Fallen.coinWidth
                    img.height = Fallen.coinHeight
                    Fallen.parent.addChild(img)
                }
                // 顺序每一次重绘则递减一次，直到为0时，代表开始下落
                coinAttrArr[i].rndOrder =
                    coinAttrArr[i].rndOrder == 0 ? 0 : coinAttrArr[i].rndOrder - 1
            }
            const firstH = Tools.MaxVal(coinAttrArr, 'top') // 求降落过程中高度最大的金币高度
            if (firstH >= Fallen.wrapHeight - Fallen.coinHeight && !bPlayAudio) {
                bPlayAudio = true
            }
            const lastH = Tools.MinVal(coinAttrArr, 'top') // 求降落过程中高度最小的金币高度
            // 最后一个金币高度超出canvas的高度停止重绘
            if (lastH <= Fallen.wrapHeight + Fallen.coinHeight) {
                egret.setTimeout(
                    () => {
                        draw()
                        Fallen.num++
                    },
                    Fallen,
                    10,
                )
            } else {
                // 散落完成，释放
                Fallen.dispose()
            }
        }
        draw()
    }
}
