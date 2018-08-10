import { Tracker } from './Tracker'

export declare class BxTracker extends Tracker {
    static generateTrackerInstance (): Tracker
    asyncInitWithCommonData (commonData: object): Promise<void>
    extractOnLaunchOption (): void
    track (...dataList: Array<TrackData | TrackDataFactory>): void
    action (action: string, data: TrackData): void
}

export declare const tracker: BxTracker