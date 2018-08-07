export declare class Initializer {
    readonly retry: number
    readonly interval: number
    readonly groupMaxLength: number
    readonly sender?: Sender
    readonly timestampKey?: string
    constructor (config: InilialzeConfig)
}