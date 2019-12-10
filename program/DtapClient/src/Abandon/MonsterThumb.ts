/**
 * 怪物缩略控件
 */
class MonsterThumb extends eui.Component {
    public monster: Monster

    public img_monster: eui.Image
    public btn_lvlup: eui.Button
    public constructor(monster: Monster) {
        super()
        this.monster = monster
        this.skinName = 'monsterThumb'
    }

    public init(): void {
        this.img_monster.source = this.monster.res
    }

    @tapListener('btn_lvlup')
    public lvlUp(): void {
        console.log('怪物升级')
    }
}
