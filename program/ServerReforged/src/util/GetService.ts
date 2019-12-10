import { Type } from '@nestjs/common'
import { App } from '../app/app'

export function getService<TInput>(
    typeOrToken: Type<TInput>,
    options?: {
        strict: boolean
    },
): TInput {
    return App.app.get(typeOrToken, options)
}
