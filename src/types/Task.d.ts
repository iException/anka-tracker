export declare class Task {
    protected type: string
    protected data: any
    public status: number
    constructor (data: TrackData)
}

export declare class FailedTask extends Task {
    protected errMsg: [string, Error]
}