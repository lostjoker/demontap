/**
 *
 * @author SeASon
 * 竖版独立的登录界面
 *
 */
class GameTown extends eui.Component {
    public static STATUE = {
        LOGIN: 'login',
        REGAUTH: 'regauth',
        REG: 'reg',
    }

    // public pfc:PlayerFaceCard;
    // public cb_sex:eui.CheckBox;
    public et_name: eui.EditableText
    public et_pwd: eui.EditableText
    public et_phone: eui.EditableText
    public et_code: eui.EditableText
    public btn_readylogin: eui.Button
    public btn_readyreg: eui.Button
    public btn_return: eui.Button
    // public btn_loginwx: eui.Button;
    // public btn_loginqq: eui.Button;
    // public btn_regnormal: eui.Button;
    public btn_reg: eui.Button
    public btn_getcode: eui.Button
    public dialog_noticeboard: DialogNoticeBoard
    private codeTime: number = 0
    private codeTimer: number = -1
    private bb: BlockBoard

    private oldPlayer = null
    private oldToken = null

    public constructor(oldPlayer = null, oldToken = null) {
        super()
        this.skinName = 'gameTown'
        this.oldPlayer = oldPlayer
        this.oldToken = oldToken
    }

    /**
     * 客户端发起登录
     */
    @tapListener('btn_readylogin')
    public async readyLogin() {
        const vaildresult = Tools.PlayerNameValid(this.et_name.text)
        if (!vaildresult.valid) {
            Tools.Hint(vaildresult.msg, this)
            return
        }
        this.bb.show()

        const res = await NetWork.request('user/login', {
            username: this.et_name.text,
            password: this.et_pwd.text,
            // phone: this.et_phone.text,
            // code: this.et_code.text,
            oldPlayer: this.oldPlayer,
            token: this.oldToken,
        })

        if (res.ok) {
            const { player, token, offlineData } = res.data

            await DemonStorage.DemonKV.put('token', token)

            Player.me = new Player(player)
            Player.token = token

            await DemonStorage.DemonKV.put('player', player)

            // 跳转到Game
            Main.Stage.removeChild(this)
            Main.Stage.addChild(new GameUI(offlineData))
        } else {
            this.bb.hide()
            this.oldToken = null // 登录失败后改为以用户名密码登录，不再以token登录
            Tools.Hint(res.msg, this)
        }
    }

    /**
     * 客户端发起普通注册
     */
    @tapListener('btn_readyreg')
    public async readyReg() {
        if (this.currentState === GameTown.STATUE.REG) {
            let vaildresult = Tools.PlayerNameValid(this.et_name.text)
            if (!vaildresult.valid) {
                Tools.Hint(vaildresult.msg, this)
                return
            }
            vaildresult = Tools.PlayerPwdValid(this.et_pwd.text)
            if (!vaildresult.valid) {
                Tools.Hint(vaildresult.msg, this)
                return
            }

            // // DEBUG模式下不验证手机号和验证码
            // if (!Const.DEBUG_NOW) {
            //     const reg_phone = /^\+?[0-9]+$/
            //     if (!reg_phone.test(this.et_phone.text)) {
            //         Tools.Hint(Lang.TEXT.ERR_REG_PHONE, this)
            //         return
            //     }
            //     const reg_code = /^\d\d\d\d$/
            //     if (!reg_code.test(this.et_code.text)) {
            //         Tools.Hint(Lang.TEXT.ERR_REG_CODE, this)
            //         return
            //     }
            // }

            this.bb.show()

            const res = await NetWork.request('user/reg', {
                username: this.et_name.text,
                password: this.et_pwd.text,
                phone: this.et_phone.text,
                code: this.et_code.text,
            })

            if (res.ok) {
                const { player, token } = res.data

                await DemonStorage.DemonKV.put('token', token)

                Player.me = new Player(player)
                Player.token = token

                await DemonStorage.DemonKV.put('player', player)

                // 跳转到Game
                Main.Stage.removeChild(this)
                Main.Stage.addChild(new GameUI())
            } else {
                this.bb.hide()
                Tools.Hint(res.msg, this)
            }

            return
        }
        // if (this.currentState == GameTown.STATUE.REGAUTH) {
        //     let vaildresult = Tools.PlayerNameValid(this.et_name.text);
        //     if (!vaildresult["vaild"]) {
        //         Tools.Hint(vaildresult["msg"], this);
        //         return;
        //     }
        //     this.bb.show();
        //     this.net.socket.emit("C_wantReg",{
        //         name: this.et_name.text,
        //         face: this.me.face,
        //         authfrom: this.me.authdata.platform,
        //         auth_userid: this.me.authdata.userid,
        //         auth_username: this.me.authdata.username,
        //         auth_gender: this.me.authdata.gender,
        //         auth_icon: this.me.authdata.icon
        //     });
        //     return;
        // }
    }

