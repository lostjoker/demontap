import Queue from 'bull'
import {Injectable, OnModuleDestroy} from '@nestjs/common'
import {ConfigService} from '../config/ConfigService'

@Injectable()
export class QueueService implements OnModuleDestroy {

	readonly MainQueue = new Queue<any>('queue:main', {
		redis: this.config.RedisConfig,
	})

	constructor(private readonly config: ConfigService) {
	}

	async onModuleDestroy() {
		await this.MainQueue.close()
	}
}
