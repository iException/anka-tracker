import { Initializer } from './Initializer'
export abstract class NetworkDetector {
    protected config: Initializer
    constructor (config: Initializer) {
        this.config = config
    }
    abstract getNetworkStatus (): Promise<string>
    abstract watchNetworkStatusChange (callback: (networkType: string) => void): void
}
