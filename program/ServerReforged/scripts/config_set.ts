// 用来生成配置文件的脚本。

import writeFile from 'write'
import path from 'path'
import { ConfigService } from '../src/app/services/config/ConfigService'
import internalIp from 'internal-ip'

const envName = process.argv[2] ?? 'development'

const conf = new ConfigService(envName)
;(async () => {
    let serverHost = ''
    if (conf.envName === 'development') {
        serverHost = `http://${await internalIp.v4()}:8453`
    } else {
        serverHost = conf.envConfig.SERVER_ADDR
    }

    const s = `// 自动生成的配置
namespace Config {
    export const SERVER_ADDR = '${serverHost}'
    export const ERC20_ADDR = '${conf.ETHConfig.erc20Addr}'
}
`
    await writeFile(path.join(__dirname, '../../DtapClient/src/Config.ts'), s)
})()
