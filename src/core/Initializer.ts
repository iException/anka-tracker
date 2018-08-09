import { Sender } from './Sender'

const DEFAULT_CONFIG: InilialzeConfig = {
    debug: true,
    retry: 2,
    interval: 1000,
    groupMaxLength: 5,
    timestampKey: 'timestamp_ms',
    queueMaxLength: 500,
    commonData: {},
    attachActionToUrl: false,
    extractOnLaunchOption: true
}

export class Initializer implements InilialzeConfig {
    readonly debug: boolean
    readonly trackerHost: string
    readonly retry: number
    readonly interval: number
    readonly commonData: Object
    readonly groupMaxLength: number
    readonly timestampKey?: string
    readonly queueMaxLength: number
    readonly attachActionToUrl: boolean
    readonly extractOnLaunchOption: boolean

    constructor (config: InilialzeConfig = {}) {
        config = Object.assign(DEFAULT_CONFIG, config)
        this.debug = config.debug
        this.trackerHost = config.trackerHost
        this.retry = config.retry
        this.interval = config.interval
        this.commonData = config.commonData
        this.groupMaxLength = config.groupMaxLength
        this.timestampKey = config.timestampKey
        this.queueMaxLength = config.queueMaxLength
        this.attachActionToUrl = config.attachActionToUrl
        this.extractOnLaunchOption = config.extractOnLaunchOption
    }
}