export interface HeroData {
    Hero: {
        [key: number]: {
            name
            id
            rank
            hp_min
            hp_max
            type
            res
            hp_ratio
            boss_ratio
        }
    }
}

export interface ItemData {
    Item: {
        [key: number]: {
            id: 1000
            name: '剑'
            rank: 0
            res: 1
            gold_cost: 1000
            gem_cost: 0
            add_exp: 200
            troop: 1
            shop1_refresh: 10000
            shop1_min: 1
            shop1_max: 1
            shop2_refresh: 0
            shop2_min: 1
            shop2_max: 1
            shop3_refresh: 0
            shop3_min: 1
            shop3_max: 1
            shop4_refresh: 0
            shop4_min: 1
            shop4_max: 1
            desc: '听说你贩剑？'
        }
    }
}

export interface AreaData {
    Area: {
        [key: number]: {
            id: number
            name: string
            vaild: number
            level_min: number
            level_max: number
            stagecount: number
            hero_list: string
            res_id: number
            desc: string
        }
    }
}

export interface MonsterData {
    Monster: {
        [key: number]: {
            id: 1001
            name: '枯骨卫士'
            rank: 1
            vaild: 1
            res: 1
            gold_gacha: 1000
            gold_gacha_min: 5
            gold_gacha_max: 10
            gold_gacha_whole: 20
            gem_gacha: 0
            gem_gacha_min: 5
            gem_gacha_max: 10
            gem_gacha_whole: 0
            compose: 20
            skill1: '1001'
            skill2: '1002'
            skill3: '1003'
            desc: '无'
        }
    }

    MonsterLevel: {
        [key: number]: {
            level: 1
            gold_cost: 0
            atk: 1
            cri: 1
            spd: 1
        }
    }

    MonsterSkill: {
        [key: number]: SkillData
    }

    MonsterSkillLevel: {
        [key: number]: SkillLevelData
    }

    MonsterSkillEffect: {
        [key: number]: SkilllEffectData
    }
}

export interface DemonData {
    Demon: {
        [key: number]: {
            id: 100
            name: '魔王'
            rank: 0
            init_atk: 100
            init_cri_chance: 1
            init_cri_dmg: 100
            init_spd: 100
            skill1: 1000
            skill2: 1001
            skill3: 1002
            skill4: 1003
            skill5: 1004
            skill6: 1005
            unlock_gold: 0
            unlock_gem: 0
            desc: '初始的魔王角色，一统魔界是他的野望'
        }
    }
}

/**
 * 祭坛数据
 */
export interface AltarData {
    AltarSkill: {
        [key: number]: {
            id: 1006
            name: '祭坛技能7'
            res: 2
            area_limit: 6
            item_limit: 7
            cost: 11
            type: 1
            pos: 2
            group: 2
            effect: 2
            desc: '提升魔王暴击 arg%'
            arg1: 15
            arg2: 0
            arg3: 0
        }
    }
    AltarSkillEffect: {
        [key: number]: {
            id: 1
            desc: '提升魔王攻击 arg 点'
        }
    }
}

export const DATA_HERO_BASE = {
    BaseHero: {
        HP_MIN: 5,
        HP_MAX: 10,
        GOLD: 2,
    },
    WarriorHero: {
        HP_MIN: 8,
        HP_MAX: 12,
        GOLD: 3,
    },
    MageHero: {
        HP_MIN: 5,
        HP_MAX: 10,
        GOLD: 3,
    },
}

export interface SkillData {
    id: 2
    name: '直接伤害技能'
    技能品质?: 0
    rank?: 0
    res: 1
    effect: 1
    desc: '无'
    arg1: 0
    arg1_up: 0
    arg2: 0
    arg2_up: 0
    arg3: 0
    arg3_up: 0
}

export interface SkillLevelData {
    id: 1
    desc: '提升自身攻击 arg 点'
}

export interface SkilllEffectData {
    lvl: 1
    skill1_mon_lvl?: 10
    skill1_gold_cost?: 1000
    skill2_mon_lvl?: 50
    skill2_gold_cost?: 5000
    skill3_mon_lvl?: 100
    skill3_gold_cost?: 10000
}
