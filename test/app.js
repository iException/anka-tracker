const { tracker } = require('./anka-tracker.js')

//app.js
App({
    globalData: {
        count: 1,
        last_page_id: 'none'
    },

    onLaunch (options) {
        this.onLaunchOption = options
        this.tracker = tracker

        console.log(tracker)


        // 可以自定义一个 pv 方法
        tracker.pv = (trackData = {}) => {
            tracker.action(
                '__pageView',
                {
                    tracktype: 'event2',     // event 或pageview
                },
                trackData,
                this.genLastPageId(trackData.page_id)
            )
        }

        // 自己随便来点数据
        for (let i = 0; i < 6; i++) {
            tracker.pv({
                page_type: 'common',
                test_key: 'post_moment',
                page_level: 'second_page',
                page_id: `page_id_${this.globalData.count++}`
            })
        }

        wx.login({
            // 示意
            complete: () => {
                // 只有初始化成功后才会开始打点请求
                tracker.asyncInitWithCommonData({
                    loginCode: '23333333',
                    open_id: 'user_open_id'
                }).then(() => {
                    console.log('初始化成功，开始执行打点任务')
                })
            }
        })
    },

    genLastPageId (pageId = 'none') {
       return callback => {
            const page_id = pageId // 'page_id_' + this.globalData.count++
            const commonData = {
                page_id,
                last_page_id: this.globalData.last_page_id
            }
            this.globalData.last_page_id = pageId
            callback(commonData)
        }
    },

    onUnLaunch (options) {
        console.log('onUnLaunch:', options)
    }
})