module.exports = {
    debug: true,
    httpMethod: 'POST',
    trackerHost: 'http://bi.baixing.com:9001/dw-web/log',

    // 失败重试次数
    retry: 0,

    // 每组请求发送时间间隔 ms
    interval: 1000,

    // 每组包含打点数
    groupMaxLength: 2,

    // 时间戳 key
    timestampKey: 'timestamp_ms',

    // track_id key
    trackIdKey: 'track_id',

    // 是否要将 action 添加到 url 后
    attachActionToUrl: true,

    // 是否要从 onLaunch 中获取 option 参数并用于 commonData
    extractOnLaunchOption: true,

    // 是否检测渠道参数
    detectChanel: true,

    // 是否捕获启动事件
    detectLaunch: true,

    // common data 中 source_src_key 字段值取自 onLaunch
    // 钩子中 options.query[sourceSrcKey] 的值
    sourceSrcKey: 'tsrc',

    // 预设的基础数据
    commonData: {
        __debug: 1,                 // 默认值是 1
        event_type: 'bx_wxmini',
        tracktype: 'event',         // event 或 pageview
        app_type: 'wx',
        app_id: 'wxfd853a0b03d0aea9',
        app_name: '宠咖秀',
        template_version: 'v1.5.0',
        app_category: '服务类目-宠物（非医院类）',

        // 测试 beforeSend 过滤方法
        value_null: null,
        value_undefined: undefined,
        value_empty: ''
    },
    dataScheme: {                   // 数据校验规则：1 required，0 optional
        event_type: 1,
        tracktype: 1,
        action: 1,
        timestamp_ms: 1,
        __debug: 0,
        app_type: 1,
        app_id: 1,
        app_name: 1,
        template_version: 1,
        app_category: 1,
        preview_version: 0,
        app_role: 0,
        internal_app: 0,
        track_id: 1,
        open_id: 0,
        union_id: 0,
        bx_user_id: 0,
        visitor_mobile: 0,
        distinct_id: 0,
        ip: 0,
        os: 1,
        os_version: 1,
        model: 1,
        network_type: 1,
        env_version: 0,
        source: 1,
        source_path: 1,
        source_params: 0,
        source_src_key: 0,
        source_app_id: 0,
        page_type: 1,
        page_id: 1,
        last_page_type: 0,
        last_page_id: 0,
        page_level: 1,
        sdk_version: 1
    },
    beforeSend (data) {
        for (let key in data) {
            if (data.hasOwnProperty(key) && (data[key] === null || data[key] === void(0))
            ) {
                delete data[key]
            }
        }
        return data
    }
}
