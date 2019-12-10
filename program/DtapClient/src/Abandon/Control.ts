/**
 *
 * @author SeASon
 * 游戏控制类
 * 决定了游戏进程外的操作和设置
 */
class Control {
    public currentHero: Hero

    public currentArea: Area

    // 正在掠夺，用于判断
    public robing: boolean

    // 游戏计时器
    public gametimer: egret.Timer

    // 过去的时间点
    public passtime: number = 0

    /**
     * 数据已初始化过，根据目前服务端的状态临时设定
     */
    public initialized: boolean

    public constructor() {
        this.currentArea = new Area()
        const herodata = {
            area: this.currentArea.id,
            stage: this.currentArea.stage,
            type: 0,
        }
        this.currentHero = Hero.Factory(herodata)
    }

    /**
     * 更新来自服务端的游戏数据
     * 切换客户端的状态
     */
    public updateGameData(reconnect: boolean = false): void {
        if (!this.initialized) {
            return
        }
    }

    /**
     * 阶段时限计算，与服务端计算规则同步
     */

    public getStageTime(): number {
        const stagetime = 0
        return stagetime
    }

    /**
     * 游戏计时器开始
     */

    public gameTimerStart(): void {
        this.passtime = egret.getTimer()
        this.gametimer.start()
    }

    /**
     * 游戏计时器停止
     */

    public gameTimerStop(): void {
        this.gametimer.stop()
    }

    /**
     * 输出游戏中的日志
     */

    public log(fromseat: number, msg: string, color: number = Const.GAME_COLOR.WHITE): void {
        //        Tools.GameLog(this.game.gmp_panel,fromseat, msg, color);
    }
}
