/* tslint:disable:variable-name */

/**
 *
 * @author SeASon`
 * 网络通信层
 *
 */
namespace NetWork {
    const baseUrl = Config.SERVER_ADDR

    type RespType<T = any> =
        | {
              ok: true
              data: T
              code: StatusCode.SUCC
              msg?: never
          }
        | {
              ok: false
              code: StatusCode
              msg: string
              data?: never
          }

    export enum StatusCode {
        SUCC = 0,

        EXPIRE = 401,
        INTERNAL_SERVER_ERROR = 500,
        TIMEOUT = 504,
        UNKNOWN_ERROR = 599,
    }

    /**
     * 当前是否为在线。
     */
    export function isOnline(): boolean {
        return true
    }

    let _init = false

    /**
     * 初始化网络接口
     */
    export function init() {
        if (_init) return
        _init = true

        // socket = new WebSocketClient()
        //
        // egret.startTick(now => {
        //     for (const reqID in _requests) {
        //         const req = _requests[reqID]
        //         if (req.timeout > 0 && now - req.time > req.timeout) {
        //             const result: ServerMessage = {
        //                 msg: '网络超时',
        //                 code: StatusCode.TIMEOUT,
        //                 requestID: reqID as any,
        //             }
        //             _requests[reqID].resolve.call(_requests[reqID].promise, result)
        //             delete _requests[reqID]
        //         }
        //     }
        //
        //     return false
        // }, this)
        //
        // socket.on('S_response', (resp: ServerMessage) => {
        //     dtap.verbose(`response got`)
        //
        //     resp.code = StatusCode.SUCC
        //
        //     if (resp.requestID) {
        //         dtap.verbose(`response got for ${resp.requestID}`)
        //         const reqID = resp.requestID
        //         _requests[reqID].resolve.call(_requests[reqID].promise, resp)
        //         delete _requests[reqID]
        //     }
        // })
        //
        // socket.on('S_error', (resp: any) => {
        //     dtap.verbose(`err got`)
        //     if (resp.requestID) {
        //         dtap.verbose(`err got for ${resp.requestID}`)
        //         const reqID = resp.requestID
        //         const result: ServerMessage = {
        //             msg: resp.msg,
        //             code: resp.code || StatusCode.UNKNOWN_ERROR,
        //             requestID: reqID,
        //         }
        //         _requests[reqID].resolve.call(_requests[reqID].promise, result)
        //         delete _requests[reqID]
        //     }
        // })
    }

    // /**
    //  * 向服务端发送数据（不请求回应）
    //  */
    // export function emit(name, data: any = {}) {
    //     if (Player.me) {
    //         data.loginToken = Player.token
    //         data.playerId = Player.me.id
    //     }
    //     socket.emit('C_data', {
    //         name,
    //         msg: data,
    //     })
    // }

    const defaultErrorResponse = {
        ok: false,
        code: StatusCode.UNKNOWN_ERROR,
        msg: '网络错误',
    }

    /**
     * 向服务端请求数据。
     */
    export function request<T = any>(
        name,
        data: any = {},
        showError = false,
        showBB = false,
    ): Promise<RespType<T>> {
        if (showBB) {
            GameUI.Instance.bb.show()
        }

        return axios
            .post(`${baseUrl}/${name}`, data)
            .then(res => {
                if (res.status === 200 || res.status === 201) {
                    // console.log(res)
                    if (!res.data.ok && showError) {
                        Tools.Hint(res.data.msg)
                    }
                    return res.data
                } else {
                    if (showError) {
                        Tools.Hint('网络错误')
                    }
                    return defaultErrorResponse
                }
            })
            .catch(() => {
                if (showError) {
                    Tools.Hint('网络错误')
                }
                return defaultErrorResponse
            })
            .then(res => {
                if (showBB) {
                    GameUI.Instance.bb.hide()
                }
                return res
            })

        // const id = _requestID++
        // dtap.verbose(`requesting ${id} for ${name}`)
        // const promise = new Promise<ServerMessage>((resolve, reject) => {
        //     _requests[id] = {
        //         promise,
        //         resolve,
        //         timeout,
        //         time: egret.getTimer(),
        //     }
        //
        //     const msg = data
        //     data.requestID = id
        //
        //     socket.emit('C_data', {
        //         name,
        //         msg,
        //     })
        // })
        //
        // _requests[id].promise = promise
        // return promise
    }

    /**
     * 向服务端请求数据，带有token参数。
     */
    export function requestWithToken<T = any>(
        name,
        data: any = {},
        showError = false,
        showBB = false,
    ): Promise<RespType<T>> {
        data.token = Player.token
        data.playerId = Player.me.id

        return request(name, data, showError, showBB)
    }

    // class Api<TParam, TResp> {
    // 	reqPath: string;
    // 	constructor(reqPath: string, reqOverride?: Function) {
    // 		this.reqPath = reqPath;
    // 	}
    //
    // 	request(param: TParam): Promise<TResp> {
    // 		return NetWork.request(this.reqPath, param);
    // 	}
    //
    // }
}
