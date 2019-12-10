/* tslint:disable:only-arrow-functions */
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinonChai from 'sinon-chai'
import { INestApplication } from '@nestjs/common'
import { StatusCode } from '../../src/core/GmudException'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModuleMetadata } from '../../src/app/App.module'
import UserController from '../../src/app/controllers/UserController'
import { MysqlService } from '../../src/app/services/db/MysqlProvider'
import { RedisService } from '../../src/app/services/db/RedisService'
import { App } from '../../src/app/app'
import User from '../../src/app/models/User'
import { UserService } from '../../src/app/services/modules/UserService'
import sinon from 'sinon'
import chaiHttp from 'chai-http'

chai.use(chaiHttp)
chai.use(sinonChai)
chai.use(chaiAsPromised)

// tslint:disable-next-line
chai.use(function(ca: any, utils: any) {
    const Assertion = ca.Assertion
    const assert = ca.assert
    const proxify = utils.proxify
    const flag = utils.flag

    utils.addMethod(Assertion.prototype, 'wrongWith', function(
        this: any,
        value: StatusCode,
        message?: string,
    ) {
        if (typeof message !== undefined) {
            flag(this, 'message', message)
        }

        new ca.Assertion(this._obj).to.include({ ok: false, code: value })

        // this.assert(this._obj.code === value, null, message, value, this._obj.code)

        return this
    })

    utils.addMethod(Assertion.prototype, 'logicOK', function(this: any, message?: string) {
        if (typeof message !== undefined) {
            flag(this, 'message', message)
        }
        new ca.Assertion(this._obj).to.include({ ok: true, code: StatusCode.OK })
        return this
    })

    utils.addMethod(Assertion.prototype, 'okWith', function(
        this: any,
        value: any,
        message?: string,
    ) {
        if (typeof message !== undefined) {
            flag(this, 'message', message)
        }
        new ca.Assertion(this._obj).to.include({ ok: true, code: StatusCode.OK, body: value })
        return this
    })

    utils.addProperty(Assertion.prototype, 'okThat', function(this: any) {
        new ca.Assertion(this._obj).to.include({ ok: true, code: StatusCode.OK })
        new ca.Assertion(this._obj).to.include.keys('body')
        return new ca.Assertion(this._obj.body)
    })
})

export const TestStore = new Map<string, string>()

export async function createTestModule(): Promise<TestingModule> {
    const metadata = AppModuleMetadata
    // metadata.providers.push(ValidationCodeServiceMock)
    // metadata.providers.push(EmailServiceMock)
    return (
        Test.createTestingModule(metadata)
            // .overrideProvider(ValidationCodeService)
            // .useClass(ValidationCodeServiceMock)
            // .overrideProvider(EmailService)
            // .useClass(EmailServiceMock)
            // .overrideProvider(OldServerService)
            // .useClass(OldServerMock)
            .compile()
    )
}

export function postForRes(path: string, body: object = {}) {
    return chai
        .request(TestContext.app.getHttpServer())
        .post(path)
        .send(body)
        .then(res => Promise.resolve(res.body))
}

declare global {
    namespace Chai {
        export interface Assertion {
            okThat: Assertion

            wrongWith(value: StatusCode, message?: string): Assertion

            okWith(value: any, message?: string): Assertion

            logicOK(message?: string): Assertion
        }
    }
}

export namespace TestContext {
    export let mod: TestingModule
    export let userService: UserService
    export let userController: UserController
    export let mysql: MysqlService
    export let redis: RedisService
    export let app: INestApplication
}

before(async function() {
    this.timeout(20000)

    console.log('creating Test module')
    TestContext.mod = await createTestModule()

    TestContext.userService = TestContext.mod.get(UserService)
    TestContext.userController = TestContext.mod.get(UserController)
    TestContext.mysql = TestContext.mod.get(MysqlService)
    TestContext.redis = TestContext.mod.get(RedisService)

    TestContext.app = TestContext.mod.createNestApplication()
    App.setGlobalsForApp(TestContext.app)

    await TestContext.app.init()
})

beforeEach(async () => {
    console.log('creating Test database')

    const repo = TestContext.mysql.getRepo(User)
    // await repo.clear()
    await repo.delete({})

    const user1 = new User()
    user1.username = 'u1'
    await user1.savePassword('pass')

    const user2 = new User()
    user2.username = '12312381238'
    await user2.savePassword('pass')

    console.log('ok')
})

afterEach(async () => {
    // Restore the default sandbox here
    sinon.restore()
})

after(async () => {
    // await mysql.connection.close()
    await TestContext.redis.disconnect()
    await TestContext.mod.close()
})
