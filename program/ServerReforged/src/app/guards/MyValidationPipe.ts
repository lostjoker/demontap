import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { isNil } from '@nestjs/common/utils/shared.utils'
import * as classTransformer from 'class-transformer'
import * as classValidator from 'class-validator'
import { Log } from '../../core/Log'

export const TO_VALIDATE: unique symbol = Symbol('mark the class is to validate')

@Injectable()
export class MyValidationPipe implements PipeTransform {
    private readonly logger = new Log('validation')

    public async transform(value: any, metadata: ArgumentMetadata) {
        const { metatype } = metadata
        if (!metatype || !this.toValidate(metadata)) {
            return value
        }
        const entity = classTransformer.plainToClass(metatype, this.toEmptyIfNil(value))
        const errors = await classValidator.validate(entity)
        if (errors.length > 0) {
            errors.forEach(it => this.logger.v(`(${it.property}: ${it.value})${it.toString()}`))
            throw new BadRequestException('数据格式错误')
        }
        return entity
    }

    toEmptyIfNil<T = any, R = any>(value: T): R | {} {
        return isNil(value) ? {} : value
    }

    private toValidate(metadata: ArgumentMetadata): boolean {
        const { metatype, type } = metadata
        if (!metatype[TO_VALIDATE]) return false
        if (type === 'custom') {
            return false
        }
        const types = [String, Boolean, Number, Array, Object]
        return !types.some(t => metatype === t) && !isNil(metatype)
    }
}
