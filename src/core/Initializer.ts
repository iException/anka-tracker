import { Sender } from './Sender'

const DEFAULT_CONFIG: InilialzeConfig = {
    debug: true,
    httpMethod: 'POST',
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
    readonly httpMethod: string
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
        Object.assign(this, DEFAULT_CONFIG, config)
    }
}