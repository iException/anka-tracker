export abstract class NetworkDetector {
    abstract getNetworkStatus (): Promise<string>
    abstract watchNetworkStatusChange (callback: (networkType: string) => void): void
}