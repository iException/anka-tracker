import {
    WeChatStore,
    WeChatSender,
    WeChatNetworkDetector,
    WeChatCommonDataVender,
} from './wechat/index'
import Core from './core/index'
import { Task } from './core/Task'
import { Store } from './core/Store'
import { Sender } from './core/Sender'
import { AliPaySender } from './alipay/index'
import { Initializer } from './core/Initializer'
import helper, { readonlyDecorator } from './helper'
import { NetworkDetector } from './core/NetworkDetector'
import { CommonDataVendor } from './core/CommonDataVendor'

export class Tracker {
    private core: Core
    private store: Store
    private sender: Sender
    public config: Initializer
    public networkDetector: NetworkDetector
    public commonDataVendor: CommonDataVendor
    public onLaunchOption: onLaunchOption

    constructor (config: InilialzeConfig = {}) {
        this.config = new Initializer(config)
        this.core = new Core(this.config)
        helper.DEBUG = this.config.debug
        // 默认暂停 task runner
        this.core.queueManager.suspend(true)
        this.networkDetector = new WeChatNetworkDetector(this.config)
        this.commonDataVendor = new WeChatCommonDataVender(this.config)
    }

    @readonlyDecorator()
    init (commonData?: Object) {

        // 只允许初始化一次
        if (this.sender) return
        const handleNetworkStatusChange = this.handleNetworkStatusChange.bind(this)

        // 之所以留下 AliPaySender，是为了支付宝小程序的打点功能做准备
        this.sender = new WeChatSender(this.config, commonData)
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
        helper.log('初始化完成')
    }

    @readonlyDecorator()
    handleNetworkStatusChange (networdkType: string | Error): void {
        const suspended = networdkType === 'none' || networdkType instanceof Error
        this.core.queueManager.suspend(suspended)
    }

    @readonlyDecorator()
    log (data: TrackData): void {
        const now = Date.now()
        data[this.config.timestampKey] = now
        this.core.log(new Task(data))
    }
}
