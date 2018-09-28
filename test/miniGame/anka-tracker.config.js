const ENV = 'dev'
const VERSION = '0.0.1'

module.exports = {
    debug: ENV === 'prod' ? false : true,
    httpMethod: 'POST',
    trackerHost: 'https://www.baixing.com/c/wxmini',

    // 失败重试次数
    retry: 1,

    // 每组请求发送时间间隔 ms
    interval: 500,

    // 每组包含打点数
    groupMaxLength: 3,

    // 时间戳 key
    timestampKey: 'timestamp_ms',

    // track_id key
    trackIdKey: 'trackId',

    // 是否要将 action 添加到 url 后
    attachActionToUrl: true,

    // 劫持 page onShow 方法开启自动 pv 打点，小游戏上禁用
    autoPageView: false,

    // 是否检测渠道参数，小游戏上禁用
    detectChanel: true,

    // 是否捕获启动事件，小游戏上禁用
    detectAppStart: false,

    // common data 中 source_src_key 字段值取自 onLaunch
    // 钩子中 options.query[sourceSrcKey] 的值
    // 小游戏上禁用
    sourceSrcKey: 'tsrc',

    commonData: {
        __debug: ENV === 'prod' ? 0 : 1,
        event_type: 'bx_wxmini',
        tracktype: 'event',         // event 或pageview
        app_type: 'wx',
        app_id: '123123123123123',
        app_role: 'bx',
        app_name: '猫狗大战',
        template_version: VERSION,
        app_category: '小游戏',
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
        sdk_version: 1
    },
    beforeSend(data) {
        for (let key in data) {
            if (data.hasOwnProperty(key) && (data[key] === null || data[key] === void (0))
            ) {
                delete data[key]
            }
        }
        return data
    }
}
