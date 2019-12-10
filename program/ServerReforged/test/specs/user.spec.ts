/* tslint:disable:only-arrow-functions */
import { UserService } from '../../src/app/services/modules/UserService'
import UserController from '../../src/app/controllers/UserController'
import User from '../../src/app/models/User'
import chai from 'chai'
import { BadRequestException, ConflictException } from '@nestjs/common'
import 'reflect-metadata'
import '../support/TestSupport'
import { TestContext } from '../support/TestSupport'
import { UsernameOrPasswordWrongException } from '../../src/core/GmudException'
import { RegDto } from '../../src/app/dto/UserDTO'

const expect = chai.expect

describe('User', function() {
    this.timeout(20000)

    let service: UserService
    let controller: UserController

    before(() => {
        service = TestContext.userService
        controller = TestContext.userController
    })

    it('should login with correct name and pass', async () => {
        const login1 = await service.loginByPwd('u1', 'pass')
        const login2 = await service.loginByPwd('a@b.c', 'pass')
        const login3 = await service.loginByPwd('12312341234', 'pass')
        expect(login1.user).include({ userid: 'p1', username: 'u1' })
        expect(login2.user).include({ userid: 'p1', username: 'u1' })
        expect(login3.user).include({ userid: 'p1', username: 'u1' })
    })

    it('should not login with wrong name and pass', async function() {
        await expect(service.loginByPwd('u1', 'wrongpass')).to.be.rejectedWith(
            UsernameOrPasswordWrongException,
        )
        await expect(service.loginByPwd('12312341235', 'pass')).to.be.rejectedWith(
            UsernameOrPasswordWrongException,
        )
    })

    it('should register new user correctly', async () => {
        await expect(controller.reg({ username: '123' } as any)).to.be.rejectedWith(
            BadRequestException,
        )

        const phone = '18888888888'

        const data: any = Object.assign(new RegDto(), {
            username: 'u1',
            password: 'pass1',
            phone,
            code: 'vf',
        })

        await expect(controller.reg(data)).to.be.rejectedWith(ConflictException)
        data.username = 'up'
        await expect(controller.reg(data)).to.be.eventually.be.a('object')
    })
})
