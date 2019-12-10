/**
 * @author SeASon
 * 英雄父类
 */
class Hero {
    get type(): number {
        return this._type || this.Template.type
    }

    set type(value: number) {
        this._type = value
    }

    get res(): string {
        return this._res || this.Template.res
    }

    set res(value: string) {
        this._res = value
    }

    get name(): string {
        return this._name || this.Template.name
    }

    set name(value: string) {
        this._name = value
    }

    /**
     * 数据模版
     */
    get Template() {
        return GameData.getHeroData().Hero[this.id]
    }

    /**
     * 通过指定数据生成英雄。
     * @param data 数据
     */
    static Factory(
        data:
            | {
                  area?: number
                  stage?: number
                  id?: number
                  isdefend?: boolean
              }
            | any,
    ): Hero {
        const hero = new Hero()
        if (data.isdefend) {
            for (const i in data) {
                hero[i] = data[i]
            }
        } else {
            if (data.id != null) {
                hero.id = data.id
            } else if (data.area != null) {
                hero.id = Hero.genIdByArea(data.area)
            } else {
                throw new Error('生成英雄失败：未指定id或区域数据')
            }

            let level: number = 1
            if (data) {
                if (data.area != null && data.stage != null) {
                    const area = new Area(data.area)
                    level =
                        area.level_min +
                        Math.floor(Math.random() * (area.level_max - area.level_min))
                }
            }

            hero.hp =
                hero.Template.hp_min +
                Math.floor(Math.random() * (hero.Template.hp_max - hero.Template.hp_min))
            hero.hp = hero.hp * Math.pow(level, 2.5)
            hero.hp = hero.hp * hero.Template.hp_ratio

            hero.gold = hero.Template.gold * Math.pow(level, 2)
        }
        return hero
    }

    /**
     * 根据地区来生成
     */
    static genIdByArea(areaId): number {
        const area = Area.Template[areaId] // FIXME
        if (area) {
            const herolist = area.hero_list.split(',')

            if (herolist.length) {
                const randheroidx = Math.floor(Math.random() * herolist.length)
                return parseInt(herolist[randheroidx])
            }
        }
        throw new Error()
    }

    id: number

    hp: number

    hp_min: number

    hp_max: number

    // 贴图素材部位数组，每个索引代表该索引处的贴图对应的srctype编号，索引对应素材的slot
    srcparts: number[]

    // 金币掉落
    gold: number

    // 是否英雄守卫
    isdefend: boolean

    private _name: string

    // 英雄素材的大类，对应HEROTYPE的值，战法牧等
    private _type: number

    // 图片资源
    private _res: string
}
