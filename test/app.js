const { tracker } = require('./anka-tracker.js')

//app.js
App({
    onLaunch (options) {
        this.onLaunchOption = options
        this.tracker = tracker

        console.log(tracker)

        // 自己随便来点数据
        tracker.log({
            test_key: 'login_',
            tracktype: 'event',     // event 或pageview
            action: '__viewPage',
            page_type: 'common',
            page_id: 'pet_main',
            page_level: 'second_page'
        })

        // 自己随便来点数据
        tracker.action('post', {
            test_key: 'post_moment',
            tracktype: 'event',     // event 或pageview
            page_type: 'common',
            page_id: 'pet_main',
            page_level: 'second_page'
        })

        wx.login({
            // 示意
            complete: () => {
                // 只有初始化成功后才会开始打点请求
                tracker.asyncInitWithCommonData({
                    loginCode: '23333333'
                }).then(() => {
                    console.log('初始化成功，开始执行打点任务')
                })
            }
        })
    },

    onUnLaunch (options) {
        console.log('onUnLaunch:', options)
    }
})