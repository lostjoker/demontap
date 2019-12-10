/**
 * 怪物类
 */
class Monster {
	public constructor(data: {
        id: number,
        soulCount?: number,
        activated?: boolean,
        lvl?: number,
        skill1lvl?: number,
        skill2lvl?: number,
        skill3lvl?: number
    }) {
		this.id = data.id;
        this.soulCount = data.soulCount || 0;
        this.activated = data.activated || false;
        this.lvl = data.lvl || 0;

        this.skill1lvl = data.skill1lvl || 0;
        this.skill2lvl = data.skill2lvl || 0;
        this.skill3lvl = data.skill3lvl || 0;
	}

    /**
     * 根据各种等级来计算最终数据
     */
    public calcData():void{
        // this.value.atk = this.level.atk * 2;
        // this.value.cri = this.level.cri;
        // this.value.spd = this.level.spd;
    }

    /**
     * 根据id搜索数据
     */
    public static GetDataById(id){
        return GameData.getMonsterData().Monster[id];
    }

	public id:number;
    public soulCount: number;
    public activated: boolean;
    public lvl: number;
    public skill1lvl: number;
    public skill2lvl: number;
    public skill3lvl: number;

    public get name(): string {
        return Monster.GetDataById(this.id).name;
    }

	public get res(): string {
        return "monster" + Monster.GetDataById(this.id).res + "_png";
    }

    public get soulToActivate(): number {
        return Monster.GetDataById(this.id).compose;
    }

    public get desc(): string {
        return Monster.GetDataById(this.id).desc;
    }

    public get skill1(): MonsterSkill {
        return new MonsterSkill(Monster.GetDataById(this.id).skill1, this.skill1lvl);
    }
    public get skill2(): MonsterSkill {
        return new MonsterSkill(Monster.GetDataById(this.id).skill2, this.skill2lvl);
    }
    public get skill3(): MonsterSkill {
        return new MonsterSkill(Monster.GetDataById(this.id).skill3, this.skill3lvl);
    }

    //真实基础值
    public value = {
        atk:0,
        cri:0,
        spd:0
    };

}
