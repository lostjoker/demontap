import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common'
import {ConfigService} from '../config/ConfigService'
import {Connection, createConnection, ObjectType, Repository} from 'typeorm'
import * as path from 'path'
import {SqlLog} from '../../../core/Log'

@Injectable()
export class MysqlService implements OnModuleInit, OnModuleDestroy {

	private connection: Connection

	constructor(private readonly config: ConfigService) {
	}

	async onModuleInit() {
		this.connection = await createConnection({
			type: 'mysql',
			host: this.config.MysqlConfig.host,
			port: this.config.MysqlConfig.port,
			username: this.config.MysqlConfig.username,
			password: this.config.MysqlConfig.password,
			database: this.config.MysqlConfig.database,
			entities: [
				path.join(__dirname, '../../models/**/*{.ts,.js}'),
			],
			synchronize: !this.config.isProduction(), // no longer sync on production
			logging: true,
			charset: 'utf8mb4_general_ci',
			logger: new SqlLog(),
		})

		setInterval(() => this.pingDb(), 30000)
	}

	async onModuleDestroy() {
		if (this.connection && this.connection.isConnected) {
			await this.connection.close()
		}
	}

	getRepo<T>(entity: ObjectType<T>): Repository<T> {
		return this.connection.getRepository(entity)
	}

	private pingDb() {
		// language=MySQL
		const query = 'select 1'
		this.connection.query(query).then()
	}

	get _connection() {
		return this.connection
	}

}
