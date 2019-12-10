/**
 *
 * @author SeASon
 * 物品显示
 *
 */
class Item extends eui.Component {
    public item_img:string;
    public item_count:string;

    public constructor(skinname: string = "item") {
        super();
        this.skinName = skinname;
    }

    protected createChildren(): void {
        super.createChildren();
        this.img_item.source = this.item_img;
        this.lbl_count.text = this.item_count;
    }
    
    public img_item:eui.Image;
    public lbl_count:eui.Label;
}
