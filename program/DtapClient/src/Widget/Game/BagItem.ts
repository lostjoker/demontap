/**
 * @author SeASon
 * 物品显示
 */
class BagItem extends eui.Component {
    public item_res:string;
    public item_count:string;

    public constructor(skinname: string = "bagItem") {
        super();
        this.skinName = skinname;
    }

    protected createChildren(): void {
        super.createChildren();
        this.img_res.source = this.item_res;
        this.lbl_count.text = this.item_count;
    }
    
    public img_res:eui.Image;
    public lbl_count:eui.Label;
}
