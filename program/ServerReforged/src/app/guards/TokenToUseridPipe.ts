import { ArgumentMetadata, Injectable, PipeTransform, UnauthorizedException } from '@nestjs/common'
import User from '../models/User'

type UserId = number

@Injectable()
export class TokenToUseridPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata): Promise<UserId | { userid: number }> {
        let loginToken: string
        if (typeof value === 'string') {
            loginToken = value
        } else if (typeof value === 'object') {
            loginToken = value.token
        }

        const res = await User.loginTokens.verify(loginToken)

        if (res) {
            if (typeof value === 'string') {
                return res.id
            } else if (typeof value === 'object') {
                value.userid = res.id
                return value
            }
        }

        throw new UnauthorizedException('请重新登录')
    }
}
