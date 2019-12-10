import { Module } from '@nestjs/common'
import UserController from './controllers/UserController'
import { UserService } from './services/modules/UserService'
import { RedisService } from './services/db/RedisService'
import { ConfigService } from './services/config/ConfigService'
import { MysqlService } from './services/db/MysqlProvider'
import { ModuleMetadata } from '@nestjs/common/interfaces'
import { AdminService } from './services/modules/AdminService'
import GamedataService from './services/core/GamedataService'
import { GameService } from './services/modules/GameService'
import DemonController from './controllers/DemonController'
import EthService from './services/external/EthService'
import AxiosRequestService from './services/external/AxiosRequestService'
import StageController from './controllers/StageController'
import GachaController from './controllers/GachaController'

export const AppModuleMetadata: ModuleMetadata = {
    // imports: [HttpModule],
    controllers: [UserController, DemonController, StageController, GachaController],
    providers: [
        RedisService,
        MysqlService,
        UserService,
        ConfigService,
        AdminService,
        GamedataService,
        GameService,
        EthService,
        AxiosRequestService,
    ],
    exports: [
        RedisService,
        MysqlService,
        UserService,
        ConfigService,
        AdminService,
        GameService,
        EthService,
    ],
}

@Module(AppModuleMetadata)
export class AppModule {}
