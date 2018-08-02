import { Task } from '../core/Task'
import { Sender } from '../core/Sender'
import * as wechat  from './utils'

declare interface WeChatAPI {
    request (): Promise<any>
}

export class WeChatSender implements Sender {
    url: string
    globalData: Object

    constructor (url: string, globalData?: Object) {
        this.url = url
        this.globalData = globalData
    }

    send (task: Task): Promise<Task> {
        return wechat.request({
            url: this.url,
            method: 'POST',
            data: {
                ...this.globalData,
                ...task.data
            }
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