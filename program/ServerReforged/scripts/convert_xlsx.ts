/**
 * xlsx转json的配置
 * @author 12548
 */
import * as path from 'path'
import xlsx from 'node-xlsx'
import _ from 'lodash'
import jsonfile from 'jsonfile'
import makeDir from 'make-dir'

interface XlsxFileConfig {
    path: string
    name: string
    sheets: Array<{
        name: string
        keyColumn?: string
        /**
         * 如果设置了此项，则排除掉不在include里面的列。
         */
        include?: string[]
    }>
}

const sheetsOfLanguage = [
    {
        name: 'UI',
        keyColumn: 'key',
        include: ['translation'],
    },
    {
        name: 'MonsterName',
        keyColumn: 'key',
        include: ['translation'],
    },
    {
        name: 'HeroName',
        keyColumn: 'key',
        include: ['translation'],
    },
    {
        name: 'AreaName',
        keyColumn: 'key',
        include: ['translation'],
    },
]

const CONFIG = {
    // 来源目录
    src_dir: path.join(__dirname, '../../../design'),
    // 目标目录
    dist_dir: {
        server: path.join(__dirname, '../data/converted'),
        client: path.join(__dirname, '../../DtapClient/resource/data/converted'),
    },
    files: [
        {
            path: 's数据表.xlsx',
            name: 'carddata', // 用于输出显示的名字
            sheets: [
                {
                    name: 'card',
                    keyColumn: 'id', // 指定了表格中作为json对象的key的列
                },
                {
                    name: 'monster',
                    keyColumn: 'id',
                },
            ],
        },
        {
            path: 'j祭坛技能（科技）.xlsx',
            name: 'altar_data',
            sheets: [
                {
                    name: 'AltarSkill',
                    keyColumn: 'id', // 指定了表格中作为json对象的key的列
                },
                {
                    name: 'AltarSkillEffect',
                    keyColumn: 'id',
                },
            ],
        },
        {
            path: 'q区域关卡.xlsx',
            name: 'area_data',
            sheets: [
                {
                    name: 'Area',
                    // 区域关卡用idx不用id
                    // keyColumn: "id",
                },
            ],
        },
        {
            path: 's手下的怪物们.xlsx',
            name: 'monster_data',
            sheets: [
                {
                    name: 'Monster',
                    keyColumn: 'id',
                },
                {
                    name: 'MonsterLevel',
                    keyColumn: 'level',
                },
                {
                    name: 'MonsterSkill',
                    keyColumn: 'id',
                },
                {
                    name: 'MonsterSkillEffect',
                    keyColumn: 'id',
                },
                {
                    name: 'MonsterSkillLevel',
                    keyColumn: 'level',
                },
            ],
        },
        {
            path: 'w物品.xlsx',
            name: 'item_data',
            sheets: [
                {
                    name: 'Item',
                    keyColumn: 'id',
                },
            ],
        },
        {
            path: 'y英雄是敌人.xlsx',
            name: 'hero_data',
            sheets: [
                {
                    name: 'Hero',
                    keyColumn: 'id',
                },
                {
                    name: 'HeroType',
                    keyColumn: 'type',
                },
                {
                    name: 'HeroLevel',
                    keyColumn: 'level',
                },
                {
                    name: 'HeroSkill',
                    keyColumn: 'id',
                },
                {
                    name: 'HeroSkillEffect',
                    keyColumn: 'id',
                },
                {
                    name: 'HeroSkillLevel',
                    keyColumn: 'level',
                },
            ],
        },
        {
            path: 'w我们的大魔王.xlsx',
            name: 'demons_data',
            sheets: [
                {
                    name: 'Demon',
                    keyColumn: 'id',
                },
                {
                    name: 'DemonLevel',
                    keyColumn: 'lvl',
                },
                {
                    name: 'DemonSkill',
                    keyColumn: 'id',
                },
                {
                    name: 'DemonSkillEffect',
                    keyColumn: 'id',
                },
                {
                    name: 'DemonSkillLevel',
                    keyColumn: 'lvl',
                },
            ],
        },
        {
            path: 'lang_CN.xlsx',
            name: 'lang_CN',
            sheets: sheetsOfLanguage,
        },
        {
            path: 'lang_EN.xlsx',
            name: 'lang_EN',
            sheets: sheetsOfLanguage,
        },
    ] as XlsxFileConfig[],
}

for (const file of CONFIG.files) {
    const srcfilepath = `${CONFIG.src_dir}/${file.path}`

    console.log(`正在从文件【${srcfilepath}】读取【${file.name}】`)

    const workSheets = xlsx.parse(srcfilepath)

    const outputObj = {}

    for (const sheet of file.sheets) {
        const sheetName = sheet.name
        const keyColumn = sheet.keyColumn
        const include = sheet.include

        const xlsxSheet = getByName(workSheets, sheetName)
        if (!xlsxSheet) {
            console.log(`错误！找不到工作表：${sheetName}`)
            continue
        }

        const sheetObj = {}

        /**
         * @type {*[][]}
         */
        const data = xlsxSheet.data

        /**
         * 第一行，列名
         */
        const columns = data[0]

        for (let i = 1; i < Math.min(data.length, 9999); i++) {
            const lineobj = {}
            const line = data[i]
            let linekey = i - 1

            if (line.length <= 0) continue

            for (let j = 0; j < line.length; j++) {
                const cell = line[j]
                const column = columns[j]

                if (column === keyColumn) {
                    linekey = cell
                }

                if (include && !include.includes(column)) {
                    continue
                }

                lineobj[column] = cell
            }

            sheetObj[linekey] = lineobj
        }

        outputObj[sheetName] = sheetObj

        console.log(`已处理工作簿[${sheetName}]，共${data.length - 1}行${columns.length}列`)
    }

    _.forEach(CONFIG.dist_dir, (outputDir, key) => {
        makeDir.sync(outputDir)
        const outputPath = `${outputDir}/${file.name}.json`
        jsonfile.writeFileSync(outputPath, outputObj, { spaces: 2 })
        console.log(`已输出到【${key}】：${outputPath}`)
    })
}

function getByName(data: any, name: string) {
    for (const obj of data) {
        if (obj.name === name) {
            return obj
        }
    }
    return null
}
