import * as jwt from 'jsonwebtoken'
import GmudException from './GmudException'

export default class TokenManager<PayloadType extends object> {
    readonly secretKey: string
    readonly expiresIn: string | number

    constructor(secretKey: string, expiresIn: string | number = '2 days') {
        this.secretKey = secretKey
        this.expiresIn = expiresIn
    }

    generate(payload: PayloadType): string {
        return jwt.sign(payload as any, this.secretKey, {
            expiresIn: this.expiresIn,
        })
    }

    verify(token: string): (PayloadType & JwtBasic) | null {
        try {
            return jwt.verify(token, this.secretKey) as any
        } catch (e) {
            throw new GmudException('请重新登录！')
        }
    }
}

export interface JwtBasic {
    // 时间戳
    iat?: number

    nbf?: number

    // 过期时间
    exp?: number
}
