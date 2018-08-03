import Core from './core/index'
import { Task } from './core/Task'
import { Store } from './core/Store'
import { Sender } from './core/Sender'
import { Inilialzer } from './core/Initializer'
import {
    WeChatStore,
    WeChatSender,
    WeChatCommonDataVender,
} from './wechat/index'
import { AliPaySender } from './alipay/index'
import { CommonDataVendor } from './core/CommonDataVendor'

export class Tracker {
    private core: Core
    private config: Inilialzer
    private store: Store
    private sender: Sender
    private commonDataVendor: CommonDataVendor

    constructor (config: InilialzeConfig) {
        this.config = new Inilialzer(config)
        this.core = new Core(this.config)
        this.commonDataVendor = WeChatCommonDataVender
    }

    init (url: string, globalData?: Object) {
        this.sender = new WeChatSender(url, this.config, globalData)
        this.store = new WeChatStore(this.config)
        this.core.init({
            sender: this.sender,
            store: this.store
        })
    }

    log (data: TrackData): void {
        const now = Date.now()
        data[this.config.timestampKey] = now
        this.core.log(new Task(data))
    }

    commonData (): Promise<any> {
        return this.commonDataVendor.getCommonData()
    }
}

