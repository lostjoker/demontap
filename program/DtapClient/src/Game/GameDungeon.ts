/**
 * 20171115
 * 地下城界面控制
 */
class GameDungeon extends eui.Component{

    public static STATES = {
        NORMAL:"normal",
        ALTAR:"altar",
        HERO:"hero",
        RANK:"rank",
        BAG:"bag",
        ACHIEVE:"achieve"
    };

    constructor() {
        super();
	    this.ac_inventory = new eui.ArrayCollection();
    }

    createChildren() {
        super.createChildren();
        this.g_bag.dataProvider = this.ac_inventory;
        this.g_bag.itemRenderer = GameItemRenderer;

        this.ac_ranks["battle"] = new eui.ArrayCollection();
        this.ac_ranks["area"] = new eui.ArrayCollection();
        this.ac_ranks["rich"] = new eui.ArrayCollection();

	    (<eui.DataGroup>(<any>this.c_rankPanel).g_rank).itemRendererSkinName = "listItemRank";

	    const altarpanel = (<any>this.c_altarpanel);

	    for(let i = 1; altarpanel[`btn_altarskill${i}`]; i++) {
		    const button = (<eui.Button>altarpanel[`btn_altarskill${i}`]);
		    if(!button) break;
		    button.addEventListener(egret.TouchEvent.TOUCH_TAP, () => this.onAltarButtonClick(i), this);
	    }

	    this.refreshAltarUI();
	    this.refreshRank();
    }


	/**
     * 返回主界面
	 */
	@tapListener("btn_return")
    returnMain() {
        this.currentState = GameDungeon.STATES.NORMAL;
    }


	//region 物品栏部分

	/**
     * 刷新物品栏显示
	 */
	public refreshBag() {
        this.ac_inventory.replaceAll(Player.me.inventory);
        this.ac_inventory.refresh();
    }

	/**
     * 点击切换到物品栏
	 */
	@tapListener("btn_showbag")
    public toBag(): void {
        this.currentState = GameDungeon.STATES.BAG;
        this.refreshBag();
    }

	//endregion


	//region 祭坛部分

	/**
     * 点击前往祭坛
	 */
	@tapListener("btn_showaltar")
    toAltar() {
		this.currentState = GameDungeon.STATES.ALTAR;
    }

	/**
	 * 切换tab
	 */
	@tapListener("c_altarpanel/btn_tab1")
    toAltarTab1() {
		this.c_altarpanel.currentState = "tab1";
    }
    @tapListener("c_altarpanel/btn_tab2")
    toAltarTab2() {
		this.c_altarpanel.currentState = "tab2";
    }
    @tapListener("c_altarpanel/btn_tab3")
    toAltarTab3() {
		this.c_altarpanel.currentState = "tab3";
    }

	/**
	 * 祭坛按钮点击
	 */
	onAltarButtonClick(group: number) {

    }

	/**
	 * 刷新界面
	 */
	refreshAltarUI() {
		const altarpanel = (<any>this.c_altarpanel);

		for(let i = 1; altarpanel[`btn_altarskill${i}`]; i++) {
			const button = (<any>altarpanel[`btn_altarskill${i}`]);
			if(!button) break;

			for(let j in GameData.getAltarGroup(i)) {
				const skill = GameData.getAltarGroup(i)[j];

				if(Player.me.isAltarSkillLearned(skill.id)) {
					continue;
				}

				button.imgDisplay.source = `skill${skill.res}_png`;

				break;
				//TODO 目前UI元素不足，以后再扩展
			}
		}
    }

	//endregion


	//region 排行榜部分

	/**
	 * 点击前往排行榜
	 */
	@tapListener("btn_showrank")
	toRank() {
		this.currentState = GameDungeon.STATES.RANK;
		this.validateNow();
		(<eui.DataGroup>(<any>this.c_rankPanel).g_rank).dataProvider = this.ac_ranks[this.c_rankPanel.currentState || "battle"];
		this.refreshRank();
	}

	/**
	 * 刷新排行榜
	 */
	refreshRank() {

		(async () => {
			const rankType = this.c_rankPanel.currentState || "battle";

			const ret = await NetWork.requestWithToken("rank/rank", {
				type: rankType,
				start: 0,
				end: 20,
			});

			if(ret.code == NetWork.StatusCode.SUCC) {
				// this.ranks[rankType] = ret.data.results;

				this.ac_ranks[rankType].replaceAll(ret.data.results);
				this.ac_ranks[rankType].refresh();
			}
		})();

	}

	/**
	 * 切换排行榜tab
	 */
	@tapListener("c_rankPanel/btn_tab0")
	toRankTab0() {
		this.c_rankPanel.currentState = "battle";
		(<eui.DataGroup>(<any>this.c_rankPanel).g_rank).dataProvider = this.ac_ranks[this.c_rankPanel.currentState];
		this.refreshRank();
	}

	/**
	 * 切换排行榜tab
	 */
	@tapListener("c_rankPanel/btn_tab1")
	toRankTab1() {
		this.c_rankPanel.currentState = "area";
		(<eui.DataGroup>(<any>this.c_rankPanel).g_rank).dataProvider = this.ac_ranks[this.c_rankPanel.currentState];
		this.refreshRank();
	}

	/**
	 * 切换排行榜tab
	 */
	@tapListener("c_rankPanel/btn_tab2")
	toRankTab2() {
		this.c_rankPanel.currentState = "rich";
		(<eui.DataGroup>(<any>this.c_rankPanel).g_rank).dataProvider = this.ac_ranks[this.c_rankPanel.currentState];
		this.refreshRank();
	}

	private ac_ranks: {[key: string]: eui.ArrayCollection} = {};
	// private ranks: {[key: string]: any} = {};

	//endregion


    public g_bag:eui.DataGroup;
    public btn_showaltar:eui.Button;
    public btn_showhero:eui.Button;
    public btn_showrank:eui.Button;
    public btn_showachieve:eui.Button;
    public btn_showbag:eui.Button;

    public c_altarpanel: eui.Component;
    public c_rankPanel: eui.Component;

    public ac_inventory: eui.ArrayCollection;
}

/**
 * 英雄列表渲染器
 */
class ListItemHeroGuard extends eui.ItemRenderer {
    public lbl_name: eui.Label;

    constructor() {
        super();
        this.skinName = "listItemHeroGuard";
    }

    protected createChildren(): void {
        super.createChildren();
    }

    protected dataChanged(): void {
    }
}