    /**
     * 请求验证码
     */
    @tapListener('btn_getcode')
    public getcode() {
        const reg_phone = /^\+?[0-9]+$/
        if (!reg_phone.test(this.et_phone.text)) {
            Tools.Hint(Lang.TEXT.ERR_REG_PHONE, this)
            return
        }

        // this.net.socket.emit("C_requestCode",{
        //     phone: this.et_phone.text,
        // });

        this.btn_getcode.enabled = false
        this.btn_getcode.label = '稍  候'
        Tools.Hint(Lang.TEXT.MSG_PHONECODE_SENT, this)
        const self = this

        self.codeTime = 61
        self.codeTimer = setInterval(() => {
            if (self.codeTime <= 0) {
                clearInterval(self.codeTimer)
                self.btn_getcode.enabled = true
                self.btn_getcode.label = '验  证'
            } else {
                self.codeTime--
                self.btn_getcode.enabled = false
                self.btn_getcode.label = self.codeTime + ''
            }
        }, Const.TIMER_INTERVAL.SECOND)
    }

    /**
     * 获取微信授权信息
     */
    public wantAuthWX(): void {
        if (egret.RuntimeType.NATIVE === egret.Capabilities.runtimeType) {
            // native中没有window！
            return
        }

        this.bb.show()
    }

    /**
     * 获取qq授权信息
     */
    public wantAuthQQ(): void {
        if (egret.RuntimeType.NATIVE === egret.Capabilities.runtimeType) {
            // native中没有window！
            return
        }

        this.bb.show()
    }

    public readyAuthLogin(): void {
        this.bb.show()
        // this.net.socket.emit("C_login",{
        //     name: this.me.name,
        //     pwd: this.me.pwd,
        //     authfrom: this.me.authdata.platform,
        //     auth_userid: this.me.authdata.userid
        // });
    }

    /**
     * 提交注册信息
     */
    public wantAuthReg(): void {
        const vaildresult = Tools.PlayerNameValid(this.et_name.text)
        if (!vaildresult.valid) {
            Tools.Hint(vaildresult.msg, this)
            return
        }
        this.bb.show()
        // this.net.socket.emit("C_wantReg",{
        //     name: this.et_name.text,
        //     face: this.me.face,
        //     authfrom: this.me.authdata.platform,
        //     auth_userid: this.me.authdata.userid,
        //     auth_username: this.me.authdata.username,
        //     auth_gender: this.me.authdata.gender,
        //     auth_icon: this.me.authdata.icon
        // });
    }

    public updateClientSupport() {
        // this.btn_loginqq.visible = Authorize.supportQQ && !this.me.isreg;
        // this.btn_loginwx.visible = Authorize.supportWX && !this.me.isreg;
    }

    /**
     * 转到登录
     */
    @tapListener('btn_return')
    public changeToLogin(): void {
        this.currentState = GameTown.STATUE.LOGIN
    }

    /**
     * 转到普通注册
     */
    @tapListener('btn_reg')
    public changeToRegNormal(): void {
        this.currentState = GameTown.STATUE.REG
        //        this.randPlayerFace();
    }

    public changeToRegAuth(): void {
        this.currentState = GameTown.STATUE.REGAUTH
        //        this.randPlayerFace();
    }

    protected createChildren(): void {
        super.createChildren()
        this.bb = new BlockBoard()
        this.bb.horizontalCenter = 0
        this.bb.verticalCenter = 0
        this.addChild(this.bb)

        // 关闭蒙板
        this.bb.hide()

        // if (Tools.GetCookie(Const.COOKIES.VERSION) != Const.VERSION) {
        //     //公告板
        //     this.dialog_noticeboard = new DialogNoticeBoard(this);
        //     this.addChild(this.dialog_noticeboard);
        //     this.dialog_noticeboard.show();
        //     Tools.SetCookie(Const.COOKIES.VERSION, Const.VERSION, Const.COOKIE_EXPIRE * 100);
        // }

        this.currentState = GameTown.STATUE.LOGIN

        if (this.oldPlayer && this.oldPlayer.name) {
            this.et_name.text = this.oldPlayer.name
            if (this.oldToken) {
                this.readyLogin().then()
            }
        }
    }
}
