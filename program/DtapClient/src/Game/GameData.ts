namespace GameData {
    const LANG = 'CN'

    let _data = null

    let _inited = false

    /**
     * 用给定的数据初始化GameData
     * @param data 从服务端拉取的游戏数据
     */
    export function init(data) {
        if (_inited) {
            dtap.err('重复初始化GameData!')
            return
        }
        _inited = true

        _data = data

        _demon_json = RES.getRes('demons_data_json')
        _hero_json = RES.getRes('hero_data_json')

        _lang_json = RES.getRes(`lang_${LANG}_json`)

        // area这里将idx转为id
        _area_json = { Area: {} }
        const areaJson = RES.getRes('area_data_json')
        for (const idx in areaJson.Area) {
            if (areaJson.Area.hasOwnProperty(idx)) {
                areaJson.Area[idx].idx = parseInt(idx)
                _area_json.Area[areaJson.Area[idx].id] = areaJson.Area[idx]
            }
        }

        _monster_json = RES.getRes('monster_data_json')
        _item_json = RES.getRes('item_data_json')

        _altar_json = RES.getRes('altar_data_json')
        _altar_group = {}
        for (const id in _altar_json.AltarSkill) {
            if (_altar_json.AltarSkill.hasOwnProperty(id)) {
                const skill = _altar_json.AltarSkill[id]
                const group = skill.group

                _altar_group[group] = _altar_group[group] || []
                _altar_group[group].push(skill)
            }
        }

        for (const id in _altar_group) {
            if (_altar_group.hasOwnProperty(id)) {
                const skills = _altar_group[id]
                skills.sort((a, b) => a.area_limit - b.area_limit)
            }
        }
    }

    let _item_json: ItemData
    export function getItemData(): ItemData {
        return _item_json
    }

    let _altar_json: AltarData
    let _altar_group: { [key: number]: AltarSkillData[] }
    export function getAltarData(): AltarData {
        return _altar_json
    }

    /**
     * 获取分组的祭坛数据
     */
    export function getAltarGroup(group: number): AltarSkillData[] {
        return _altar_group[group]
    }

    let _area_json
    export function getAreaJson(): AreaData {
        return _area_json
    }

    let _hero_json
    export function getHeroData(): HeroData {
        return _hero_json
    }

    let _demon_json
    export function getDemonData() {
        return _demon_json
    }

    let _monster_json
    export function getMonsterData() {
        return _monster_json
    }

    const _monsters = {}
    export function getMonster(id) {
        _monsters[id] = _monsters[id] || new Monster(id)
        return _monsters[id]
    }

    let _lang_json: { [key: string]: { [key: string]: { original: string } } }
    export function getText(key: string, ...args: any[]) {
        const [group, id] = key.split('/')

        if (!_lang_json[group]) {
            dtap.err(`missing lang group: ${group}`)
            return '_MISSING_TEXT_'
        }
        if (!_lang_json[group][id]) {
            dtap.err(`missing lang key: ${key}`)
            return '_MISSING_TEXT_'
        }

        let text = _lang_json[group][id].original + '_A'

        text = text.replace('\\n', '\n')
        for (let i = 0; i < args.length; ++i) {
            text = text.replace(`{${i}}`, String(args[i]))
        }

        return text
    }

    /**
     * 获取指定编号的恶魔技能信息。
     */
    export function getDemonSkill(id): DemonSkillData {
        _demon_skills[id] = _demon_skills[id] || new DemonSkillData(id)
        return _demon_skills[id]
    }

    const _demon_skills: DemonSkillData[] = []

    /**
     * 获取指定编号的恶魔技能信息。
     */
    export function getMonsterSkill(id): MonsterSkillData {
        _monsters_skills[id] = _monsters_skills[id] || new MonsterSkillData(id)
        return _monsters_skills[id]
    }

    const _monsters_skills: MonsterSkillData[] = []

    class SkillData {
        protected _data

        constructor() {
            this._data = {}
        }

        /**
         * 技能编号
         */
        public get id(): number {
            return this._data.id
        }

        /**
         * 技能名
         */
        public get name(): string {
            return this._data.name
        }

        /**
         * 技能描述
         */
        public get desc(): string {
            return this._data.desc
        }

        public get rank(): number {
            return this._data.rank
        }
        public get res(): number {
            return this._data.res
        }
        public get mana(): number {
            return this._data.mana
        }
        public get effect(): number {
            return this._data.effect
        }
        public get arg1(): number {
            return this._data.arg1
        }
        public get arg2(): number {
            return this._data.arg2
        }
        public get arg3(): number {
            return this._data.arg3
        }
        public get arg1_up(): number {
            return this._data.arg1_up
        }
        public get arg2_up(): number {
            return this._data.arg2_up
        }
        public get arg3_up(): number {
            return this._data.arg3_up
        }
    }

    class DemonSkillData extends SkillData {
        constructor(id) {
            super()
            this._data = _demon_json.DemonSkill[id]
        }
    }

    class MonsterSkillData extends SkillData {
        constructor(id) {
            super()
            this._data = _monster_json.MonsterSkill[id]
        }
    }

    type AltarSkillData = {
        id: number
        name: '祭坛技能7'
        res: number
        area_limit: number
        item_limit: number
        cost: number
        type: number
        pos: number
        group: number
        effect: number
        desc: '提升魔王暴击 arg%'
        arg1: number
        arg2: number
        arg3: number
    }

    /**
     * 祭坛数据
     */
    export interface AltarData {
        AltarSkill: {
            [key: number]: AltarSkillData
        }
        AltarSkillEffect: {
            [key: number]: {
                id: 1
                desc: '提升魔王攻击 arg 点'
            }
        }
    }

    /**
     * 物品数据
     */
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

    export interface HeroData {
        Hero: {
            [key: number]: {
                name
                id
                rank
                hp_min
                hp_max
                gold
                type
                res
                hp_ratio
                boss_ratio
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
                idx?: number
            }
        }
    }
}
