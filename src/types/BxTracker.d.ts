import { Tracker } from './Tracker'

export declare class BxTracker extends Tracker {
    static generateTrackerInstance (): Tracker

    asyncInitWithCommonData (commonData: object): Promise<void>

    detectChanel (tsrc: string): void

    composeCommonData (dataList: Array<TrackData | TrackDataFactory>): Promise<TrackData>

    track (...dataList: Array<TrackData | TrackDataFactory>): void

    evt (action: TrackAction, ...dataList: Array<TrackData | TrackDataFactory>): void

    pv (action: TrackAction, ...dataList: Array<TrackData | TrackDataFactory>): void

    genLastPageUrl (trackData: TrackData): TrackData
}

export declare const tracker: BxTracker
