import { Core } from './Core'
import { Initializer } from './Initializer'
import { CommonDataVendor } from './CommonDataVendor'

export class Tracker {
    private core: Core
    private config: Initializer
    private store: Store
    private sender: Sender
    private commonDataVendor: CommonDataVendor
    constructor (config: InilialzeConfig)
    init (url: string, commonData?: Object): void
    log (data: TrackData): void
    commonData (data: {onLaunchOption: onLaunchOption}): Promise<any>
}
