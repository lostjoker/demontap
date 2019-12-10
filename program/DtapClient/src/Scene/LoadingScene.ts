/**
 * 数据载入界面，从服务器拉取基本数据
 */
class LoadingScene extends eui.Component {
    lblText: eui.Label
    constructor() {
        super()
        this.skinName = 'loadingScene'
    }

    protected createChildren(): void {
        super.createChildren()
        this.loadData()
    }

    private async loadData() {
        try {
            // const data = await NetWork.request("gamedata/basicData");
            GameData.init({})

            const oldPlayer = await DemonStorage.DemonKV.get('player')
            const oldToken = await DemonStorage.DemonKV.get('token')

            // 跳转到Game
            Main.Stage.removeChild(this)
            Main.Stage.addChild(new GameTown(oldPlayer, oldToken))
        } catch (error) {
            console.log(error.stack)
            // dtap.err(error);
            // this.loadData();
        }
    }
}
