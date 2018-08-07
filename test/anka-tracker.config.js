module.exports = {
    debug: true,
    trackerHost: 'http://bi.baixing.com:9001/dw-web/log',
    retry: 1,                       // 失败重试次数
    interval: 2000,                 // 每组请求发送时间间隔 ms
    groupMaxLength: 2,              // 每组包含打点数
    timestampKey: 'timestamp_ms'    // 时间戳 key
}