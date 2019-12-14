import TimedEntity from '../../core/TimedEntity'
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export default class PushMessage extends TimedEntity {
    /**
     * 自增ID
     */
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number

    @Column({ default: 0 })
    type: number

    @Index()
    @Column()
    toUserId: number

    @Column('json')
    content: object

    @Column('datetime')
    expireTime: Date
}
