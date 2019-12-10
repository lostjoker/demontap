// /**
//  * 法师型英雄
//  */
// class WarriorHero extends Hero {
//
// 	public constructor(data = null) {
// 		super();
// 		this.init(data);
// 	}
//
// 	public init(data):void{
// 		this.type = 0;
// 		if(data.isdefend){
// 			for(let i in data){
// 				this[i] = data[i];
// 			}
// 		}else{
// 			this.genId(data);
// 			this.initDataByStage(data);
// 		}
// 		if(data.srcparts){
// 			this.srcparts = data.srcparts;
// 		}else{
// 			this.srcparts = [
// 				Math.floor(Math.random() * WarriorHero.SRCTYPE.length),//头发
// 				Math.floor(Math.random() * WarriorHero.SRCTYPE.length),//衣服
// 				Math.floor(Math.random() * WarriorHero.SRCTYPE.length),//护额
// 				Math.floor(Math.random() * WarriorHero.SRCTYPE.length),//胸甲
// 				Math.floor(Math.random() * WarriorHero.SRCTYPE.length),//裙甲
// 				Math.floor(Math.random() * WarriorHero.SRCTYPE.length),//右臂
// 				Math.floor(Math.random() * WarriorHero.SRCTYPE.length),//左臂
// 				Math.floor(Math.random() * WarriorHero.SRCTYPE.length)//剑
// 			];
// 		}
// 	}
//
// 	/**
// 	 * 生成id
// 	 */
// 	public genId(data):void{
// 		if(data.id != null){
// 			this.id = data.id;
// 			this.name = data.name;
// 			return;
// 		}
// 		if(data.area){
// 			if(this.genIdByArea(data))
// 				return;
// 		}
// 		this.id = 0;
// 		this.name = "随机战士英雄";
// 	}
//
// 	/**
// 	 * 根据地区来生成
// 	 */
// 	public genIdByArea(data):boolean{
// 		let area = Area.ORI_DATA[data.area];
// 		if(area){
// 			let herolist = area["hero_list"].split(",");
// 			//将符合类型的加入新数组
// 			let typeherolist = [];
// 			for(let i = 0; i < herolist.length; ++i){
// 				let heroid = herolist[i];
// 				let herodata = Hero.GetDataById(heroid);
// 				if(herodata && herodata["type"] == this.type){
// 					typeherolist.push(herodata);
// 				}
// 			}
// 			if(typeherolist.length){
// 				let randheroidx = Math.floor(Math.random() * typeherolist.length)
// 				this.id = typeherolist[randheroidx]["id"];
// 				this.name = typeherolist[randheroidx]["name"];
// 				return true;
// 			}
// 		}
// 		return false;
// 	}
//
// 	public initDataByStage(data = null):void{
// 		let level:number = 1;
// 		if(data){
// 			if(data.area != null && data.stage != null){
// 				level = (data.area + 1) * Area.STAGE_COUNT + (data.stage + 1);
// 			}
// 		}
// 		this.hp_min = Math.floor(WarriorHero.ORIGINAL_DATA.HP_MIN * ((level / Area.STAGE_COUNT) + 1));
// 		this.hp_max = Math.floor(WarriorHero.ORIGINAL_DATA.HP_MAX * ((level / Area.STAGE_COUNT) + 1));
// 	    this.hp = this.hp_min + Math.floor(Math.random() * (this.hp_max - this.hp_min));
// 		this.gold = Math.floor(WarriorHero.ORIGINAL_DATA.GOLD * ((level / Area.STAGE_COUNT) + 1));
// 	}
//
// 	public static ORIGINAL_DATA = {
// 		HP_MIN:8,
// 		HP_MAX:12,
// 		GOLD:3
// 	};
//
//     /**
//      * 英雄资源小类，对应颜色
//      */
//     public static SRCTYPE:number[] = [
//         0,//原色，紫
//         1,//h-120,a+60,i0，湖蓝
// 		2,//
// 		3,//
// 		4,//
// 		5//
//     ];
// }
