/**
 *
 * @author SeASon
 * 自实现droplist用作人数设置
 *
 */
class DropList extends eui.Component {
    public seatlist: eui.ArrayCollection;
    
    public seatselected:number;
    
	public constructor() {
        super();
        this.skinName = "dropList";
        this.seatlist = new eui.ArrayCollection();
    }

    protected createChildren(): void {
        super.createChildren();
        this.list_seats.dataProvider = this.seatlist;
        this.list_seats.itemRenderer = SeatsListIRSkin;
        this.r_bg.addEventListener(egret.TouchEvent.TOUCH_TAP,this.showList,this);
        this.lbl_name.addEventListener(egret.TouchEvent.TOUCH_TAP,this.showList,this);
        this.updateList();
    }

    /**
     * 更新关注列表
     */
    public updateList() {
        this.seatlist.removeAll();
        let seats = [5,6,7,8,9,10];
        for(let i = 0;i < seats.length;++i) {
            let data = {
                seat: seats[i],
                name: seats[i] + "人局",
                parent:this
            }
            this.seatlist.addItem(data);
        }
        this.list_seats.validateNow();
        this.list_seats.selectedIndex = 0;
        this.seatselected = this.list_seats.selectedItem.seat;
        this.lbl_name.text = this.list_seats.selectedItem.name;
    }
    
    public showList():void{
        this.list_seats.visible = true;
    }
    
    public hideList():void{
        this.list_seats.visible = false;
        this.seatselected = this.list_seats.selectedItem.seat;
        this.lbl_name.text = this.list_seats.selectedItem.name;
    }
    
    public list_seats: eui.List;
    public r_bg:eui.Rect;
    public lbl_name:eui.Label;
}


class SeatsListIRSkin extends eui.ItemRenderer {

    public lbl_name: eui.Label;

    constructor(skinname: string = "listItemDropList") {
        super();
        this.skinName = skinname;
    }

    protected createChildren(): void {
        super.createChildren();
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.doSelect,this);
    }

    protected dataChanged(): void {
    }

    public doSelect(): void {
        (<DropList>this.data.parent).hideList();
    }

}
