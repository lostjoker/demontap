/**
 * @author SeASon
 * 游戏主要界面你的父
 */
class GameUI extends eui.Component {
    public static get Instance() {
        return GameUI._instance
    }

    static STATUE = {
        FIGHT: 'fight',
        DUNGEON: 'dungeon',
        DEMON: 'demon',
        MARKET: 'market',
        TREASURE: 'treasure',
    }

    private static _instance: GameUI

    public fight: GameFight
    public dungeon: GameDungeon
    public demon: GameDemon
    public market: GameMarket
    public treasure: GameTreasure

    // 服务器发送来的消息列表
    public servernoticelist: string[]

    public tween_servicenotice: egret.Tween
    public bb: BlockBoard
    public dialog: Dialog
    // 帮助面板
    // public btn_help: eui.Button;
    // public img_setting: eui.Button;
    public g_servernotice: eui.Group
    public lbl_servernotice: eui.Label

    private offlineData: any

    public constructor(offlineData: any = null) {
        super()
        GameUI._instance = this
        this.skinName = 'gameui'
        this.offlineData = offlineData
    }

    /**
     * 向服务端同步验证数据
     */
    @egretTimer({
        name: 'timer_syn',
        delay: 5000,
        autoStart: true,
    })
    async synEmit() {
        const res = await NetWork.requestWithToken('demon/poll')

        if (res.ok) {
            const data = res.data as any[]
            for (const message of data) {
                if (message.type === 'charge') {
                    Player.me.egtCash = message.newEgt
                    Player.me.update()

                    Tools.Hint(`You have charged ${message.value} EGT`)
                }
            }
        }
    }

    /**
     * 创建全服消息显示
     */
    public updateServerNotice(data): void {
        if (!this.g_servernotice) {
            return
        }
        this.servernoticelist.push(data.msg)
        if (!this.g_servernotice.visible) {
            this.g_servernotice.visible = true
            this.tweenServerNoticeInit()
        }
    }

    /**
     * 改变消息内容
     */
    public changeServerNotice(): void {
        if (this.servernoticelist.length) {
            this.lbl_servernotice.text = this.servernoticelist.shift()
        }
    }

    /**
     * 清除一条消息
     */
    public shiftServerNotice(): void {
        if (!this.g_servernotice) {
            return
        }
        if (this.servernoticelist.length) {
            this.tweenServerNoticeInit()
        } else {
            this.g_servernotice.visible = false
        }
    }

    // 初始化消息动画
    public tweenServerNoticeInit(): void {
        const self: GameUI = this
        self.tween_servicenotice = egret.Tween.get(self.lbl_servernotice, { loop: false })
            .call(self.changeServerNotice, self, [self])
            .to({ x: self.width })
            .to({ x: -self.lbl_servernotice.width }, 10000) // 这个长度处理目前判断有问题，只记录了上一次的
            .call(self.shiftServerNotice, self, [self])
    }

    /**
     * 刷新
     */
    public refresh(): void {
        if (egret.RuntimeType.NATIVE === egret.Capabilities.runtimeType) {
            // native中没有window！
            return
        }
        this.bb.show()
        window.location.reload()
    }

    public cancelRefresh(): void {
        this.bb.hide()
    }

    public updatePlayer(): void {
        this.dispatchEvent(new dtap.PlayerUpdatedEvent())
    }

    dispose() {
        void (this.fight as any).dispose()
        GameUI._instance = null
        if (this.parent) {
            this.parent.removeChild(this)
        }
    }

    protected createChildren(): void {
        super.createChildren()

        this.servernoticelist = []

        this.updatePlayer()

        // 显示离线收益
        if (this.offlineData && this.offlineData.getgold) {
            Dialog.Show({
                content: GameData.getText('UI/dialog_offlineIncome', this.offlineData.getgold),
                parent: this,
            }).then(() => {
                /* 忽略结果 */
            })
        }
    }
}
