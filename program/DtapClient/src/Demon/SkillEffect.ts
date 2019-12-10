/**
 * 技能效果
 */
class SkillEffect {
	public constructor() {
	}

	/**
	 * 直接造成arg倍率的伤害
	 */
	public static ID_1(data):Object{
		//计算
		let result = {};
		let tapdmg = (data.tapdmg * data.args[0].arg + data.tapdmg * (data.args[0].arg_up * (data.skilllevel - 1))) / 100
		//效果
		let gameui = GameUI.Instance;
		gameui.fight.updateGameDataAndView({damage:tapdmg});
        let effect_json = RES.getRes("effect_json");
        let effect_txtr = RES.getRes("effect_png");
        let mcfactory = new egret.MovieClipDataFactory(effect_json,effect_txtr);
        let mc_effect:egret.MovieClip = new egret.MovieClip(mcfactory.generateMovieClipData("effect"));
        gameui.addChild(mc_effect);
        gameui.setChildIndex(mc_effect,Const.ZINDEX.EFFECT_SKILL);
		mc_effect.addEventListener(egret.Event.COMPLETE, ()=>{
			gameui.removeChild(mc_effect);
		}, this);
		mc_effect.scaleX = 5;
		mc_effect.scaleY = 5;
		mc_effect.x = (gameui.width - mc_effect.width * mc_effect.scaleX) / 2;
		mc_effect.y = (gameui.height - mc_effect.height * mc_effect.scaleY) / 2;
        mc_effect.gotoAndPlay("1",1);
		// gameui.fight.armatureClip[gameui.fight.currentHero.type].animation.gotoAndPlay("beated",0,0,1);
		//返回
		result["tapdmg"] = tapdmg;
		return result;
	}
	
	public static ID_2(data):Object{
		return;
	}
	
	public static ID_3(data):Object{
		return;
	}
	
	public static ID_4(data):Object{
		return;
	}
	
	public static ID_5(data):Object{
		return;
	}

	/**
	 * 持续自动点击
	 */
	public static ID_6(data):Object{
		//计算
		let result = {};
		let hits_persecond = data.args[0].arg + (data.args[0].arg_up * (data.skilllevel - 1));
		let tapdmg = (data.tapdmg * data.args[1].arg + data.tapdmg * (data.args[1].arg_up * (data.skilllevel - 1))) / 100
		let duration = data.args[2].arg + (data.args[2].arg_up * (data.skilllevel - 1));
		//效果
		let gameui = GameUI.Instance;
		let cycle = Math.floor(Const.TIMER_INTERVAL.SECOND / hits_persecond);
		let timer:egret.Timer = new egret.Timer(cycle, hits_persecond * duration);//

        let effect_json = RES.getRes("effect_json");
        let effect_txtr = RES.getRes("effect_png");
        let mcfactory = new egret.MovieClipDataFactory(effect_json,effect_txtr);
        let mc_effect:egret.MovieClip = new egret.MovieClip(mcfactory.generateMovieClipData("effect"));
		gameui.addChild(mc_effect);
        gameui.setChildIndex(mc_effect,Const.ZINDEX.EFFECT_SKILL);
		mc_effect.scaleX = 5;
		mc_effect.scaleY = 5;
		mc_effect.x = (gameui.width - mc_effect.width * mc_effect.scaleX) / 2;
		mc_effect.y = (gameui.height - mc_effect.height * mc_effect.scaleY) / 2;
        mc_effect.gotoAndPlay("1",-1);

		timer.addEventListener(egret.TimerEvent.TIMER,() => {
			gameui.fight.updateGameDataAndView({damage:tapdmg});
        	// gameui.fight.armatureClip[gameui.fight.currentHero.type].animation.gotoAndPlay("beated",0,0,1);
		},this);
		timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, ()=>{
			mc_effect.stop();
			gameui.removeChild(mc_effect);
		},this);
		timer.start();

		//返回
		result["tapdmg"] = tapdmg;
		return result;
	}

}