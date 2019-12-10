import Redlock from 'redlock'
import { Log } from '../../../core/Log'
import { RedisService } from '../db/RedisService'
import { App } from '../../app'

const logger = new Log('lock')

export namespace AwaitLock {
    let redlock: Redlock = null

    export async function acquireAsync(name: string, ttl = 2500) {
        if (!redlock) {
            redlock = new Redlock([App.app.get(RedisService)], {
                // the expected clock drift; for more details
                // see http://redis.io/topics/distlock
                driftFactor: 0.01, // time in ms

                // the max number of times Redlock will attempt
                // to lock a resource before erroring

                retryCount: 10,
                // the time in ms between attempts
                retryDelay: 200, // time in ms

                // the max time in ms randomly added to retries
                // to improve performance under high contention
                // see https://www.awsarchitectureblog.com/2015/03/backoff.html
                retryJitter: 200, // time in ms
            })

            redlock.on('clientError', err => {
                logger.e('A redis error has occurred:', err)
            })
        }

        logger.v(`locking: ${name}`)
        return await redlock.lock(`locks:${name}`, ttl)
    }
}

export const LOCKING_FIELD: unique symbol = Symbol('Locking Fields')

export function lockingField(): PropertyDecorator {
    return (target: any, propertyKey: string) => {
        target[LOCKING_FIELD] = target[LOCKING_FIELD] || []
        target[LOCKING_FIELD].push(propertyKey)
    }
}

// 获取函数的参数名
// tslint:disable-next-line:ban-types
function getParameterName(fn: Function) {
    const COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm
    const DEFAULT_PARAMS = /=[^,)]+/gm
    const FAT_ARROWS = /=>.*$/gm
    let code = fn.prototype ? fn.prototype.constructor.toString() : fn.toString()
    code = code
        .replace(COMMENTS, '')
        .replace(FAT_ARROWS, '')
        .replace(DEFAULT_PARAMS, '')
    const result = code.slice(code.indexOf('(') + 1, code.indexOf(')')).match(/([^\s,]+)/g)
    return result === null ? [] : result
}

export const LOCK_PARAM: unique symbol = Symbol('Locking Prarms')

export function lockParam(name: string = ''): ParameterDecorator {
    return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
        target[LOCK_PARAM] = target[LOCK_PARAM] || {}
        const table: any[] = target[LOCK_PARAM]
        table[propertyKey] = table[propertyKey] || []
        if (name === '') name = getParameterName(target[propertyKey])[parameterIndex]
        table[propertyKey].push({ name, parameterIndex })
    }
}

export function useLock(): MethodDecorator {
    return (
        target: any,
        propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<any>,
    ) => {
        const func: (...args: any[]) => any = target[propertyKey]

        descriptor.writable = false
        delete descriptor.get
        delete descriptor.set

        // tslint:disable-next-line:only-arrow-functions
        descriptor.value = async function(...args: any[]) {
            const self = this

            const clz = target
            const funcName = propertyKey as string

            logger.v('trying to lock on: ' + funcName)

            const table: { [key: string]: Array<{ name: string; parameterIndex: number }> } =
                clz[LOCK_PARAM]

            if (!table) {
                logger.e(`lock unable on ${funcName}`)
            }

            const lockParams = table[funcName]

            if (!lockParams) {
                logger.e(`lock unable on ${funcName}`)
            }

            // obtain lock name
            const lockNames: string[] = []

            lockParams.forEach(it => {
                const realParam = args[it.parameterIndex]
                if (!realParam) {
                    logger.e(`can't find param: ${it.name}`)
                    return
                }

                if (['string', 'boolean', 'number'].includes(typeof realParam)) {
                    lockNames.push(`${it.name}:${realParam}`)
                } else if (typeof realParam === 'object' && realParam[LOCKING_FIELD]) {
                    lockNames.push(
                        ...(realParam[LOCKING_FIELD] as string[]).map(
                            field => `${field}:${realParam[field]}`,
                        ),
                    )
                } else {
                    logger.e(`can't find lockname of param: ${it.name}`)
                }
            })

            lockNames.forEach(it => logger.d(`locking: ${it}`))
            const locks = await Promise.all(lockNames.map(name => AwaitLock.acquireAsync(name)))

            try {
                return await func.call(self, ...args)
            } finally {
                locks.forEach(lock => {
                    logger.v(`releasing lock on ${lock.resource}`)
                    lock.unlock().catch(e => logger.e(e))
                })
            }
        }

        return descriptor
    }
}
