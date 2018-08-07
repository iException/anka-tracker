const { tracker } = require('./tracker.js')

//app.js
App({
    onLaunch (options) {
        this.onLaunchOption = options
        this.tracker = tracker

        console.log(tracker)

        new Array(6).fill(1).forEach((item, index) => {

            // 自己随便来点数据
            tracker.log({
                test_key: 'login_' + index,
                tracktype: 'event',     // event 或pageview
                action: '__viewPage',
                page_type: 'common',
                page_id: 'pet_main',
                page_level: 'second_page'
            })
        })
    },

    onShow () {
        /**
         * 初始化 tracker 的 common 数据
         * 在这之后，才会开始打点请求
         */
        tracker.commonDataVendor.getCommonData({
            onLaunchOption: this.onLaunchOption
        }).then(res => {
            console.log('commonData:', res)

            // 这里为什么要加延时呢？
            // 只是为了测试下延时后，打点任务是否会被存储
            setTimeout(() => {

                // 此时才会真正地完成初始化
                tracker.init(Object.assign(res, {
                    __debug: 1,
                    event_type: 'bx_wxmini',
                    app_type: 'wx',
                    app_id: 'wxfd853a0b03d0aea9',
                    app_name: '宠咖秀',
                    template_version: 'v1.5.0',
                    app_category: '服务类目-宠物（非医院类）',
                }))
            }, 3000)
        }).catch(err => {
            console.log(err)
        })
    },
})