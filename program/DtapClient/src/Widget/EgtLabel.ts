class EgtLabel extends eui.Component implements eui.UIComponent {
    lblEgtCount: eui.Label

    public constructor() {
        super()
        this.skinName = 'EgtLabelSkin'
    }

    protected partAdded(partName: string, instance: any): void {
        super.partAdded(partName, instance)
    }

    protected childrenCreated(): void {
        super.childrenCreated()
    }

    @tapListener()
    private chargeEgt() {
        const chargePanel = GameUI.Instance.getChildByName('chargePanel')
        chargePanel.visible = !chargePanel.visible
    }

    @eventListener(dtap.EVENT_PLAYER_UPDATED, '@gameui')
    private onUpdateData() {
        this.lblEgtCount.text = Player.me.cash + ''
    }
}
