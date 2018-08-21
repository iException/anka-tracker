declare type TrackData = {
    [index: string]: any
}

declare type TrackDataFactory = (callback: (trackData: TrackData) => void) => void

declare interface InilialzeConfig {

    // 开启 log 调试
    debug?: boolean,

    // sender 发送请求是使用的 HTTP 方法
    httpMethod?: string,

    // 数据接收接口
    trackerHost?: string,

    // 自定义 sender
    sender?: Sender,

    // 任务失败后的重试次数
    retry?: number,

    // 每组的时间间隔，单位 ms
    interval?: number,

    // 每组会包含的任务数
    groupMaxLength?: number,

    // 添加到打点数据上的时间戳键名
    timestampKey?: string,

    // 用于追踪每个用户的 ID 键名
    trackIdKey?: string,

    // 队列最大长度，超出后新的任务会被丢弃
    queueMaxLength?: number,

    // 可在这里指定一些 common data
    commonData?: object,

    // common data 校验规则
    dataScheme?: object,

    // 是否检测渠道参数
    detectChanel?: boolean,

    // 是否要把 commonData.action 添加到 trackerHost 后
    attachActionToUrl?: boolean,

    // 是否从 App.onLaunch 中获取 option 用于设置 common data
    extractOnLaunchOption?: boolean,
}

declare type Timer = any
