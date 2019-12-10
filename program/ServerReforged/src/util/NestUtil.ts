import { Body } from '@nestjs/common'
import { TokenToUseridPipe } from '../app/guards/TokenToUseridPipe'
import { TokenToUserPipe } from '../app/guards/TokenToUserPipe'

export const UseridFromToken = () => Body('token', TokenToUseridPipe)
export const UserFromToken = () => Body('token', TokenToUserPipe)
