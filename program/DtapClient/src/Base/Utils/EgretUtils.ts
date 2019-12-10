// 一些和egret内容相关的工具方法

import is = egret.is

/**
 * 【修饰器】令函数属性监听指定控件的TOUCH_TAP事件。
 * @param controlName 要接受点击事件控件名。
 */
function tapListener(controlName?: string) {
    return eventListener(egret.TouchEvent.TOUCH_TAP, controlName)
}

/**
 * 【修饰器】令函数属性监听指定控件的事件。
 * @param event 事件类型
 * @param controlName 要接受事件控件名。
 */
function eventListener(event: string, controlName?: string) {
    return (target: any, propertyKey: string) => {
        const _createChildren: () => void = target.createChildren
        target.createChildren = function() {
            _createChildren.call(this)
            let control = this as egret.DisplayObject

            if (controlName) {
                const path = controlName.split('/')
                let i = 0

                if (path[0] === '@gameui') {
                    control = GameUI.Instance
                    i++
                }

                while (path[i]) {
                    if (control[path[i]]) {
                        control = control[path[i]]
                        i++
                    } else {
                        dtap.err('不存在的控件：' + controlName)
                        // tslint:disable-next-line:no-debugger
                        if (DEBUG) debugger
                        return
                    }
                }
            }

            if (control) {
                control.addEventListener(event, this[propertyKey], this)

                if (isDisposable(this)) {
                    const _dispose =
                        this.dispose ||
                        (() => {
                            /* nothing */
                        })
                    this.dispose = function() {
                        control.removeEventListener(event, this[propertyKey], this)
                        _dispose.call(this)
                    }
                }
                // const self: egret.DisplayObject = this;
                // self.addEventListener(egret.Event.ADDED_TO_STAGE, () => {
                //     control.addEventListener(event, this[propertyKey], this);
                // }, this);
                // self.addEventListener(egret.Event.REMOVED_FROM_STAGE, () => {
                //     control.addEventListener(event, this[propertyKey], this);
                // }, this);
            } else {
                dtap.err('不存在的控件：' + controlName)
            }
        }
    }
}

/**
 * 【修饰器】创建一个新的egret.Timer，并令被修饰的方法监听其TIMER事件。
 * @param option 计时器选项
 */
function egretTimer(option: {
    /**
     * timer作为成员的名字。
     */
    name: string
    /**
     * 计时器间隔
     */
    delay: number
    /**
     * 重复次数，默认为0即无限重复
     */
    repeatCount?: number
    /**
     * 是否自动开始，默认为否
     */
    autoStart?: boolean
}) {
    option.repeatCount = option.repeatCount || 0

    return (target: any, propertyKey: string) => {
        const _createChildren: () => void = (target as any).createChildren
        target.createChildren = function() {
            _createChildren.call(this)

            const name = option.name

            if (this[name]) {
                dtap.err('创建成员失败：' + name + '已存在')
                return
            }

            const timer = new egret.Timer(option.delay, option.repeatCount)
            timer.addEventListener(egret.TimerEvent.TIMER, this[propertyKey], this)

            this[name] = timer

            if (option.autoStart) {
                timer.start()
            }

            if (isDisposable(this)) {
                const _dispose =
                    this.dispose ||
                    (() => {
                        /* nothing */
                    })
                this.dispose = function() {
                    timer.stop()
                    _dispose.call(this)
                }
            }
        }
    }
}

function byLanguage(key: string = null): PropertyDecorator {
    return (target: any, propertyKey: string) => {
        const _childrenCreated: () => void = target.childrenCreated
        target.childrenCreated = function() {
            _childrenCreated.call(this)
            const label = this[propertyKey] as eui.Label | eui.Button
            const text = GameData.getText(`UI/${key || propertyKey}`)
            if (is(label, 'eui.Label')) {
                const control = label as eui.Label
                control.text = text
            } else if (is(label, 'eui.Button')) {
                const control = label as eui.Button

                if (control.labelDisplay) {
                    control.labelDisplay.text = text
                }

                control.label = text
            } else {
                dtap.err(`not a valid label: ${propertyKey}`)
            }
        }
    }
}

function disposable<T extends new (...args: any[]) => {}>() {
    return (target: T) => {
        const newClass = class extends ((target as any) as FunctionConstructor) {
            __isDisposable = true
        }
        return newClass as any
    }
}

interface Disposable {
    __isDisposable: true
    dispose()
}

function isDisposable(x: any): x is Disposable {
    return typeof x === 'object' && x.__isDisposable === true
}

/**
 * 对话框返回结果，用于Dialog.Show()
 * @see Dialog.Show
 */
enum DialogResult {
    YES,
    NO,
    CANCEL,
}
