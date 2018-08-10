export declare class NetworkDetector {
    getNetworkStatus (): Promise<string>
    watchNetworkStatusChange (callback: (networkType: string) => void): void
}