import * as qs from 'qs'
import { Tracker } from './Tracker'
import helper, { readonlyDecorator } from './helper'
import { functionWrapper } from './wechat/utils'

export class BxTracker extends Tracker {
    private last_page_id: string
    private last_page_url: string

    static generateTrackerInstance (customConfig?: InilialzeConfig): Tracker {
        let defaultConfig = <InilialzeConfig>{}

        try {
            const config = require('./anka-tracker.config.js')

            Object.assign(defaultConfig, config)
        } catch (err) {
            !customConfig && console.log('缺少配置文件 anka-tracker.config.js', err)
        }

        customConfig && Object.assign(defaultConfig, customConfig)

        const tracker = new BxTracker(defaultConfig)

        // ############## 小程序 ##############
        if (typeof App !== 'undefined' && typeof Page !== 'undefined') {
            const AppConstructor = App
            const PageConstructor = Page

            App = <AppConstructor>function (opts) {
                functionWrapper(opts, 'onLaunch', function (options: onLaunchOption) {
                    tracker.onLaunchOption = options
                    if (tracker.config.detectChanel) {
                        tracker.detectChanel(options.query[tracker.config.sourceSrcKey])
                    }
                })

                if (tracker.config.detectAppStart) {
                    functionWrapper(opts, 'onShow', function (options: onLaunchOption) {
                        tracker.evt('app_start', {})
                    })
                }
                return AppConstructor(opts)
            }

            Page = <PageConstructor>function (opts) {
                functionWrapper(opts, 'onLoad', function (options: onLoadOptions) {
                    this.__page_params__ = options
                })

                if (typeof tracker.config.autoPageView === 'function') {
                    functionWrapper(opts, 'onShow', function () {
                        const currentPage = <Page>getCurrentPages().slice().pop()
                        tracker.config.autoPageView(currentPage, (trackData: TrackData) => {
                            tracker.pv(trackData.action, trackData, {
                                page_id: currentPage.route,
                                page_url: currentPage.route,
                                page_params: qs.stringify(currentPage.__page_params__)
                            })
                        })
                    })
                }
                return PageConstructor(opts)
            }
        // ############## 小游戏 ##############
        } else if (typeof wx !== 'undefined' && wx.getLaunchOptionsSync) {
            tracker.onLaunchOption = wx.getLaunchOptionsSync()

            if (tracker.config.detectChanel) {
                tracker.detectChanel(tracker.onLaunchOption.query[tracker.config.sourceSrcKey])
            }
            console.log('当前处于小游戏环境！')
        } else {
            console.log('anka-tracker无法在当前环境运行！')
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
    detectChanel (tsrc: string) {
        if (!tsrc) return
        const data: { [index: string]: string } = {}
        tsrc.split(/_+/).forEach((src, index) => {
            data[`source_src_key_${index + 1}`] = src
        })
        this.evt('channel', data)
    }

    @readonlyDecorator()
    composeCommonData (dataList: Array<TrackData | TrackDataFactory>): Promise<TrackData> {
        const tasks: Promise<TrackData>[] = []
        dataList.map((data: Function) => {
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
    forceTrack (...dataList: Array<TrackData | TrackDataFactory>): void {
        this.composeCommonData(dataList).then((trackData: TrackData) => this.forceLog(trackData))
    }

    @readonlyDecorator()
    evt (action: TrackAction = '', ...dataList: Array<TrackData | TrackDataFactory>): void {
        if (!action) throw new Error('缺少 action 参数')
        this.track(...dataList, {
            action,
            tracktype: 'event'
        })
    }

    @readonlyDecorator()
    forceEvt (action: TrackAction = '', ...dataList: Array<TrackData | TrackDataFactory>): void {
        if (!action) throw new Error('缺少 action 参数')
        this.forceTrack(...dataList, {
            action,
            tracktype: 'event'
        })
    }

    @readonlyDecorator()
    pv (action: TrackAction = '', ...dataList: Array<TrackData | TrackDataFactory>) {
        this.composeCommonData(dataList).then((trackData: TrackData) => {
            this.log(Object.assign(
                trackData,
                this.genLastPageUrl(trackData),
                {
                    action,
                    tracktype: 'pageview'
                }
            ))
        })
    }

    @readonlyDecorator()
    genLastPageUrl (trackData: TrackData): TrackData {
        const {
            last_page_id = '',
            last_page_url = ''
        } = this
        this.last_page_url = trackData.page_url || ''
        this.last_page_id = trackData.page_id || ''
        return {
            last_page_id,
            last_page_url
        }
    }
}

export const tracker = BxTracker.generateTrackerInstance({})
