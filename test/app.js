const { tracker } = require('./anka-tracker.js')

//app.js
App({
    globalData: {
        count: 1,
    },

    onLaunch (options) {
        this.onLaunchOption = options
        this.tracker = tracker

        console.log(tracker)

        // // 自己随便来点数据

        //
        // tracker.evt('share', {
        //     moment_id: 1,
        //     user_id: 2333
        // })

        wx.login({
            // 示意
            complete: () => {
                // 只有初始化成功后才会开始打点请求
                tracker.asyncInitWithCommonData({
                    open_id: 'mock_open_id',
                    union_id: 'mock_union_id'
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
