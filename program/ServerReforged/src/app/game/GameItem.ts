import GamedataService from '../services/core/GamedataService'
import { getService } from '../../util/GetService'

/**
 * 商店物品类
 */
export default class GameItem {
    public id: number = 0
    public count: number = 1

    constructor(id: number, count: number) {
        this.id = id
        this.count = count
    }

    public get troop() {
        return getService(GamedataService).itemData.Item[this.id].troop
    }
}
