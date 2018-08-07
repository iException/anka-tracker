import { Sender } from './Sender'

const DEFAULT_CONFIG: InilialzeConfig = {
    debug: true,                  // 开启 log 调试
    retry: 2,                     // 任务失败后的重试次数
    interval: 1000,               // 每组的时间间隔，单位 ms
    groupMaxLength: 5,            // 每组会包含的任务数
    timestampKey: 'timestamp_ms', // 添加到打点数据上的时间戳
    queueMaxLength: 500,          // 队列最大长度，超出后新的任务会被丢弃
}

export class Initializer {
    readonly debug: boolean
    readonly trackerHost: string
    readonly retry: number
    readonly interval: number
    readonly groupMaxLength: number
    readonly timestampKey?: string
    readonly queueMaxLength: number

    constructor (config: InilialzeConfig = {}) {
        config = Object.assign(DEFAULT_CONFIG, config)
        this.debug = config.debug
        this.trackerHost = config.trackerHost
        this.retry = config.retry
        this.interval = config.interval
        this.groupMaxLength = config.groupMaxLength
        this.timestampKey = config.timestampKey
        this.queueMaxLength = config.queueMaxLength
    }
}