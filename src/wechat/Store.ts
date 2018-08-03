import { Store } from '../core/Store'
import * as wechat  from './utils'

const STORAGE_KEY = 'tracker_tasks'

export class WeChatStore implements Store {
    data: any[]
    config: InilialzeConfig

    constructor (config: InilialzeConfig) {
        this.data = []
        this.config = config
    }

    get (): Promise<any> {
        return wechat.getStorage({
            key: STORAGE_KEY
        })
    }

    update (data: any[]): Promise<any> {
        this.data = data
        return wechat.setStorage({
            key: STORAGE_KEY,
            data
        })
    }
}