/**
 * 怪物技能控件
 */
class ListItemMonsterSkill extends eui.Component {
    get skill(): MonsterSkill {
        switch (this.slot) {
            case 1:
                return this.monster.skill1
            case 2:
                return this.monster.skill2
            case 3:
                return this.monster.skill3
            default:
                return null
        }
    }

    monster: Monster
    slot: number

    lbl_name: eui.Label
    lbl_desc: eui.Label
    btn_skill: eui.Button
    public constructor() {
        super()
        this.skinName = 'listItemSkill'
    }

    public setData(monster: Monster, slot: number) {
        this.monster = monster
        this.slot = slot

        this.lbl_name.text = this.skill.name
        this.lbl_desc.text = this.skill.desc
        ;(this.btn_skill as any).imgDisplay.source = this.skill.res
    }
}
