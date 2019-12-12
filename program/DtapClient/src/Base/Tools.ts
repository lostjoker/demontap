/**
 *
 * @author SeASon
 *
 */
class Tools {
    // 控制台检测BUG
    public static DEBUG_SOCKETS_DATA
    public static DEBUG_TABLE_DATA
    public static DEBUG_TABLE_ID
    public static DEBUG_TABLES_DATA
    public static DEBUG_PLAYERS_DATA

    /**
     * 随机整数区间
     */
    public static RandInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    /**
     * 浮出提示
     */
    public static Hint(
        msg: string,
        parent: eui.Component = GameUI.Instance,
        color: number = Const.GAME_COLOR.BLACK,
        time: number = Const.HINT_TIME.DEFAULT,
    ): void {
        const mhc: MsgHintCenter = new MsgHintCenter(color, time)
        parent.addChild(mhc)
        mhc.show(msg)
    }

    /**
     * 浮出提示
     */
    public static HintByLanguage(
        msg: string,
        args: any[] = [],
        parent: eui.Component = GameUI.Instance,
        color: number = Const.GAME_COLOR.BLACK,
        time: number = Const.HINT_TIME.DEFAULT,
    ): void {
        const mhc: MsgHintCenter = new MsgHintCenter(color, time)
        parent.addChild(mhc)
        mhc.show(GameData.getText(msg, ...args))
    }

    /**
     * 输出游戏日志
     */
    public static GameLog(
        gmp: GameMsgPanel,
        fromseat: number,
        msg: string,
        textColor: number,
    ): void {
        gmp.updateGameMsg(fromseat, msg, textColor)
    }

    /**
     * 求最小值
     * @method MinVal
     * @param   {arr}    arr  属性数组
     * @param	{string} attr 数组下的属性名称
     * @return  {number}      返回数组下属性值最小的值
     */
    public static MinVal(arr, attr) {
        const tempArr = []
        for (let i = 0; i < arr.length; i++) {
            tempArr.push(arr[i][attr])
        }
        return tempArr.sort((a, b) => a - b)[0]
    }

    /**
     * 求最大值
     * @method MaxVal
     * @param   {arr}    arr  属性数组
     * @param	{string} attr 数组下的属性名称
     * @return  {number}      返回数组下属性值最大的值
     */
    public static MaxVal(arr, attr) {
        const tempArr = []
        for (let i = 0; i < arr.length; i++) {
            tempArr.push(arr[i][attr])
        }
        return tempArr.sort(function(a, b) {
            return b - a
        })[0]
    }

    /**
     * 获得字节长度
     */
    public static GetByteLength(str: string): number {
        let len: number = 0
        for (let i = 0; i < str.length; ++i) {
            if (str.charCodeAt(i) > 255) {
                len += 1.8
            } else {
                len += 1
            }
        }
        return len
    }

    /**
     * 切割消息长度，拆分为多段，临时解决滚动条无法定位问题
     */
    public static MsgSlice(str: string, maxlen: number = 50, msg: string[] = []): string[] {
        if (Tools.GetByteLength(str) <= maxlen) {
            msg.push(str)
            return msg
        }
        let len: number = 0
        for (let i = 0; i < str.length; ++i) {
            if (str.charCodeAt(i) > 255) {
                len += 1.8 // 雅黑中文字体宽度并不是2个字母
            } else {
                len += 1
            }
            if (len > maxlen) {
                const temp = str.slice(0, i)
                msg.push(temp)
                str = str.slice(i, str.length)
                msg = Tools.MsgSlice(str, maxlen, msg)
                break
            }
        }
        return msg
    }

    /**
     * 滚动信息面板
     */
    public static WheelMsg(sc: eui.Scroller, d: number): void {
        if (!sc) {
            return
        }
        const wheel = d >= 0 ? 30 : -30
        // 向下滚动
        if (sc.viewport.scrollV - wheel >= sc.viewport.contentHeight - sc.viewport.height) {
            sc.viewport.scrollV = sc.viewport.contentHeight - sc.viewport.height
            return
        }
        // 向上滚动
        if (sc.viewport.scrollV - wheel <= 0) {
            sc.viewport.scrollV = 0
            return
        }
        sc.viewport.scrollV -= wheel
    }

