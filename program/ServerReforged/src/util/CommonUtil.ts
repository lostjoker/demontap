/**
 * 安全尝试将字符串转换为整数类型，转换失败则转换为缺省值
 * @param target 要转换的字符串
 * @param defaultValue 缺省值
 */
export function safeParseInt(target: string, defaultValue: number = 0): number {
    try {
        const value = parseInt(target, 10)
        if (isNaN(value)) {
            return defaultValue
        }
        return value
    } catch (e) {
        return defaultValue
    }
}

/**
 * 尝试将值转换为布尔类型
 * @param value 要转换的值
 */
export function parseBool(value: any): boolean {
    if (typeof value === 'boolean') return value

    if (typeof value === 'number') return value > 0

    if (typeof value === 'string') {
        return ['true', 'yes', 'enabled'].includes(value.toLowerCase())
    }

    return false
}

/**
 * 生成一个[min, max]区间内的随机整数
 */
export function randInt(min: number, max: number): number {
    return Math.floor(min + Math.random() * (max - min + 1))
}
