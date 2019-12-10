/**
 *
 * @author SeASon
 * 常量
 */
class Const {

    static VERSION: string = '0.10'

    /**
     * IOS最新版本build号，用于强制更新判断，大于才会强制更新，一些不用强制更新跳转的可以小于等于
     */
    static IOS_LATEST_BUILD_VERSION: number = 60

    // 发布前改0，一切变量切换
    static DEBUG_NOW: number = 1
//    static DEBUG_NOW: number = 0;

    // 自刷新后初次加载进站
    static FIRSTLOAD: boolean = true

    // 终断类型名
    static TERMINAL_NAME = {
        WEB: 'Web',
        ANDROID: 'Android',
        IOS: 'Ios',
        NATIVE: 'Native'
    }

    // 终端类型码
    static TERMINAL_CODE = {
         PC:1,
         MOBILE_BROWSER:2,
         MOBILE_APP:3,
         WECHAT:4,
         WECHAT_PC:5
    }

    // 当前使用的终端
    static NOW_USE = Const.TERMINAL_CODE.PC

    // apk下载地址
    static URL = {
        DOWNLOAD_APK: 'https://www.taptap.com/app/46628',
        // 邀请页面，必须带#
        URL_INVITE: 'http://www.avalonol.com/invite.html#',
        // qq群加入地址
        URL_QQGROUP: '//shang.qq.com/wpa/qunwpa?idkey=e62e06f4bdf4dcbb4ea45ab82f96c56ce1c585e379afb757f0328cc1326b227a'
    }

    // cookies常量名
    static COOKIES = {
        AUTHFROM:'authfrom',
        AUTH_USERID:'auth_userid',
        MYNAME:'myname',
        MYPWD:'mypwd',
        MOBILE:'mobile',
        VERSION:'version',
        SKIN:'skin'// 默认游戏皮肤
    }

    // 某次刷新后，第一次进入游戏，防止无限断线重联的自动登录造成诡异bug
    static FIRSTLOGIN: boolean = true

    // 游戏阶段常量，用以标识逻辑跳转
    static GAME_STAGE = {
        WAITING_SERVER: {
            CODE:0,
            CN:'服务器响应',
            COLOR:0xdddddd
        }
    }

    // 计时器延迟保留值，防止玩家感受到客户端时间明明还未结束却被中断的糟糕体验
    static STAGE_TIME_LAG = 1000

    static GAME_COLOR = {
        WHITE: 0xffffff,
        BLACK: 0x000000,
        GRAY: 0x999999,
        DARK_GRAY: 0x666666,
        GREEN: 0x00C73B,
        GRASSGREEN: 0x9BE194,
        YELLOW: 0xDC9D00,
        GAME_MSG:0xffffff,
        TIME_ENOUGH:0x9BE194,
        RANK1: 0xff7c24,
        RANK2: 0xffb362,
        RANK3: 0xffc88e
    }

    // 一次性最大聊天长度
    static PLAYER_CHAT_MAX_LENGTH = 250

    // 玩家名最大长度
    static PLAYERNAME_LENGTH_MAX = 20

    // 玩家名最大长度改善缩短
    static PLAYERNAME_LENGTH_MAX_NEW = 12

    // 最小密码长度
    static PLAYERPWD_LENGTH_MIN = 6

    static PLAYERPWD_LENGTH_MAX = 15

    static ZINDEX = {
        GAME_CARD: 50,
        GAME_FASTWORD: 100,
        PLAYER_DETAIL: 200,
        PLAYER_DETAILMORE : 201,
        DARK: 300,
        QRCODE:1000,
        TOSHOW:1000,
        EFFECT_TAP:100,
        EFFECT_SKILL:1000,
        EFFECT_SCATTER:50,
        MAIN_MENU:80,
    }

    /**
     * 计时器周期枚举
     */
    static TIMER_INTERVAL = {
        // 同步频率
        SYN_CIRCLE:10000,
        // 游戏时间计时器间隔
        GAME_TIMER: 100,
        // 读秒
        SECOND:1000,
        // 读n秒
        SECOND_3:3000,
        // 分钟
        MINUTE:60000,
        // 速度基础参数
        SPEED_BASE:1000,
        // cookie存值过期时间，单位秒
        COOKIE_EXPIRE:60 * 60 * 24 * 7,
        // 滚动tips间隔
        ROLLTIPS_CD:5000
    }

    // 聊天间隔
    static CHAT_HOLD_CD: number = 5000

    // 频繁的请求操作间隔
    static OPERATE_HOLD_TIME: number = 1000

    // 大厅内滚动提示间隔
    static ROLLTIPS_INLOBBY_CD: number = 4000

    // 因输入法弹出上浮整个界面的延迟
    static UP_UI_DELAY: number = 400

    // 提示帮助信息的等级
    static NEWBIETIPSLEVEL: number = 2

    // 连续多少屏蔽字在一句话会被踢下线的判断
    static BANNEDWORD_TIMES: number = 1

    // 禁言时间长短
    static BANNEDWORD_GAG_TIME: number = 15000

    // 禁言时间结束点，大于该值才可以说话
    static BANNEDWORD_GAG_ENDTIME: number = 0

    // 最大时间箱数量
    static MAX_CHEST_COUNT: number = 9

    // 默认hint滞留时间
    static HINT_TIME = {
        DEFAULT:200,
        INTOSTAGE:1500
    }

}
