import { Core } from './Core'
import { Initializer } from './Initializer'
import { CommonDataVendor } from './CommonDataVendor'
import { NetworkDetector } from './NetworkDetector'

export declare class Tracker {
    private core: Core
    private store: Store
    private sender: Sender
    public config: Initializer
    public networkDetector: NetworkDetector
    public commonDataVendor: CommonDataVendor
    public onLaunchOption: onLaunchOption
    init (url: string, commonData?: Object): void
    log (data: TrackData): void
    forceLog (data: TrackData): void
    handleNetworkStatusChange (networdkType: string | Error): void
}
