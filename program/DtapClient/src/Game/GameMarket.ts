/**
 * 20171115
 * 商店界面相关
 */
class GameMarket extends eui.Component {
    public static STATUS = {
        NORMAL: 'normal',
        SOLD: 'sold',
    }

    constructor() {
        super()
    }

    private data = new eui.ArrayCollection()

    createChildren() {
        super.createChildren()

        this.g_sold.dataProvider = this.data
        this.g_sold.itemRenderer = ListItemSold
    }

    @tapListener('btn_market1')
    async market1() {
        if (!NetWork.isOnline()) {
            await Dialog.Show('网络已断开！')
            return
        }
        await this.goShop(1)
    }
    @tapListener('btn_market2')
    async market2() {
        if (!NetWork.isOnline()) {
            await Dialog.Show('网络已断开！')
            return
        }
        await this.goShop(2)
    }
    @tapListener('btn_market3')
    async market3() {
        if (!NetWork.isOnline()) {
            await Dialog.Show('网络已断开！')
            return
        }
        await this.goShop(3)
    }
    @tapListener('btn_market4')
    async market4() {
        if (!NetWork.isOnline()) {
            await Dialog.Show('网络已断开！')
            return
        }
        await this.goShop(4)
    }

    private async goShop(id: number) {
        await Player.me.syncWithServer()
        const res = await NetWork.requestWithToken('market/enter', { id })
        if (res.ok) {
            const { shop, point } = res.data
            this.refreshItems(shop, id)
            this.currentState = GameMarket.STATUS.SOLD
        }
    }

    @tapListener('btn_exitshop')
    exitShop() {
        this.currentState = GameMarket.STATUS.NORMAL
    }

    refreshItems(shop, shopid) {
        const newData: ShopItem[] = []
        for (let i = 0; i < shop.length; i++) {
            const item = shop[i]
            newData.push(new ShopItem(item.id, item.count, item.sold || false, shopid, i, this))
        }
        this.data.replaceAll(newData)
        this.data.refresh()
    }

    public g_market: eui.Group
    public g_sold: eui.DataGroup
    public btn_exitshop: eui.Button
}

/**
 * 商品列表渲染器
 */
class ListItemSold extends eui.ItemRenderer {
    data: ShopItem

    public static STATUS = {
        NORMAL: 'normal',
        SOLDOUT: 'soldout',
    }

    constructor() {
        super()
        this.skinName = 'listItemSold'
    }

    @tapListener('btn_buy')
    async buy() {
        if (this.currentState == ListItemSold.STATUS.SOLDOUT) return // 已售罄状态

        if (!NetWork.isOnline()) {
            await Dialog.Show('网络已断开！')
            return
        }
        if (Player.me.gold < this.data.price) {
            await Dialog.Show('金钱不足！')
            return
        }

        await Player.me.syncWithServer()
        const res = await NetWork.requestWithToken('market/buy', {
            shopid: this.data.shopid,
            id: this.data.id,
            slot: this.data.slot,
        })

        if (res.ok) {
            Player.me.update(res.data.newPlayer)
            this.data.marketUI.refreshItems(res.data.newShop, this.data.shopid)
        } else {
            //TODO 错误处理
        }
    }

    protected createChildren(): void {
        super.createChildren()
    }

    protected dataChanged(): void {
        super.dataChanged()
        // this.lbl_name.text = this.data.name;
        // this.lbl_price.text = this.data.price + "";
        this.img_res.source = this.data.res
        this.currentState = this.data.sold
            ? ListItemSold.STATUS.SOLDOUT
            : ListItemSold.STATUS.NORMAL
    }

    img_res: eui.Image
    public lbl_name: eui.Label
    public lbl_price: eui.Label
}
