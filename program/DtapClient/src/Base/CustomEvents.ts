// 自定义事件相关内容

/**
 * 恶魔点击
 */
namespace dtap {
    // 玩家被更新事件
    export const EVENT_PLAYER_UPDATED = 'EVENT_PLAYER_UPDATED'
    export class PlayerUpdatedEvent extends egret.Event {
        constructor() {
            super(EVENT_PLAYER_UPDATED)
        }
    }

    // 游戏通知事件
    export const EVENT_GAME_NOTIFICATION = 'EVENT_GAME_NOTIFICATION'
    export class GameNotificationEvent extends egret.Event {
        public static dispatchTo(target: egret.DisplayObject, data: any) {
            target.dispatchEvent(new GameNotificationEvent(data))
        }
        public static dispatchToGameUI(data: any) {
            if (GameUI.Instance) {
                this.dispatchTo(GameUI.Instance, data)
            }
        }
        data: any
        constructor(data = null) {
            super(EVENT_PLAYER_UPDATED)
            this.data = data
        }
    }
}
