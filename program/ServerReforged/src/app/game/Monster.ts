import { getService } from '../../util/GetService'
import GamedataService from '../services/core/GamedataService'

export interface PlayerMonsterData {
    id: number
    soulCount?: number
    activated?: boolean
    lvl?: number
    skill1lvl?: number
    skill2lvl?: number
    skill3lvl?: number
}

/**
 * 怪物
 */
export default class Monster implements PlayerMonsterData {
    public constructor(data: PlayerMonsterData) {
        this.id = data.id
        this.soulCount = data.soulCount || 0
        this.activated = data.activated || false
        this.lvl = data.lvl || 0

        this.skill1lvl = data.skill1lvl || 0
        this.skill2lvl = data.skill2lvl || 0
        this.skill3lvl = data.skill3lvl || 0
    }

    /**
     * 根据id搜索数据
     */
    public static GetDataById(id: number) {
        return getService(GamedataService).monsterData.Monster[id]
    }

    /**
     * 怪物编号
     */
    public id: number

    /**
     * 当前拥有此怪物灵魂数量
     */
    public soulCount: number
    /**
     * 是否已激活此怪物
     */
    public activated: boolean
    /**
     * 怪物等级
     */
    public lvl: number
    /**
     * 技能1等级
     */
    public skill1lvl: number
    /**
     * 技能2等级
     */
    public skill2lvl: number
    /**
     * 技能3等级
     */
    public skill3lvl: number

    public get name(): string {
        return Monster.GetDataById(this.id).name
    }

    // public get res(): string {
    // 	return "monster" + Monster.GetDataById(this.id).res + "_png";
    // }

    public get soulToActivate(): number {
        return Monster.GetDataById(this.id).compose
    }

    public get desc(): string {
        return Monster.GetDataById(this.id).desc
    }

    // public get skill1(): MonsterSkill {
    // 	return new MonsterSkill(Monster.GetDataById(this.id).skill1, this.skill1lvl);
    // }
    // public get skill2(): MonsterSkill {
    // 	return new MonsterSkill(Monster.GetDataById(this.id).skill2, this.skill2lvl);
    // }
    // public get skill3(): MonsterSkill {
    // 	return new MonsterSkill(Monster.GetDataById(this.id).skill3, this.skill3lvl);
    // }
}
