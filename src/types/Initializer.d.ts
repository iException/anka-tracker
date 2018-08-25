export declare class Initializer {
    readonly debug: boolean
    readonly retry: number
    readonly sender?: Sender
    readonly interval: number
    readonly commonData: object
    readonly dataScheme: object
    readonly httpMethod: string
    readonly trackerHost: string
    readonly trackIdKey?: string
    readonly detectChanel: boolean
    readonly timestampKey?: string
    readonly groupMaxLength: number
    readonly queueMaxLength: number
    readonly attachActionToUrl: boolean
    readonly extractOnLaunchOption: boolean
    readonly beforeSend: (data: TrackData) => TrackData
    constructor (config: InilialzeConfig)
}
