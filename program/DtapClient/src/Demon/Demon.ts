/**
 * @author SeASon
 * 魔王父类
 */
class Demon {
    /**
     * 计算属性
     */
    public get value() {
        return {
            atk: this.level.atk * 2,
            cri: this.level.cri,
            spd: this.level.spd,
        }
    }

    /**
     * 魔王类型
     */
    public static TYPES: number[] = [0]

    /**
     * 魔王原始数据
     */
    public static ORI_DATA = [
        {
            id: '0',
            name: '角色模型',
            rank: '0',
            init_atk: '100',
            init_cri_chance: '1',
            init_cri_dmg: '100',
            init_spd: '100',
            skill1: '1000',
            skill2: '1001',
            skill3: '1002',
            skill4: '1003',
            skill5: '1004',
            skill6: '1005',
            unlock_gold: '0',
            unlock_gem: '0',
        },
        {
            id: '1',
            name: '测试角色1',
            rank: '0',
            init_atk: '100',
            init_cri_chance: '1',
            init_cri_dmg: '100',
            init_spd: '100',
            skill1: '1000',
            skill2: '1001',
            skill3: '1002',
            skill4: '1003',
            skill5: '1004',
            skill6: '1005',
            unlock_gold: '0',
            unlock_gem: '0',
        },
        {
            id: '2',
            name: '测试角色2',
            rank: '1',
            init_atk: '110',
            init_cri_chance: '1',
            init_cri_dmg: '100',
            init_spd: '100',
            skill1: '1000',
            skill2: '1001',
            skill3: '1002',
            skill4: '1003',
            skill5: '1004',
            skill6: '1005',
            unlock_gold: '100',
            unlock_gem: '0',
        },
        {
            id: '3',
            name: '测试角色3',
            rank: '2',
            init_atk: '120',
            init_cri_chance: '1',
            init_cri_dmg: '100',
            init_spd: '100',
            skill1: '1000',
            skill2: '1001',
            skill3: '1002',
            skill4: '1003',
            skill5: '1004',
            skill6: '1005',
            unlock_gold: '1000',
            unlock_gem: '0',
        },
        {
            id: '4',
            name: '测试角色4',
            rank: '3',
            init_atk: '130',
            init_cri_chance: '1',
            init_cri_dmg: '100',
            init_spd: '100',
            skill1: '1000',
            skill2: '1001',
            skill3: '1002',
            skill4: '1003',
            skill5: '1004',
            skill6: '1005',
            unlock_gold: '10000',
            unlock_gem: '0',
        },
        {
            id: '5',
            name: '测试角色5',
            rank: '4',
            init_atk: '140',
            init_cri_chance: '1',
            init_cri_dmg: '100',
            init_spd: '100',
            skill1: '1000',
            skill2: '1001',
            skill3: '1002',
            skill4: '1003',
            skill5: '1004',
            skill6: '1005',
            unlock_gold: '100000',
            unlock_gem: '0',
        },
        {
            id: '6',
            name: '测试角色6',
            rank: '5',
            init_atk: '150',
            init_cri_chance: '1',
            init_cri_dmg: '100',
            init_spd: '100',
            skill1: '1000',
            skill2: '1001',
            skill3: '1002',
            skill4: '1003',
            skill5: '1004',
            skill6: '1005',
            unlock_gold: '1000000',
            unlock_gem: '0',
        },
        {
            id: '100',
            name: '魔王',
            rank: '0',
            init_atk: '100',
            init_cri_chance: '1',
            init_cri_dmg: '100',
            init_spd: '100',
            skill1: '1000',
            skill2: '1001',
            skill3: '1002',
            skill4: '1003',
            skill5: '1004',
            skill6: '1005',
            unlock_gold: '0',
            unlock_gem: '0',
            desc: '初始的魔王角色，一统魔界是他的野望',
        },
        {
            id: '101',
            name: '死灵骑士',
            rank: '1',
            init_atk: '120',
            init_cri_chance: '1',
            init_cri_dmg: '100',
            init_spd: '90',
            skill1: '1000',
            skill2: '1001',
            skill3: '1002',
            skill4: '1003',
            skill5: '1004',
            skill6: '1005',
            unlock_gold: '100',
            unlock_gem: '0',
        },
        {
            id: '102',
            name: '魅魔',
            rank: '1',
            init_atk: '85',
            init_cri_chance: '1.3',
            init_cri_dmg: '100',
            init_spd: '95',
            skill1: '1000',
            skill2: '1001',
            skill3: '1002',
            skill4: '1003',
            skill5: '1004',
            skill6: '1005',
            unlock_gold: '1000',
            unlock_gem: '0',
        },
        {
            id: '103',
            name: '反派英雄',
            rank: '2',
            init_atk: '100',
            init_cri_chance: '1',
            init_cri_dmg: '100',
            init_spd: '130',
            skill1: '1000',
            skill2: '1001',
            skill3: '1002',
            skill4: '1003',
            skill5: '1004',
            skill6: '1005',
            unlock_gold: '10000',
            unlock_gem: '0',
        },
        {
            id: '104',
            name: '恶龙',
            rank: '3',
            init_atk: '150',
            init_cri_chance: '1',
            init_cri_dmg: '100',
            init_spd: '100',
            skill1: '1000',
            skill2: '1001',
            skill3: '1002',
            skill4: '1003',
            skill5: '1004',
            skill6: '1005',
            unlock_gold: '100000',
            unlock_gem: '0',
        },
    ]

    public static Factory(demondata): Demon {
        if (!demondata) {
            return new Devil(demondata)
        }
        switch (demondata.id) {
            case 0:
                return new Devil(demondata)
            default:
                return new Devil(demondata)
        }
    }

    /**
     * 根据id搜索数据
     */
    public static GetDataById(id): Object {
        for (let i = 0; i < Demon.ORI_DATA.length; ++i) {
            if (Demon.ORI_DATA[i].id == id) {
                return Demon.ORI_DATA[i]
            }
        }
    }

    // 魔王编号
    public id: number

    public name: string

    // 贴图素材部位数组，每个索引代表该索引处的贴图对应的srctype编号，索引对应素材的slot
    public srcparts: number[]

    // 等级
    public level = {
        lvl: 1,
        atk: 1,
        cri: 1,
        spd: 1,
    }

    public skilldata = [
        { id: '', level: 0 },
        { id: '', level: 0 },
        { id: '', level: 0 },
        { id: '', level: 0 },
        { id: '', level: 0 },
        { id: '', level: 0 },
    ]

    public skills: DemonSkill[]

    public constructor() {
        this.level.lvl = 1
        this.level.atk = 1
        this.level.cri = 1
        this.level.spd = 1
    }

    // /**
    //  * 根据各种等级来计算最终数据
    //  */
    // public calcData():void{
    //     this.value.atk = this.level.atk * 2;
    //     this.value.cri = this.level.cri;
    //     this.value.spd = this.level.spd;
    // }

    /**
     * 初始化技能对象
     */
    public initSkill(data = null): void {
        this.skills = []
    }

    /**
     * 转化为数据对象
     */
    public toObjData() {
        return {
            id: this.id,
            level: {
                lvl: this.level.lvl,
                atk: this.level.atk,
                cri: this.level.cri,
                spd: this.level.spd,
            },
            skill: [
                this.skills[0].toJsonData(),
                this.skills[1].toJsonData(),
                this.skills[2].toJsonData(),
                this.skills[3].toJsonData(),
                this.skills[4].toJsonData(),
                this.skills[5].toJsonData(),
            ],
        }
    }
}
