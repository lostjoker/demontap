/* tslint:disable:only-arrow-functions */
import { UserService } from '../../src/app/services/modules/UserService'
import UserController from '../../src/app/controllers/UserController'
import { TestingModule } from '@nestjs/testing'
import chai from 'chai'
import 'reflect-metadata'
import { StatusCode } from '../../src/core/GmudException'
import '../support/TestSupport'
import { postForRes, TestContext } from '../support/TestSupport'
import { MysqlService } from '../../src/app/services/db/MysqlProvider'
import { RedisService } from '../../src/app/services/db/RedisService'

const expect = chai.expect

describe('User-e2e', function() {
    this.timeout(20000)

    let mod: TestingModule
    let service: UserService
    let mysql: MysqlService

    let controller: UserController
    let redis: RedisService

    before(async function() {
        mod = TestContext.mod
        service = TestContext.userService
        controller = TestContext.userController
        mysql = mod.get(MysqlService)
        redis = mod.get(RedisService)
    })

    it('/POST user/login', async function() {
        this.slow(10000)

        // 不带参数的是badrequest
        expect(await postForRes('/user/login', {})).to.be.wrongWith(StatusCode.BadRequest)

        // 密码错误是Forbidden
        expect(
            await postForRes('/user/login', {
                username: 'u1',
                password: 'wrongpass',
            }),
        ).to.be.wrongWith(StatusCode.UsernameOrPasswordWrong)
        expect(
            await postForRes('/user/login', {
                username: 'u1123',
                password: 'pass',
            }),
        ).to.be.wrongWith(StatusCode.UsernameOrPasswordWrong)

        // 密码正确
        expect(
            await postForRes('/user/login', {
                username: 'u1',
                password: 'pass',
            }),
        )
            .to.be.okThat.to.include.keys('token')
            .and.include({ userid: 'p1' })
    })

    it('/POST user/reg', async () => {
        expect(await postForRes('/user/reg', {})).to.be.wrongWith(StatusCode.BadRequest)

        const phone = '18888888888'

        const data: any = {
            username: 'u12345',
            email: 'asdf@example.com',
            password: 'pass1',
            phone,
            code: 'vf',
        }

        // 正确的验证码注册成功
        expect(await postForRes('/user/reg', data)).to.be.logicOK()
    })
})
