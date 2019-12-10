/**
 * 物品详情
 */
class BagItemInfo extends eui.Component {

	data: GameItem;

	bi:BagItem;

	lbl_name: eui.Label;
	lbl_desc: eui.Label;

	constructor(data: GameItem) {
		super();
		this.data = data;
		this.skinName = "dialogItemInfo";
	}

	createChildren() {
		super.createChildren();

		this.bi.img_res.source = this.data.res;
		this.bi.lbl_count.text = this.data.count + "";

		this.lbl_name.text = this.data.name;
		this.lbl_desc.text = this.data.desc;
	}

	@tapListener("btn_close")
	close() {
		this.parent.removeChild(this);
	}

	static Show(data: GameItem, parent: egret.DisplayObjectContainer = GameUI.Instance) {
		const dialog = new BagItemInfo(data);
		dialog.verticalCenter = 0;
		dialog.horizontalCenter = 0;
		parent.addChild(dialog);
	}
}
