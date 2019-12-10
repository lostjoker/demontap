/**
 * 怪物技能
 */
class MonsterSkill {

	public id;
	public lvl;

	get _data() {
		return GameData.getMonsterSkill(this.id);
	}

	public constructor(id: number, lvl: number = 0) {
		this.id = id;
		this.lvl = lvl;
	}

	/**
	 * 技能名
	 */
	public get name(): string { return this._data.name; }

	/**
	 * 技能描述
	 */
	public get desc(): string { return this._data.desc; }

	public get rank(): number { return this._data.rank; }
	public get res(): string { return "skill" + this._data.res + "_png"; }
	public get mana(): number { return this._data.mana; }
	public get effect(): number { return this._data.effect; }
	public get arg1(): number { return this._data.arg1; }
	public get arg2(): number { return this._data.arg2; }
	public get arg3(): number { return this._data.arg3; }
	public get arg1_up(): number { return this._data.arg1_up; }
	public get arg2_up(): number { return this._data.arg2_up; }
	public get arg3_up(): number { return this._data.arg3_up; }

}
