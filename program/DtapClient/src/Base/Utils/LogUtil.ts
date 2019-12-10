// 日志管理

/**
 * 恶魔点击
 */
namespace dtap {
    export enum LogLevel {
        VERBOSE = 0,
        DEBUG = 1,
        INFO = 2,
        NOTICE = 3,
        WARN = 4,
        ERROR = 5,
        WTF = 6,
    }

    /**
     * 大于等于此等级的日志会输出。
     */
    export const OUTPUT_LOGLEVEL = LogLevel.VERBOSE

    /**
     * 打日志。
     * @param level 日志等级
     * @param message 日志内容
     * @param args 要输出的额外信息
     */
    export function log(level: LogLevel, message, ...args): void {
        let lvlStr = ''
        switch (level) {
            case LogLevel.VERBOSE:
                lvlStr = 'VERBOSE'
                break
            case LogLevel.DEBUG:
                lvlStr = 'DEBUG'
                break
            case LogLevel.INFO:
                lvlStr = 'INFO'
                break
            case LogLevel.NOTICE:
                lvlStr = 'NOTICE'
                break
            case LogLevel.WARN:
                lvlStr = 'WARN'
                break
            case LogLevel.ERROR:
                lvlStr = 'ERROR'
                break
            case LogLevel.WTF:
                lvlStr = 'WTF'
                break
        }

        const date = Tools.GetDateFormat(new Date())
        const msg = `[${date} ${lvlStr}] ${message}`

        if (level >= OUTPUT_LOGLEVEL) {
            if (level <= LogLevel.INFO) {
                egret.log(msg, ...args)
            } else if (level <= LogLevel.WARN) {
                egret.warn(msg, ...args)
            } else {
                egret.error(msg, ...args)
            }
        }
    }

    export function verbose(message, ...args): void {
        log(LogLevel.VERBOSE, message, ...args)
    }
    export function debug(message, ...args): void {
        log(LogLevel.DEBUG, message, ...args)
    }
    export function info(message, ...args): void {
        log(LogLevel.INFO, message, ...args)
    }
    export function notice(message, ...args): void {
        log(LogLevel.NOTICE, message, ...args)
    }
    export function warn(message, ...args): void {
        log(LogLevel.WARN, message, ...args)
    }
    export function err(message, ...args): void {
        log(LogLevel.ERROR, message, ...args)
    }
    export function wtf(message, ...args): void {
        log(LogLevel.WTF, message, ...args)
    }
}
