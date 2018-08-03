declare class Task {
    public data: Object
    public status: number
    public timestamp: number
    constructor (data: TrackData)
    isSucceed (): void
    isFailed (): void
}

declare class FailedTask extends Task {
    protected errMsg: [string, Error]
}
