import Core from './core/index'
import { Task } from './core/Task'
import { Store } from './core/Store'
import { Sender } from './core/Sender'
import { Initializer } from './core/Initializer'
import {
    WeChatStore,
    WeChatSender,
    WeChatNetworkDetector,
    WeChatCommonDataVender,
} from './wechat/index'
import { AliPaySender } from './alipay/index'
import { NetworkDetector } from './core/NetworkDetector'
import { CommonDataVendor } from './core/CommonDataVendor'

export class Tracker {
    private core: Core
    private config: Initializer
    private store: Store
    private sender: Sender
    private networkDetector: NetworkDetector
    private commonDataVendor: CommonDataVendor

    constructor (config: InilialzeConfig) {
        this.config = new Initializer(config)
        this.core = new Core(this.config)
        // 默认暂停 task runner
        this.core.queueManager.suspend(true)
        this.networkDetector = new WeChatNetworkDetector()
        this.commonDataVendor = new WeChatCommonDataVender()
    }

    init (url: string, globalData?: Object) {
        const handleNetworkStatusChange = this.handleNetworkStatusChange.bind(this)

        // 之所以留下 AliPaySender，是为了支付宝小程序的打点功能做准备
        this.sender = new WeChatSender(url, this.config, globalData)
        this.store = new WeChatStore(this.config)
        this.core.init({
            sender: this.sender,
            store: this.store
        })
        this.networkDetector.getNetworkStatus().then(
            handleNetworkStatusChange,
            handleNetworkStatusChange
        )
        this.networkDetector.watchNetworkStatusChange(handleNetworkStatusChange)
    }

    handleNetworkStatusChange (networdkType: string | Error): void {
        const suspended = networdkType === 'none' || networdkType instanceof Error
        console.log(suspended, networdkType)
        this.core.queueManager.suspend(suspended)
    }

    log (data: TrackData): void {
        const now = Date.now()
        data[this.config.timestampKey] = now
        this.core.log(new Task(data))
    }

    commonData (data: {onLaunchOption: onLaunchOption}): Promise<any> {
        return this.commonDataVendor.getCommonData(data)
    }
}
