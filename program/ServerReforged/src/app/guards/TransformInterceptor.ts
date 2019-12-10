import {
    BadRequestException,
    CallHandler,
    ConflictException,
    ExecutionContext,
    ForbiddenException,
    HttpException,
    Injectable,
    NestInterceptor,
    UnauthorizedException,
} from '@nestjs/common'
import { catchError, map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { Log } from '../../core/Log'
import { App } from '../app'
import Express from 'express'
import GmudException, { StatusCode } from '../../core/GmudException'
import { QueryFailedError } from 'typeorm'
import moment = require('moment')
import { AwaitLock } from '../services/util/AwaitLock'
import { Lock } from 'redlock'

export interface RespType<T = any> {
    data?: T
    ok: boolean
    code: number
    msg?: string
}

const KEY_REQID: unique symbol = Symbol('Request ID')

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, RespType<T> | T> {
    static requestCounter = 0

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<RespType<T> | T>> {
        const req = context.switchToHttp().getRequest() as Express.Request
        // const KEY_REQID = '__req_id__'
        const reqid = `${App.ProcessUid} ${TransformInterceptor.requestCounter++}`
        req[KEY_REQID] = reqid

        const startMoment = moment()
        if (req.method !== 'HEAD') {
            Log.i(`[Request start] ${req.method} ${req.path} ${reqid}`)
        }

        let lock: Lock = null
        if (req.body.token) {
            lock = await AwaitLock.acquireAsync(req.body.token)
        }

        return next.handle().pipe(
            map(data => {
                try {
                    lock?.unlock()
                } catch (e) {}
                const reqTimeMs = moment().diff(startMoment, 'ms')
                const msg = `[Request end] ${req.path} ${reqid} +${reqTimeMs}ms`
                if (reqTimeMs < 500) {
                    if (req.method !== 'HEAD') {
                        Log.i(msg)
                    }
                } else {
                    Log.w(msg)
                }

                if (typeof data === 'object') {
                    return {
                        ok: true,
                        code: 0,
                        data,
                    }
                }

                return data
            }),
            catchError(async (exception: Error) => {
                try {
                    lock?.unlock()
                } catch (e) {}

                let msg: any = '未知错误'
                let code: StatusCode = StatusCode.Unknown

                if (exception instanceof GmudException) {
                    msg = exception.message
                    code = exception.code
                } else if (exception instanceof HttpException) {
                    msg = exception.message
                    while (typeof msg === 'object' && msg.message) {
                        msg = msg.message
                    }

                    if (exception instanceof BadRequestException) {
                        code = StatusCode.BadRequest
                    } else if (exception instanceof UnauthorizedException) {
                        code = StatusCode.Unauthorized
                    } else if (exception instanceof ConflictException) {
                        code = StatusCode.Conflict
                    } else if (exception instanceof ForbiddenException) {
                        code = StatusCode.Forbidden
                    }
                } else if (exception instanceof QueryFailedError) {
                    // 由于sql错误有单独的logger，所以这里不打log
                    code = StatusCode.InternalServerErr
                } else {
                    // unexpected
                    Log.wtf(exception)
                    code = StatusCode.InternalServerErr
                }

                const reqTimeMs = moment().diff(startMoment, 'ms')
                const logmsg = `[Request end] ${req.path} ${reqid} +${reqTimeMs}ms with err: ${msg}`
                if (reqTimeMs < 500) {
                    Log.i(logmsg)
                } else {
                    Log.w(logmsg)
                }

                return {
                    ok: false,
                    code,
                    msg,
                }
                // throw err
            }),
        )
    }
}
