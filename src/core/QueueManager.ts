import { Task } from './Task'
import { Store } from './Store'
import { Sender } from './Sender'
import { Inilialzer } from './Initializer'
import { TASK_STATUS } from './Task'

export enum QUEUE_MANAGER_STATUS {
    IDLE,
    RUNNING,
    INITIALIZING
}

export class QueueManager {
    public config: Inilialzer
    private sender: Sender
    private queue: Array<Task>
    private failedQueue: Array<Task>
    private status: number
    private store: Store
    private lastStoreUpdate: number

    constructor (config: Inilialzer) {
        this.queue = []
        this.failedQueue = []
        this.config = config
        this.status = QUEUE_MANAGER_STATUS.INITIALIZING
        this.lastStoreUpdate = 0
    }

    init (config: { sender: Sender, store?: Store }): void {
        if (this.sender === void(0)) {
            this.sender = config.sender
            this.status = QUEUE_MANAGER_STATUS.IDLE
        }
        if (this.store === void(0)) {
            this.store = config.store
        }
        if (this.store) {
            this.store.get().then(tasks => {
                this.queue.push(...tasks.map((task: Task) => new Task(task.data)))
                this.run()
            })
        } else {
            this.run()
        }
    }

    /**
     * 将任务推入队列
     * @param task
     */
    push (task: Task): void {
        if (task.status === TASK_STATUS.PENDING) {
            this.queue.push(task)
        } else if (task.status >= TASK_STATUS.FAILED && task.status <= this.config.retry) {
            this.failedQueue.push(task)
        }
        this.updateStore()
        if (this.status === QUEUE_MANAGER_STATUS.IDLE) {
            this.run()
        }
    }

    pop (): Task[] {
        const failedQueueLength = this.failedQueue.length
        const groupMaxLength = this.config.groupMaxLength
        const tasks: Task[] = failedQueueLength - groupMaxLength >= 0 ?
            this.failedQueue.splice(0, groupMaxLength) :
            this.failedQueue.splice(0, failedQueueLength - 1).concat(this.queue.splice(0, groupMaxLength - failedQueueLength))

        this.updateStore()
        return tasks
    }

    updateStore () {
        const now = Date.now()
        if (this.store && now - this.lastStoreUpdate >= 500) {
            this.store.update([...this.queue, ...this.failedQueue])
            this.lastStoreUpdate = now
        }
    }

    /**
     * 打点任务的执行者
     * 在 sender 被设置之前不会执行
     */
    run (): Promise<any> {
        const tasks = this.pop()
        if (!this.sender || tasks.length === 0) return

        this.status = QUEUE_MANAGER_STATUS.RUNNING
        // TODO：这里是否可以将多次打点数据合并发送
        return Promise.all(tasks.map(task => this.sender.send(task))).then((results: Task[]) => {
            results.forEach((task: Task)  => {
                if (task.status === TASK_STATUS.FAILED) {
                    this.push(task)
                }
            })
        }).then((): void => {
            setTimeout(() => {
                this.status = QUEUE_MANAGER_STATUS.IDLE
                this.run()
            }, this.config.interval)
        })
    }
}