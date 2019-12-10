class DialogMonsterInfo extends eui.Component {

    monster: Monster;
    lbl_name: eui.Label;
    img_res: eui.Image;
    lbl_desc: eui.Label;

    li_skill1: ListItemMonsterSkill;
    li_skill2: ListItemMonsterSkill;
    li_skill3: ListItemMonsterSkill;

    constructor(data: Monster) {
        super();
        this.monster = data;
        this.skinName = "dialogMonsterInfo";
    }

    createChildren() {
        super.createChildren();

        this.lbl_name.text = this.monster.name;
        this.img_res.source = this.monster.res;
        this.lbl_desc.text = this.monster.desc;

        this.li_skill1.setData(this.monster, 1);
        this.li_skill2.setData(this.monster, 2);
        this.li_skill3.setData(this.monster, 3);
    }

    @tapListener("btn_close")
    close() {
        this.parent.removeChild(this);
    }

    public static Show(data: Monster, parent: egret.DisplayObjectContainer = GameUI.Instance) {
	    const dialogMonsterInfo = new DialogMonsterInfo(data);
	    dialogMonsterInfo.verticalCenter = 0;
	    dialogMonsterInfo.horizontalCenter = 0;
	    parent.addChild(dialogMonsterInfo);
    }
}