    /**
     * 等同于JS的toGMTString
     * timediff为GMT时差，小时
     */
    public static GetJSGMT(date: Date, timediff: number): string {
        // "Wed, 20 Jul 1983 17:15:00 GMT";//
        let gmt: string = ''
        date.setHours(date.getHours() + timediff)
        switch (date.getDay()) {
            case 0:
                gmt += 'Sun'
                break
            case 1:
                gmt += 'Mon'
                break
            case 2:
                gmt += 'Tue'
                break
            case 3:
                gmt += 'Wed'
                break
            case 4:
                gmt += 'Thu'
                break
            case 5:
                gmt += 'Fri'
                break
            case 6:
                gmt += 'Sat'
                break
            default:
                gmt += 'Sun'
                break
        }
        gmt += ', '
        gmt += date.getDate()
        gmt += ' '
        switch (date.getMonth()) {
            case 0:
                gmt += 'Jan'
                break
            case 1:
                gmt += 'Feb'
                break
            case 2:
                gmt += 'Mar'
                break
            case 3:
                gmt += 'Apr'
                break
            case 4:
                gmt += 'May'
                break
            case 5:
                gmt += 'Jun'
                break
            case 6:
                gmt += 'Jul'
                break
            case 7:
                gmt += 'Aug'
                break
            case 8:
                gmt += 'Sep'
                break
            case 9:
                gmt += 'Oct'
                break
            case 10:
                gmt += 'Nov'
                break
            case 11:
                gmt += 'Dec'
                break
            default:
                gmt += 'Sun'
                break
        }
        gmt += ' '
        gmt += date.getFullYear()
        gmt += ' '
        gmt = gmt + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
        gmt += ' '
        gmt += 'GMT'
        return gmt
    }

    /**
     * 转化date字符串yyyymmddhhmmss
     */
    public static GetDateFormat(date: Date): string {
        let timestr: string = ''
        timestr += date.getFullYear()
        timestr += date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        timestr += date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        timestr += date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        timestr += date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        timestr += date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        return timestr
    }

    /**
     * 替换禁用词汇
     */
    public static ReplaceBanWord(banlist: string[], txt: string, bannedcount: number = 0): any[] {
        let result: string = txt
        const replaceword: string = 'Biu~'
        for (let i = 0; i < banlist.length; ++i) {
            const reg = new RegExp(banlist[i], 'gi')
            result = result.replace(reg, replaceword)
        }
        const reg_replacecount = new RegExp(replaceword, 'g')
        const arr_count = result.match(reg_replacecount)
        if (arr_count) {
            return [result, arr_count.length]
        }
        return [result, 0]
    }

    /**
     * 禁言操作和判断
     */
    public static IfGag(msg: string, comp: eui.Component): boolean {
        if (new Date().getTime() < Const.BANNEDWORD_GAG_ENDTIME) {
            Tools.Hint(
                Lang.TEXT.CHAT_REFUSE_BANNEDWORD_INTIME +
                    '(' +
                    (
                        (Const.BANNEDWORD_GAG_ENDTIME - new Date().getTime()) /
                        Const.TIMER_INTERVAL.SECOND
                    ).toFixed(0) +
                    ')',
                comp,
            )
            return true
        }
        const wordcheck: any[] = Tools.ReplaceBanWord(Lang.BANNEDWORD, msg)
        if (parseInt(wordcheck[1].toString()) > Const.BANNEDWORD_TIMES) {
            Tools.Hint(Lang.TEXT.CHAT_REFUSE_BANNEDWORD, comp)
            Const.BANNEDWORD_GAG_ENDTIME = new Date().getTime() + Const.BANNEDWORD_GAG_TIME
            return true
        }
        return false
    }

