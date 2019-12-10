import { App } from '../app'
import GamedataService from '../services/core/GamedataService'

export default class ShopItem {
    public id: number = 0
    public count: number = 1
    public sold: boolean = false

    constructor(id: number, count: number, sold: boolean) {
        this.id = id
        this.count = count
        this.sold = sold
    }

    public get price() {
        return App.app.get(GamedataService).itemData.Item[this.id].gold_cost * this.count
    }

    public get troop() {
        return App.app.get(GamedataService).itemData.Item[this.id].troop
    }
}
