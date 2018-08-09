import helper from './helper'
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
import { resolve } from 'dns';

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
        this.networkDetector = new WeChatNetworkDetector()
        this.commonDataVendor = new WeChatCommonDataVender()
    }

    static generateTrackerInstance (): Tracker {
        let config = <InilialzeConfig>{}
        try {
            config = require('./anka-tracker.config.js')
        } catch (err) {}
        const tracker = new Tracker(config)
        if (config.extractOnLaunchOption) {
            tracker.extractOnLaunchOption()
        }
        return tracker
    }

    init (commonData?: Object) {
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
    }

    handleNetworkStatusChange (networdkType: string | Error): void {
        const suspended = networdkType === 'none' || networdkType instanceof Error
        this.core.queueManager.suspend(suspended)
    }

    asycnInitWithCommonData (commonData: object = {}): Promise<void> {
        return this.commonDataVendor.getCommonData({
            onLaunchOption: this.onLaunchOption
        }).then(res => {
            helper.log('初始化完成')
            this.init(Object.assign(res, this.config.commonData, commonData))
        }).catch(err => {
            helper.log('初始化失败')
            console.log(err)
        })
    }

    extractOnLaunchOption (): void {
        const tracker = this
        const _App = App

        App = <AppConstructor>function (object) {
            const AppLaunchHook = object.onLaunch
            object['onLaunch'] = function (options) {
                onAppLaunch.call(this, options)
                AppLaunchHook && AppLaunchHook.call(this, options)
            }
            _App(object)
        }

        function onAppLaunch (options: onLaunchOption) {
            tracker.onLaunchOption = options
        }
    }

    log (data: TrackData): void {
        const now = Date.now()
        data[this.config.timestampKey] = now
        this.core.log(new Task(data))
    }

    action (action: string = '', data: TrackData): void {
        if (typeof action !== 'string') throw new Error('缺少 action 参数')
        data.action = action
        this.log(data)
    }
}

export const tracker = Tracker.generateTrackerInstance()