declare type TrackData = {
    [index: string]: any
}

declare type TaskConfig = {
    type: string
    data: any
}

declare type Sender = {
    url: string
    globalData: Object
    send (task: Task): Promise<Task>
}

declare type InilialzeConfig = {
    retry?: number,
    interval?: number,
    groupMaxLength?: number,
    sender?: Sender,
    timestampKey?: string
}
