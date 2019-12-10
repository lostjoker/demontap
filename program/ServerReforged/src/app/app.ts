import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './App.module'
import * as fs from 'fs'
import { TransformInterceptor } from './guards/TransformInterceptor'
import { INestApplication } from '@nestjs/common'
import { MyValidationPipe } from './guards/MyValidationPipe'
import { Log, SysLog } from '../core/Log'
import { baseHans } from '../core/UUID'
import { WsAdapter } from '@nestjs/platform-ws'

export namespace App {
    export const ProcessUid = baseHans.generate()
    export let app: INestApplication

    let running = false

    /**
     * 为Nest设置全局管道等。
     * @param nestApplication
     */
    export function setGlobalsForApp(nestApplication: INestApplication) {
        app = nestApplication
        nestApplication.useGlobalPipes(new MyValidationPipe())
        nestApplication.useGlobalInterceptors(new TransformInterceptor())
    }

    export async function run() {
        if (running) return

        const options: any = {
            logger: new SysLog(),
            cors: true,
        }

        if (process.env.HTTPS === 'enabled') {
            options.httpsOptions = {
                key: fs.readFileSync(process.env.HTTPS_KEY_PATH),
                cert: fs.readFileSync(process.env.HTTPS_CERT_PATH),
            }
        }

        app = await NestFactory.create(AppModule, options)
        app.useWebSocketAdapter(new WsAdapter(app))
        setGlobalsForApp(app)

        await app.listen(Number(process.env.PORT ?? 8453))

        Log.i(`Server started ${ProcessUid}`)

        running = true
    }
}
