/**
 * 恶魔界面
 */
class GameDemon extends eui.Component {
    @byLanguage()
    lbl_stage

    @byLanguage()
    lbl_demon_desc

    public lbl_coin: eui.Label
    public btn_lvl: eui.Button
    public btn_atk: eui.Button
    public btn_cri: eui.Button
    public btn_spd: eui.Button

    public g_evo: eui.Group
    public g_attr: eui.Group
    public g_break: eui.Group
    constructor() {
        super()
    }

    createChildren() {
        super.createChildren()
    }

    /**
     * 魔王升级操作
     */
    @tapListener('btn_lvl')
    public upLevel() {
        return this.upgrade('lvl')
    }

    @tapListener('btn_atk')
    public upAttack() {
        return this.upgrade('atk')
    }

    @tapListener('btn_cri')
    public upCrit() {
        return this.upgrade('cri')
    }

    @tapListener('btn_spd')
    public upSpeed() {
        return this.upgrade('spd')
    }

    @eventListener(dtap.EVENT_PLAYER_UPDATED, '@gameui')
    public updatePlayer() {
        this.lbl_coin.text = GameData.getText('UI/lbl_coin', Tools.C_Num(Player.me.gold))
        this.btn_lvl.labelDisplay.text = GameData.getText('UI/btn_lvl', Player.me.demon.level.lvl)
        this.btn_atk.labelDisplay.text = GameData.getText(
            'UI/btn_atk',
            Player.me.demon.level.atk,
            Player.me.demon.value.atk,
            Player.me.demon.level.atk * 10,
        )
        this.btn_cri.labelDisplay.text = GameData.getText(
            'UI/btn_cri',
            Player.me.demon.level.cri,
            Player.me.demon.value.cri,
            Player.me.demon.level.cri * 10,
        )
        this.btn_spd.labelDisplay.text = GameData.getText(
            'UI/btn_spd',
            Player.me.demon.level.spd,
            Player.me.demon.value.spd,
            Player.me.demon.level.atk * 10,
        )
    }

    /**
     * 魔王升级
     */
    private async upgrade(uptype: string) {
        if (!NetWork.isOnline()) {
            await Dialog.Show('网络已断开！')
            return
        }

        const player = Player.me
        const res = await NetWork.requestWithToken(
            'demon/upDemonLevel',
            { uptype, player },
            true,
            true,
        )

        if (res.ok) {
            const { goldCost, level } = res.data

            if (level[uptype] > player.demon.level[uptype]) {
                player.demon.level[uptype] = level[uptype]
            }

            Player.me.update(res.data.player)
            await player.updateLocal()
            // GameUI.Instance.updatePlayer()
            await Player.me.syncWithServer()
            Tools.Hint(`升级成功，消耗了${goldCost}金币`, this)
        } else {
            Tools.Hint(res.msg, this)
        }
    }
}
