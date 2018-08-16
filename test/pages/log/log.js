Page({
    data: {},
    onLoad () {
        // TODO
    },
    onShow () {
        getApp().tracker.pv('__viewPage', {
            page_id: 'log',
            page_type: 'common',
            page_title: '详情页',
            page_level: 'tabbar_page'
        })
    }
})
