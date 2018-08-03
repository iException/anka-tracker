const { Tracker } = require('./tracker.js')

const tracker = new Tracker({
    groupMaxLength: 1
})

//app.js
App({
    onLaunch: function(options) {
        console.log(options, getCurrentPages())
        
        this.onLaunchOption = options
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        this.tracker = tracker
        console.log(tracker)
        new Array(10).fill(1).forEach((item, index) => {
            tracker.log({
                e_type: 'login' + index,
                tracktype: 'event',     // event 或pageview
                action: '__viewPage',
                page_type: 'common',
                page_id: 'pet_main',
                page_level: 'second_page'
            })
        })
        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
    onShow () {
        tracker.commonDataVendor.getCommonData({
            onLaunchOption: this.onLaunchOption
        }).then(res => {
            console.log(res)
            setTimeout(() => {
                tracker.init('http://bi.baixing.com:9001/dw-web/log', Object.assign(res, {
                    event_type: 'bx_wxmini',
                    app_type: 'wx',
                    app_id: 'wxfd853a0b03d0aea9',
                    app_name: '宠咖秀',
                    template_version: 'v1.5.0',
                    app_category: '服务类目-宠物（非医院类）',
                    track_id: '1530003880537-575341-0083c5d7cba5468-24077526',
                    ip: '--------',
                }))
            }, 5000)
        }).catch(err => {
            console.log(err)
        })
    },
    globalData: {
        userInfo: null
    }
})