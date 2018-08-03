export enum TASK_STATUS {
    PENDING,
    SUCCESS,
    FAILED
}
export class Task {
    public data: {}
    public status: number
    public timestamp?: number

    constructor (trackData: TrackData) {
        const now = Date.now()
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