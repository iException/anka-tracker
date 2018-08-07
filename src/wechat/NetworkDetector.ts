import * as wechat from './utils'
import { NetworkDetector } from '../core/NetworkDetector'

export class WeChatNetworkDetector extends NetworkDetector {
    getNetworkStatus (): Promise<string> {
        return wechat.getNetworkType()
            .then(networkType => {
                return Promise.resolve(networkType)
            }, err => {
                console.error('[tracker] 获取网络状态失败', err)
                return Promise.resolve('none')
            })
    }

    watchNetworkStatusChange (callback: Function): void {
        wechat.onNetworkStatusChange(callback)
    }
}