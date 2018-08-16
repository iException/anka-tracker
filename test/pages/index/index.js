//index.js
//获取应用实例
const app = getApp()

Page({
    pageId: 'index',
    onShow () {
        getApp().tracker.pv('__viewPage', {
            page_id: this.pageId,
            page_type: 'common',
            page_title: '首页-我的家族',
            page_level: 'tabbar_page'
        })
    },


    track1 () {
        getApp().tracker.evt('click_btn')
    },

    track2 () {
        getApp().tracker.evt('click_btn', {
            page_id: this.pageId,
            custom_data: 'custom_data'
        })
    },

    track3 () {
        getApp().tracker.evt('click_btn', {
            page_id: this.pageId,
            app_name: 'app_name',
            template_version: 'template_version',
            app_category: 'app_category',
        })
    },

    track4 () {
        for (let i = 0; i < 10; i++) {
            getApp().tracker.evt(
                // action 必须指定
                'test_action',

                // 可以传入对象
                {
                    page_type: 'common',
                    page_level: 'second_page',
                },

                // 也可以传入方法，注意必须调用 callback
                callback => {
                    callback({
                        test_key: 'post_moment'
                    })
                }
            )
        }
    },

    track5 () {
        wx.navigateTo({
            url: '/pages/log/log'
        })
    }
})
