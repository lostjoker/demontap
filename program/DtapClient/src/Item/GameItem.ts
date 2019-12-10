/**
 * 商店物品类
 */
class ShopItem {

	public shopid = 0;
	public id: number = 0;
	public count: number = 1;
	public sold: boolean = false;
	public slot: number;
	public marketUI: GameMarket;

	constructor(id: number, count: number, sold: boolean, shopid: number, slot: number, marketUI: GameMarket) {
		this.id = id;
		this.count = count;
		this.sold = sold;
		this.shopid = shopid;
		this.slot = slot;
		this.marketUI = marketUI;
	}

	public get price() {
		return this.getData().gold_cost * this.count;
	}

	private getData() {
		return GameData.getItemData().Item[this.id];
	}

	public get name() {
		return this.getData().name;
	}

	public get res() {
		return `item${this.getData().res}_png`;
	}
}

/**
 * 物品类
 */
class GameItem {

	public id: number = 0;
	public count: number = 1;

	constructor(data:{id: number, count: number}) {
		this.id = data.id;
		this.count = data.count;
	}

	private getData() {
		return GameData.getItemData().Item[this.id];
	}

	public get res() {
		return `item${this.getData().res}_png`;
	}

	public get troop() {
		return this.getData().troop;
	}

	public get name() {
		return this.getData().name;
	}

	public get desc() {
		return this.getData().desc;
	}
}

class GameItemRenderer extends eui.ItemRenderer {

	data: GameItem;

	constructor() {
		super();
		this.skinName = "bagItem";
	}

	protected createChildren(): void {
		super.createChildren();
	}

	protected dataChanged(): void {
		super.dataChanged();
		this.img_res.source = this.data.res;
		this.lbl_count.text = this.data.count + "";

		this.lbl_count.visible = this.data.troop >= 2;
	}

	img_res: eui.Image;
	public lbl_count: eui.Label;

	@tapListener()
	showInfo() {
		BagItemInfo.Show(this.data);
	}
}
