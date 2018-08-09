module.exports = {
    debug: true,
    trackerHost: 'http://bi.baixing.com:9001/dw-web/log',
    retry: 1,                       // 失败重试次数
    interval: 2012,                 // 每组请求发送时间间隔 ms
    groupMaxLength: 2,              // 每组包含打点数
    timestampKey: 'timestamp_ms',   // 时间戳 key
    attachActionToUrl: true,        // 是否要将 action 添加到 url 后
    extractOnLaunchOption: true,    // 是否要从 onLaunch 中获取 option 参数
    commonData: {
        __debug: 1,                 // 默认值是 1
        event_type: 'bx_wxmini',
        app_type: 'wx',
        app_id: 'wxfd853a0b03d0aea9',
        app_name: '宠咖秀',
        template_version: 'v1.5.0',
        app_category: '服务类目-宠物（非医院类）',
    }
}