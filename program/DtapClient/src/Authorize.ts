/**
 *
 * @author 
 *
 */
namespace Authorize {
    
    /**
     * 授权渠道
     */ 
    export var FROM = {
        WX:"Wechat",
        QQ:"QQ",
        NORMAL:"normal"
    }

	/**
	 * 第三方登录授权信息
	 */
	interface AuthData {
		/**
		 * 渠道名
		 */
        platform: string;

		/**
		 * 用户在渠道的唯一ID
		 */
        userid: string;

		/**
		 * 用户名
		 */
		username: string;

		/**
		 * 性别
		 */
		gender: string;

		/**
		 * 头像
		 */
		icon: string;
	}
	
	/**
	 * 授权成功，更新信息
	 */
	export function onAuthOK(data: AuthData) {
        // gameui.me.authdata.platform = data.platform;
        // gameui.me.authdata.userid = data.userid;
        // gameui.me.authdata.username = data.username;
        // gameui.me.authdata.gender = data.gender;
        // gameui.me.authdata.icon = data.icon;
        // gameui.bb.hide();
	}

	/**
	 * 授权登录失败，错误，中断或者被用户取消
	 */
    export function onAuthFail() {
        // gameui.bb.hide();
        // Tools.Hint(Lang.TEXT.MSG_AUTH_FAIL, gameui);
	}

	// /**
	//  * 判断页面是否运行于ios客户端中。
	//  */
	// export function isIOSClient() : boolean {
	// 	return typeof(window) !== "undefined"
    //              && typeof(window.webkit) !== "undefined"
    //              && typeof(window.webkit.messageHandlers) !== "undefined"
    //              && typeof(window.webkit.messageHandlers.iosClient) !== "undefined";
	// }

	// /**
	//  * 判断页面是否运行于ios客户端中。
	//  */
	// export function isAndroidClient() : boolean {
	// 	return typeof (AndroidClient) !== "undefined";
	// }

	export let ios_ver:number = 0;
	export let iosVersionName:string = "1.0";
	export let iosVersionCode:number = 1;

	/**
	 * 供ios调用，以便web端得知ios版本
	 */
	export function ios(version: number) {
		ios_ver = version;
	}

	/**
	 * 供ios调用，以便web端得知ios应用版本
	 */
	export function iosVer(versionName: string, versionCode: number) {
		iosVersionName = versionName;
		iosVersionCode = versionCode;

		if(iosVersionCode < Const.IOS_LATEST_BUILD_VERSION) {
            // if(gameui instanceof GameLobby) {
            //     (<GameLobby>gameui).updateAppStore();
			// 	return;
			// }
		}
	}

	export let supportQQ = true;
	export let supportWX = true;

	/**
	 * 供ios调用，以便web端得知客户端支持的第三方登录
	 */
	export function clientSupport(wechat: boolean, qq:boolean) {
		supportQQ = qq;
		supportWX = wechat;
	}

	/**
	 * 供iOS的IAP支付回调。
	 * @param receipt BASE64编码后的receipt数据。
	 */
	export function onIAP(receipt: string) {
		// console.log("onIAP!");
		// console.log(receipt);
		// gameui.net.socket.emit("C_rewardIAP", {receipt});
	}
}
	