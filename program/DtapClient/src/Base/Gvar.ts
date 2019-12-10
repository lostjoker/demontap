/**
 * 全局参数
 */
class Gvar {
	constructor() {
	}

	/**
	 * 上限数量
	 */
	static MAX = {
		GEM:99999999,//宝石持有上限
		SOLDS_INSHOP1:8,//商店1（初级）每次刷新的物品项数
		SOLDS_INSHOP2:10,
		SOLDS_INSHOP3:10,
		SOLDS_INSHOP4:12,
		//掠夺排行榜超出该点数在刷新周期后重置回该值
		RANK_ROB_RESET_POINT:3000
	};

	/**
	 * 金币消耗枚举
	 */
	static COST_GOLD = {
		GACHA:1000
	};

	/**
	 * 宝石消耗枚举
	 */
	static COST_GEM = {
		GACHA:100
	};

	/**
	 * 区域解锁
	 */
	static AREA_LIMIT = {
		SHOP1:0,//商店1解锁
		SHOP2:10,
		SHOP3:100,
		SHOP4:1000,
		ALTAR:20,//祭坛解锁
	};

	/**
	 * 刷新周期，间隔，单位毫秒
	 */
	static PERIOD = {
		//所有商店刷新内容周期
		SHOP_REFRESH:15 * 60 * 1000,
		//掠夺排行榜刷新时间（以每周1凌晨0点作为起点的毫秒数）
		RANK_ROB_REFRESH:0
	};

}
