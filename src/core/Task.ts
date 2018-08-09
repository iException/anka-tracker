export enum TASK_STATUS {
    SUCCESS = -1,
    PENDING,
    FAILED
}
export class Task {
    private _id: string
    public data: {}
    public status: number
    public timestamp?: number

    constructor (trackData: TrackData) {
        const now = Date.now()
        this._id = Math.random().toString(16).replace('.', '')
        this.status = TASK_STATUS.PENDING
        this.data = trackData
        this.timestamp = now
    }

    isSucceed () {
        this.status = TASK_STATUS.SUCCESS
    }

    isFailed () {
        this.status++
    }
}