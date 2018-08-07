import { Task } from '../core/Task'
import { Sender } from '../core/Sender'
import * as wechat  from './utils'

declare interface AliPayAPI {
    request (): Promise<any>
}

export class AliPaySender implements Sender {
    url: string
    commonData: Object

    constructor (url: string, commonData?: Object) {
        this.url = url
        this.commonData = commonData
    }

    send (task: Task): Promise<Task> {
        return wechat.request({
            url: this.url,
            method: 'POST',
            header: this.commonData,
            data: task.data
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