    /**
     * 通用：验证玩家名合法
     */
    public static PlayerNameValid(
        str: string,
        vaildnamelength: boolean = true,
    ): { valid: boolean; msg: string } {
        if (Const.DEBUG_NOW) {
            return { valid: true, msg: '' }
        }
        if (str.length <= 0) {
            return { valid: false, msg: Lang.TEXT.VAILD_PLAYERNAME_TOOSHORT }
        }
        if (Tools.GetByteLength(str) > Const.PLAYERNAME_LENGTH_MAX) {
            return { valid: false, msg: Lang.TEXT.VAILD_PLAYERNAME_TOOLONG }
        }
        const regx = /^[\u4E00-\u9FA5A-Za-z0-9]+$/
        if (!regx.test(str)) {
            return { valid: false, msg: Lang.TEXT.VAILD_PLAYERNAME_LIMIT }
        }
        for (let i = 0; i < Lang.BANNEDWORD.length; ++i) {
            if (str.toLowerCase().indexOf(Lang.BANNEDWORD[i].toLowerCase()) !== -1) {
                return { valid: false, msg: Lang.TEXT.VAILD_PLAYERNAME_BANNED }
            }
        }
        return { valid: true, msg: '' }
    }

    /**
     * 通用：验证密码合法
     */
    public static PlayerPwdValid(str: string): { valid: boolean; msg: string } {
        if (Const.DEBUG_NOW) {
            return { valid: true, msg: '' }
        }
        if (str.length < Const.PLAYERPWD_LENGTH_MIN) {
            return { valid: false, msg: Lang.TEXT.VAILD_PLAYERPWD_TOOSHORT }
        }
        if (str.length > Const.PLAYERPWD_LENGTH_MAX) {
            return { valid: false, msg: Lang.TEXT.VAILD_PLAYERPWD_TOOLONG }
        }
        const regx = /^[A-Za-z0-9]+$/
        if (!regx.test(str)) {
            return { valid: false, msg: Lang.TEXT.VAILD_PLAYERPWD_LIMIT }
        }
        return { valid: true, msg: '' }
    }

    /**
     * 转化数字的显示方式
     */
    public static C_Num(num: number): string {
        if (num >= Math.pow(1000, 5)) {
            // let alphabet:string[] = [
            //     "A","B","C","D","E",
            //     "F","G","H","I","J",
            //     "K","L","M","N","O",
            //     "P","Q","R","S","T",
            //     "U","V","W","X","Y",
            //     "Z"];
            // AA -> BB -> AAA -> ZZZ
            let result: string = null
            // let i:number = 5;
            // while(num >= Math.pow(1000,i + 1)){
            //     ++i;
            //     continue;
            // };
            // let idx:number = i - 5;//起始索引
            // let circle = Math.floor(idx / 26);//字母表循环次数
            // let letter = alphabet[idx - circle * 26];
            // let unit = letter;//默认有两位，先赋值1位
            // for(let j = 0; j < circle + 1; ++j){//默认有两位，循环+1
            //     unit += letter;
            // }
            let i: number = 15
            while (num >= Math.pow(10, i + 1)) {
                ++i
                continue
            }
            result = (num / Math.pow(10, i)).toFixed(2) + 'e' + i
            return result
        }
        if (num >= Math.pow(1000, 4)) {
            return (num / Math.pow(1000, 4)).toFixed(2) + 'T'
        }
        if (num >= Math.pow(1000, 3)) {
            return (num / Math.pow(1000, 3)).toFixed(2) + 'B'
        }
        if (num >= Math.pow(1000, 2)) {
            return (num / Math.pow(1000, 2)).toFixed(2) + 'M'
        }
        if (num >= Math.pow(1000, 1)) {
            return (num / Math.pow(1000, 1)).toFixed(2) + 'K'
        }
        return Math.floor(num) + ''
        // return num.toFixed(2)
    }

    /**
     * 计算比率
     */
    public static CalcRate(a: number, b: number): string {
        if (b) {
            return ((a / b) * 100).toFixed(0) + '%'
        }
        return '0%'
    }

    /**
     * 获得阿里云cdn资源
     */
    public static GetCDNRes(key: string): string {
        return `https://avalonol.oss-cn-shanghai.aliyuncs.com/${key}`
    }

    /**
     * 获取经过缩略的阿里云自定义头像资源
     */
    public static GetAvatar(key: string, w: number = 150, h: number = 150): string {
        return Tools.GetCDNRes(key) + '?x-oss-process=image/resize,w_' + w + ',h_' + h
    }
}
