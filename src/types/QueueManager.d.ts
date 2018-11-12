import { Initializer } from './Initializer'

export declare interface TaskConfig {
    type: string
    data: any
}

/**
 * Class 任务队列管理器
 * 管理器不考虑任务执行细节，以及何时暂停
 */
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

    /**
     * 初始化任务队列管理器
     */
    init (config: { sender: Sender, store?: Store }): void

    /**
     * 将任务推入队列
     * @param task
     */
    push (task: Task): void

    /**
     * 插队执行任务。不计入队列，不论成败只执行一次
     * @param task Task
     */
    intrude (task: Task): void

    /**
     * 取出任务执行
     */
    pop (): Task[]

    /**
     * 更新任务缓存
     */
    updateStore (): void

    /**
     * 启动任务执行器
     */
    run (): Promise<any>
}
