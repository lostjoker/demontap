/**
 * @author SeASon
 * 区域、关卡
 * 注意：
 * 用于游戏中读取的是idx（下标）
 */
class Area {
	get id(): number {
		return this._id;
	}

	set id(value: number) {
		this._id = value;
		if(!this.Template) {
			// 这里对于不合法数据处理强制回到小村落
			this._id = 100;
		}
		this.stage = 0;
	}

	//对应数据索引
	private get _idx() {
		return this.Template.idx;
	}

	private _id: number;

	//所处当前区域关卡
	public stage: number;

	//当前区域关卡总数
	public get maxstage(): number {
		return this.Template.stagecount;
	};

	public get level_min() { return this.Template.level_min; }
	public get level_max() { return this.Template.level_max; }

	public get res(): string {
		return `bg${this.Template.res_id}_png`;
	};

	get name() {
		return this.Template.name;
	}

	public constructor(id: number = 0) {
		this._id = id;
		if(!this.Template) {
			// 这里对于不合法数据处理强制回到小村落
			this._id = 100;
		}
		this.stage = 0;
	}

	public toNew(): void {

		let idx = this._idx + 1;
		const newData = Area.findByIdx(idx);
		if(newData) {
			this._id = newData.id;
		}

		this.stage = 0;
	}

	//暂定每个区域关卡数相同
	public static STAGE_COUNT: number = 10;

	get Template() {
		return Area.Template[this._id];
	}

	public static findByIdx(idx) {
		const areas = Area.Template;
		for(let id in areas) {
			if(areas[id].idx == idx) {
				return areas[id];
			}
		}
	}

	/**
	 * 届时存放于数据表
	 */
	public static get Template() {
        return GameData.getAreaJson().Area;
	}
}
