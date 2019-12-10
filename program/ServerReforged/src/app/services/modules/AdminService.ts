import { Injectable } from '@nestjs/common'
import User from '../../models/User'

@Injectable()
export class AdminService {
    async findUsers(name?: string) {
        let users: User[]
        if (name) {
            users = await User.createQueryBuilder('user')
                .where('user.id = :name', { name })
                .orWhere('user.userid = :name', { name })
                .orWhere('user.username like :name', { name: `${name}%` })
                .orderBy('updatedAt', 'DESC')
                .limit(20)
                .getMany()
        } else {
            users = await User.createQueryBuilder()
                .orderBy('updatedAt', 'DESC')
                .limit(20)
                .getMany()
        }
        return users
    }
}
