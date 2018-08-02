declare type TrackData = any

declare interface TaskConfig {
    type: string
    data: any
}

declare interface InilialzeConfig {
    retry?: number,
    interval?: number,
    groupMaxLength?: number,
    sender?: Sender
}

declare namespace wx {
    export function request(options: any): void
    export function setStorage(options: any): void
    export function getStorage(options: any): void
}

declare let Page: (page: any) => void
declare let getApp: () => any