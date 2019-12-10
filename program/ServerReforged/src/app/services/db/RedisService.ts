import {Injectable} from '@nestjs/common'
import IORedis from 'ioredis'
import {ConfigService} from '../config/ConfigService'
import {Log} from '../../../core/Log'

@Injectable()
export class RedisService extends IORedis {

	private readonly logger = new Log('redis')

	/**
	 * redis是否已正常连接上服务器
	 */
	get isReady() {
		return this.status === 'ready'
	}

	constructor(config: ConfigService) {
		super(config.RedisConfig)

		this.on('error', err => {
			this.logger.e(err)
		})

		setInterval(() => this.pingDb(), 30000)
	}

	private pingDb() {
		this.ping().then()
	}

}
