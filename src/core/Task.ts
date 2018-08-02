export enum TASK_STATUS {
    PENDING,
    SUCCESS,
    FAILED
}
export class Task {
    public data: Object
    public status: number

    constructor (trackData: TrackData) {
        this.status = TASK_STATUS.PENDING
        this.data = trackData
    }

    isSucceed () {
        this.status = TASK_STATUS.SUCCESS
    }

    isFailed () {
        this.status++
    }
}