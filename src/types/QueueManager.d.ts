import { Initializer } from './Initializer'

export declare interface TaskConfig {
    type: string
    data: any
}

export declare class QueueManager {
    public config: Initializer
    private sender: Sender
    private queue: Array<Task>
    private failedQueue: Array<Task>
    private status: number
    private store: Store
    private lastStoreUpdate: number
    private pause: boolean
    constructor (config: Initializer)
    init (config: { sender: Sender, store?: Store }): void
    push (task: Task): void
    pop (): Task[]
    updateStore (): void
    run (): Promise<any>
}