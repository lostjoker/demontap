/**
 *
 * @author SeASon
 * 魔王
 */
class Devil extends Demon {

    public constructor(data) {
        super();
        this.initData(data);
        this.initSkill(data);
    }

    public initData(data): void {
        this.id = 100;
        if (data) {
            if (data.level) {
                for (let k in this.level) {
                    this.level[k] = data.level[k];
                }
            }
        }
    }

    public initSkill(data): void {
        super.initSkill(data);
        let demondata = Demon.GetDataById(this.id);
        //初始化技能数据
        for (let i = 0; i < DemonSkill.MAX_COUNT; ++i) {
            this.skilldata[i].id = demondata["skill" + (i + 1)];
        }
        if (data && data.skill) {
            for (let i = 0; i < DemonSkill.MAX_COUNT; ++i) {
                this.skilldata[i].level = (data.skill[i] && data.skill[i].level) || 0;
            }
        }
        //技能数据转化为技能对象
        for (let i = 0; i < DemonSkill.MAX_COUNT; ++i) {
            this.skills[i] = new DemonSkill(this.skilldata[i].id, this.skilldata[i].level);
        }
    }
}
