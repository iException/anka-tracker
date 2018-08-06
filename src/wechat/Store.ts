import * as wechat  from './utils'
import { Store } from '../core/Store'
import { Inilialzer } from '../core/Initializer'

const STORAGE_KEY = 'tracker_tasks'

export class WeChatStore implements Store {
    data: any[]
    config: Inilialzer

    constructor (config: Inilialzer) {
        this.data = []
        this.config = config
    }

    get (): Promise<any> {
        return wechat.getStorage(STORAGE_KEY)
            .then(data => Promise.resolve(data))
            .catch(err => Promise.resolve([]))
    }

    update (data: any[]): Promise<any> {
        this.data = data
        return wechat.setStorage({
            key: STORAGE_KEY,
            data
        })
    }
}