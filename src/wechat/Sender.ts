import * as wechat from './utils'
import helper from '../helper'
import { Task } from '../core/Task'
import { Sender } from '../core/Sender'
import { WeChatCommonDataVender } from './CommonDataVendor'
import { Initializer } from '../core/Initializer'

export class WeChatSender implements Sender {
    url: string
    commonData: Object
    config: Initializer

    constructor (config: Initializer, commonData?: Object) {
        this.url = config.trackerHost
        this.config = config
        this.commonData = commonData
    }

    send (task: Task): Promise<Task> {
        const data = <TrackData>{
            ...this.commonData,
            ...task.data
        }
        let url = this.url
        if (this.config.attachActionToUrl) {
            const trackAction = data.action || ''
            url = /\/$/.test(this.url) ? `${this.url}${trackAction}` : `${this.url}/${trackAction}`
        }
        helper.log('打点数据校验结果:', task, WeChatCommonDataVender.validate(data))

        return wechat.request({
            url,
            method: 'POST',
            data
        }).then(() => {
            // 这一步肥肠重要，只需改变状态即可
            task.isSucceed()
            return Promise.resolve(task)
        }).catch(() => {
            task.isFailed()
            return Promise.resolve(task)
        })
    }
}