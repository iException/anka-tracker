import { Sender } from './Sender'

const DEFAULT_CONFIG: InilialzeConfig = {
    retry: 2,
    interval: 1000,              // ms
    groupMaxLength: 5,
}

export class Inilialzer {
    readonly retry: number
    readonly interval: number
    readonly groupMaxLength: number
    readonly sender?: Sender

    constructor (config: InilialzeConfig = {}) {
        config = Object.assign(DEFAULT_CONFIG, config)
        this.retry = config.retry
        this.interval = config.interval
        this.groupMaxLength = config.groupMaxLength
        this.sender = config.sender
    }
}