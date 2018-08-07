declare type TrackData = {
    [index: string]: any
}

declare type InilialzeConfig = {
    retry?: number,
    interval?: number,
    groupMaxLength?: number,
    sender?: Sender,
    timestampKey?: string,
    queueMaxLength?: number,
    failedQueueMaxLength?: number
}

declare type Timer = any
