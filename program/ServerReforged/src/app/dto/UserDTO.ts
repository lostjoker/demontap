/* tslint:disable:max-classes-per-file */

import { IsEmail, IsMobilePhone, IsNotEmpty, IsString, Length, NotContains } from 'class-validator'
import { lockingField } from '../services/util/AwaitLock'
import { TO_VALIDATE } from '../guards/MyValidationPipe'
import Player from '../game/Player'

export class LoginDto {
    readonly username?: string
    readonly password?: string
    // readonly phone?: string
    // readonly code?: string

    readonly token?: string
    readonly oldPlayer?: Player
}

export class RegDto {
    static readonly [TO_VALIDATE] = true

    @Length(1, 20)
    @NotContains('@')
    @lockingField()
    readonly username: string

    @IsString()
    readonly password: string

    // @IsEmail({allow_display_name: false})
    // @lockingField()
    // readonly email: string
    //
    // @IsMobilePhone('zh-CN')
    // @lockingField()
    // readonly phone: string
    //
    // @IsNotEmpty()
    // readonly code: string
}
