/***
 * 魔王技能
 */
class DemonSkill {

    public constructor(id, level = 0) {
        this.id = id;
        this.level = level;
    }

    /**
     * 静态，允许直接调用技能效果
     */
    public static DoEffect(effectid: string, data: Object): Object {
        return SkillEffect["ID_" + effectid](data);
    }

    /**
     * 执行技能效果，并返回结果给调用
     */
    public doEffect(data): Object {
        data.args = this.args;
        data.skilllevel = this.level;
        return SkillEffect["ID_" + this.effect](data);
    }

    /**
     * 转化为数据对象
     * 用于传给服务端
     */
    public toJsonData(): Object {
        return {
            level: this.level
        };
    }

    public id: string;

    /**
     * 效果参数和效果升级参数
     */
    public get args() {
        return [
            { arg: this.arg1, arg_up: this.arg1_up },
            { arg: this.arg2, arg_up: this.arg2_up },
            { arg: this.arg3, arg_up: this.arg3_up }
        ];
    }
    public level: number;

    /**
     * 技能名
     */
    public get name(): string { return GameData.getDemonSkill(this.id).name; }

    /**
     * 技能描述
     */
    public get description(): string { return GameData.getDemonSkill(this.id).desc; }

    public get rank(): number { return GameData.getDemonSkill(this.id).rank; }
    public get res(): number { return GameData.getDemonSkill(this.id).res; }
    public get mana(): number { return GameData.getDemonSkill(this.id).mana; }
    public get effect(): number { return GameData.getDemonSkill(this.id).effect; }
    public get arg1(): number { return GameData.getDemonSkill(this.id).arg1; }
    public get arg2(): number { return GameData.getDemonSkill(this.id).arg2; }
    public get arg3(): number { return GameData.getDemonSkill(this.id).arg3; }
    public get arg1_up(): number { return GameData.getDemonSkill(this.id).arg1_up; }
    public get arg2_up(): number { return GameData.getDemonSkill(this.id).arg2_up; }
    public get arg3_up(): number { return GameData.getDemonSkill(this.id).arg3_up; }

    /**
     * 最大技能数量
     */
    public static MAX_COUNT: number = 6;

}