import Core from './core/index'
import { Store } from './core/Store'
import { Sender } from './core/Sender'
import {
    WeChatStore,
    WeChatSender
} from './wechat/index'
import { AliPaySender } from './alipay/index'

export default class Tracker {
    private core: Core
    private store: Store
    private sender: Sender

    constructor (config: InilialzeConfig) {
        this.core = new Core(config)
    }

    init (url: string, globalData?: Object) {
        this.sender = new WeChatSender(url, globalData)
        this.store = new WeChatStore()
        this.core.init({
            sender: this.sender,
            store: this.store
        })
    }

    log (data: TrackData): void {
        this.core.log(data)
    }
}

/*
    const tracker = new Tracker({
        interval: 1000,            // ms
        groupMaxLength: 5
    })

    tracker.init('https://example.com/t', {
        key1: 'value'
    })

*/