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
    track (...dataList: Array<TrackData | TrackDataFactory>): void {
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
        Promise.all(tasks).then((commonDataList: TrackData[]) => {
            this.log(Object.assign({}, ...commonDataList))
        })
    }

    @readonlyDecorator()
    action (action: string = '', ...dataList: Array<TrackData | TrackDataFactory>): void {
        if (typeof action !== 'string') throw new Error('缺少 action 参数')
        this.track(...dataList, {
            action
        })
    }

    @readonlyDecorator()
    pv (trackData: TrackData) {
        this.action(
            '__pageView',
            trackData,
            this.genLastPageId(trackData)
        )
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