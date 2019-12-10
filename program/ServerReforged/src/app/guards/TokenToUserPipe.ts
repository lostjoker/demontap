import { ArgumentMetadata, Injectable, PipeTransform, UnauthorizedException } from '@nestjs/common'
import User from '../models/User'
import { UserService } from '../services/modules/UserService'
import { getService } from '../../util/GetService'

type valueType = string | { token: string; user: any }

@Injectable()
export class TokenToUserPipe implements PipeTransform {
    async transform(value: valueType, metadata: ArgumentMetadata): Promise<User | { user: User }> {
        let loginToken: string
        if (typeof value === 'string') {
            loginToken = value
        } else if (typeof value === 'object') {
            loginToken = value.token
        }

        const res = await User.loginTokens.verify(loginToken)

        if (res) {
            const user = await getService(UserService).getByUserid(res.id)

            if (typeof value === 'string') {
                return user
            } else if (typeof value === 'object') {
                value.user = user
                return value
            }
        }

        throw new UnauthorizedException('请重新登录')
    }
}
