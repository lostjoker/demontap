import { Injectable, Optional } from '@nestjs/common'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import { Log } from '../../../core/Log'
import { RedisOptions } from 'ioredis'
import { parseBool, safeParseInt } from '../../../util/CommonUtil'
import appRoot from 'app-root-path'

@Injectable()
export class ConfigService {
    readonly envConfig = dotenv.parse(fs.readFileSync(appRoot.resolve(`${this.envName}.env`)))

    readonly MysqlConfig = {
        host: this.envConfig.MYSQL_HOST,
        port: safeParseInt(this.envConfig.MYSQL_PORT, 3306),
        username: this.envConfig.MYSQL_USER,
        password: this.envConfig.MYSQL_PASS,
        database: this.envConfig.MYSQL_DB,
    } as const

    readonly RedisConfig: RedisOptions = {
        host: this.envConfig.REDIS_HOST,
        port: safeParseInt(this.envConfig.REDIS_PORT, 6379),
        password: this.envConfig.REDIS_PASSWORD,
        db: safeParseInt(this.envConfig.REDIS_DB, 0),
        family: 4,
    } as const

    readonly ETHConfig = {
        chainName: this.envConfig.CHAIN_NAME,
        ethScan: this.envConfig.ETHSCAN_HOST,
        erc20Addr: this.envConfig.ERC20_ADDR,
    } as const

    constructor(@Optional() readonly envName: string = process.env.NODE_ENV || 'development') {
        Log.d(this.envConfig)
    }

    /**
     * 检查当前连接数据库是否为生产环境
     */
    isProduction() {
        return process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'realdb'
    }
}
