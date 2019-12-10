/* tslint:disable:max-classes-per-file */
import {LoggerService, Optional} from '@nestjs/common'
import * as log4js from 'log4js'
import {normalDatetime} from '../util/DateTimeUtil'
import * as util from 'util'
import {Logger, QueryFailedError, QueryRunner} from 'typeorm'
import moment = require('moment')

log4js.addLayout('json', config => logEvent => {

	let content = logEvent.data[0]
	if (typeof content !== 'string') {
		content = util.inspect(content)
	}

	return JSON.stringify({
		time: normalDatetime(moment(logEvent.startTime)),
		content,
		category: logEvent.categoryName,
		level: (logEvent.level as any).levelStr,
		data: util.inspect(logEvent.data.slice(1)),
	}) + config.separator
})

const categories = {
	default: {
		appenders: ['out', 'date'],
		level: 'trace',
	},
	user: {
		appenders: ['out', 'date', 'important'],
		level: 'all',
	},
	admin: {
		appenders: ['out', 'date', 'important'],
		level: 'all',
	},
}

const Log4jsConfig = {
	appenders: {
		out: {
			type: 'console',
		},
		date: {
			type: 'dateFile',
			filename: 'logs/log_date/app.log',
			layout: {type: 'json', separator: ''},
			pattern: 'yyyy-MM-dd',
			keepFileExt: true,
			alwaysIncludePattern: true,
			daysToKeep: 30,
		},
		important: {
			type: 'dateFile',
			filename: 'logs/log_file/important.log',
			layout: {type: 'json', separator: ''},
			pattern: 'yyyy-MM-dd',
			keepFileExt: true,
			alwaysIncludePattern: true,
			daysToKeep: 30,
		},
	},
	categories,
	pm2: !!process.env.IN_PM2,
	disableClustering: false,
}

log4js.configure(Log4jsConfig)

export class Log {

	public static v(msg: any, ...args: any[]) {
		this.Default.v(msg, ...args)
	}

	public static d(msg: any, ...args: any[]) {
		this.Default.d(msg, ...args)
	}

	public static i(msg: any, ...args: any[]) {
		this.Default.i(msg, ...args)
	}

	public static w(msg: any, ...args: any[]) {
		this.Default.w(msg, ...args)
	}

	public static e(msg: any, ...args: any[]) {
		this.Default.e(msg, ...args)
	}

	public static wtf(msg: any, ...args: any[]) {
		this.Default.wtf(msg, ...args)
	}

	private static readonly Default = new Log('app')
	private readonly logger: log4js.Logger

	constructor(@Optional() category: string = 'sys') {
		this.logger = log4js.getLogger(category)
	}

	v(msg: any, ...args: any[]) {
		this.logger.trace(msg, ...args)
	}

	d(msg: any, ...args: any[]) {
		this.logger.debug(msg, ...args)
	}

	i(msg: any, ...args: any[]) {
		this.logger.info(msg, ...args)
	}

	w(msg: any, ...args: any[]) {
		this.logger.warn(msg, ...args)
	}

	e(msg: any, ...args: any[]) {
		this.logger.error(msg, ...args)
	}

	wtf(msg: any, ...args: any[]) {
		this.logger.fatal(msg, ...args)
	}

}

export class SysLog implements LoggerService {

	readonly Default = log4js.getLogger('sys')

	error(message: any, trace?: string, context?: string): any {
		this.Default.error(message)
	}

	log(message: any, context?: string): any {
		this.Default.info(message)
	}

	warn(message: any, context?: string): any {
		this.Default.warn(message)
	}

}

export class SqlLog implements Logger {

	readonly Default = log4js.getLogger('sql')

	log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): any {
		switch (level) {
			case 'log':
				this.Default.debug(message)
				break
			case 'info':
				this.Default.info(message)
				break
			case 'warn':
				this.Default.warn(message)
				break
		}
	}

	logMigration(message: string, queryRunner?: QueryRunner): any {
		this.Default.debug(message)
	}

	logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
		const sql = query + (parameters && parameters.length ? ' -- PARAMETERS: ' + this.stringifyParams(parameters) : '')
		this.Default.trace('query' + ': ' + sql)
	}

	logQueryError(error: string | QueryFailedError, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
		// tslint:disable-next-line:quotemark
		if (error instanceof QueryFailedError && error.message.includes('ETIMEDOUT')) {
			this.Default.warn('')
		} else {
			const sql = query + (parameters && parameters.length ? ' -- PARAMETERS: ' + this.stringifyParams(parameters) : '')
			this.Default.error(`query failed: ` + sql)
			this.Default.error(`error:`, error)
		}
	}

	logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
		const sql = query + (parameters && parameters.length ? ' -- PARAMETERS: ' + this.stringifyParams(parameters) : '')
		this.Default.warn(`query is slow: ` + sql)
		this.Default.warn(`execution time: ` + time)
	}

	logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
		this.Default.debug(message)
	}

	/**
	 * Converts parameters to a string.
	 * Sometimes parameters can have circular objects and therefor we are handle this case too.
	 */
	protected stringifyParams(parameters: any[]) {
		try {
			return JSON.stringify(parameters)

		} catch (error) { // most probably circular objects in parameters
			return parameters
		}
	}

}
