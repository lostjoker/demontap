/**
 * 恶魔点击
 */
namespace dtap {
    // 一些杂项

    /**
     * 等待一段时间,promise封装的setTimeout
     */
    export function waitTime(milliseconds: number): Promise<void> {
        return new Promise(resolve => {
            setTimeout(resolve, milliseconds)
        })
    }

    /**
     * 生成一个[min, max]区间内的随机整数
     */
    export function randInt(min: number, max: number): number {
        return Math.floor(min + Math.random() * (max - min + 1))
    }

    /**
     * 复制文本到剪切板,仅限web平台
     * @param text 待复制文本
     */
    export function copyText(text: string) {
        const el = document.createElement('textarea')

        el.value = text

        // Prevent keyboard from showing on mobile
        el.setAttribute('readonly', '')

        // tslint:disable-next-line:no-string-literal
        el.style['contain'] = 'strict'
        el.style.position = 'absolute'
        el.style.left = '-9999px'
        el.style.fontSize = '12pt' // Prevent zooming on iOS

        const selection = getSelection()
        let originalRange: any = false
        if (selection.rangeCount > 0) {
            originalRange = selection.getRangeAt(0)
        }

        document.body.appendChild(el)
        el.select()

        // Explicit selection workaround for iOS
        el.selectionStart = 0
        el.selectionEnd = text.length

        let success = false
        try {
            success = document.execCommand('copy')
        } catch (err) {
            console.log(err)
        }

        document.body.removeChild(el)

        if (originalRange) {
            selection.removeAllRanges()
            selection.addRange(originalRange)
        }

        return success
    }
}
