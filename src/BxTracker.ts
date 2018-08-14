import { Tracker } from './Tracker'
import helper, { readonlyDecorator } from './helper'

export class BxTracker extends Tracker {
    private last_page_id: string

    static generateTrackerInstance (): Tracker {
        let config = <InilialzeConfig>{}
        try {
            config = require('./anka-tracker.config.js')
        } catch (err) {}
        const tracker = new BxTracker(config)
        if (config.extractOnLaunchOption) {
            tracker.extractOnLaunchOption()
        }
        return tracker
    }

    @readonlyDecorator()
    asyncInitWithCommonData (commonData: object = {}): Promise<void> {
        return this.commonDataVendor.getCommonData({
            onLaunchOption: this.onLaunchOption
        }).then(res => {
            this.init(Object.assign(res, this.config.commonData, commonData))
        }).catch(err => {
            helper.log('初始化失败')
            console.log(err)
        })
    }

    @readonlyDecorator()
    extractOnLaunchOption (): void {
        const tracker = this
        const _App = App

        App = <AppConstructor>function (object) {
            const AppLaunchHook = object.onLaunch
            object['onLaunch'] = function (options) {
                onAppLaunch.call(this, options)
                AppLaunchHook && AppLaunchHook.call(this, options)
            }
            _App(object)
        }

        function onAppLaunch (options: onLaunchOption) {
            tracker.onLaunchOption = options
        }
    }

    @readonlyDecorator()
    composeCommonData (dataList: Array<TrackData | TrackDataFactory>): Promise<TrackData> {
        const tasks: Promise<TrackData>[] = []
        dataList.map(data => {
            if (typeof data === 'function') {
                tasks.push(new Promise(resolve => {
                    data(resolve)
                }))
            } else {
                tasks.push(Promise.resolve(data))
            }
        })
        return Promise.all(tasks).then((commonDataList: TrackData[]) => Promise.resolve(Object.assign({}, ...commonDataList)))
    }

    @readonlyDecorator()
    track (...dataList: Array<TrackData | TrackDataFactory>): void {
        this.composeCommonData(dataList).then((trackData: TrackData) => this.log(trackData))
    }

    @readonlyDecorator()
    evt (action: string = '', ...dataList: Array<TrackData | TrackDataFactory>): void {
        if (!action) throw new Error('缺少 action 参数')
        this.track(...dataList, {
            action,
            tracktype: 'event'
        })
    }

    @readonlyDecorator()
    pv (action: string = '', ...dataList: Array<TrackData | TrackDataFactory>) {
        this.composeCommonData(dataList).then((trackData: TrackData) => {
            this.log(Object.assign(
                trackData,
                this.genLastPageId(trackData),
                {
                    action,
                    tracktype: 'pageview'
                }
            ))
        })
    }

    @readonlyDecorator()
    genLastPageId (trackData: TrackData): TrackData {
        const { last_page_id = '' } = this
        this.last_page_id = trackData.page_id
        return {
            last_page_id
        }
    }
}

export const tracker = BxTracker.generateTrackerInstance()