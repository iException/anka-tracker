import { Sender } from './Sender'

const DEFAULT_CONFIG: InilialzeConfig = {
    retry: 2,
    interval: 1000,              // ms
    groupMaxLength: 5,
    timestampKey: 'timestamp_ms',
    queueMaxLength: 300,
    failedQueueMaxLength: 100
}

export class Initializer {
    readonly retry: number
    readonly interval: number
    readonly groupMaxLength: number
    readonly timestampKey?: string
    readonly queueMaxLength: number
    readonly failedQueueMaxLength: number

    constructor (config: InilialzeConfig = {}) {
        config = Object.assign(DEFAULT_CONFIG, config)
        this.retry = config.retry
        this.interval = config.interval
        this.groupMaxLength = config.groupMaxLength
        this.timestampKey = config.timestampKey
        this.queueMaxLength = config.queueMaxLength
        this.failedQueueMaxLength = config.failedQueueMaxLength
    }
}