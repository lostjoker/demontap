import { BaseEntity, CreateDateColumn, Index, UpdateDateColumn } from 'typeorm'

export default class TimedEntity extends BaseEntity {
    @Index()
    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date

    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date
}
