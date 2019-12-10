/**
 *
 * @author SeASon
 *
 */
class GameBg extends eui.Component {
    public bgcolor = {
        INTOWN: 0xCCE8CF,//0x777777
        INLOBBY: 0xCCE8CF,
        INTABLE: 0xCCE8CF,
        INGAME: 0xCCE8CF//0x444444
    };
    
    public constructor(skinname:string = "gameBg") {
        super();
        this.skinName = skinname;
    }

    protected createChildren(): void {
        super.createChildren();
    }
    
    public initInTown(time:number = 0):void{
//        if(time == 0) {
//            this.lbl_bg.backgroundColor = this.bgcolor.INTOWN;
//            this.img_bg.alpha = 0.5;
//            return;
//        }
//        this.lbl_bg.backgroundColor = 0x1878c2;
//        this.img_bg.alpha = 0.5;
    }
    
    public initInLobby(time: number = 0): void {
//        if(time == 0) {
//            this.lbl_bg.backgroundColor = this.bgcolor.INLOBBY;
//            this.img_bg.alpha = 0.5;
//            return;
//        }
    }

    public initInTable(time: number = 0): void {
//        if(time == 0) {
//            this.lbl_bg.backgroundColor = this.bgcolor.INTABLE;
//            this.img_bg.alpha = 0.5;
//            return;
//        }
    }
    
    public initInGame(time: number = 0): void {
//        if(time == 0) {
//            this.lbl_bg.backgroundColor = this.bgcolor.INGAME;
//            this.img_bg.alpha = 0.5;//0.2
//            return;
//        }
    }
    public lbl_bg: eui.Label;
    public img_bg: eui.Image;
}
