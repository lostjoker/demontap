import { Injectable } from '@nestjs/common'
import User from '../../models/User'
import PushMessage from '../../models/PushMessage'
import moment from 'moment'
import { Raw } from 'typeorm'
import log4js from 'log4js'

@Injectable()
export default class PushService {
    private readonly logger = log4js.getLogger(this.constructor.name)

    async poll(user: User) {
        const res = await PushMessage.find({
            where: {
                toUserId: user.id,
                expireTime: Raw(alias => `${alias} > NOW()`),
            },
        })

        for (const msg of res) {
            this.logger.debug(msg)
            await msg.remove()
        }

        return res.map(it => it.content)
    }

    async push(user: User, content: object) {
        await PushMessage.delete({ expireTime: Raw(alias => `${alias} < NOW()`) })

        const msg = new PushMessage()

        msg.toUserId = user.id
        msg.content = content
        msg.expireTime = moment()
            .add(5, 'minutes')
            .toDate()

        return msg.save()
    }
}
