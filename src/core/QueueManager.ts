import { Task } from './Task'
import { Store } from './Store'
import { Sender } from './Sender'
import * as helper from '../helper'
import { Initializer } from './Initializer'
import { TASK_STATUS } from './Task'

export enum QUEUE_EXECUTOR_STATUS {
    IDLE,
    PAUSE,
    RUNNING,
}

/**
 * Class 任务队列管理器
 * 管理器不考虑任务执行细节，以及何时暂停
 */
export class QueueManager {
    public config: InilialzeConfig
    private sender: Sender
    private queue: Array<Task>
    private failedQueue: Array<Task>
    private store: Store
    private lastStoreUpdate: number   // 上次缓存更新时间
    private executor: Executor

    constructor (config: InilialzeConfig) {
        this.queue = []
        this.failedQueue = []
        this.config = config
        this.lastStoreUpdate = 0
        this.executor = new Executor()
    }

    /**
     * 初始化任务队列管理器
     */
    init (config: { sender: Sender, store: Store }): void {
        if (this.sender) return
        this.store = config.store
        this.sender = config.sender
        this.executor.init(this.sender, this)
        this.store.get().then(tasks => {
            this.queue.push(...tasks.map((task: Task) => new Task(task.data)))
            this.run()
        })
    }

    /**
     * 将任务推入队列
     * @param task
     */
    push (task: Task): void {
        if (task.status === TASK_STATUS.PENDING && this.queue.length < this.config.queueMaxLength) {
            this.queue.push(task)
            this.updateStore()
            this.run()
        } else if ((task.status >= TASK_STATUS.FAILED) && (task.status <= this.config.retry)) {
            this.failedQueue.push(task)
            this.updateStore()
            this.run()
        }
    }

    /**
     * 插队执行任务。不计入队列，不论成败只执行一次
     * @param task Task
     */
    intrude (task: Task): void {
        this.sender.send(task)
    }

    /**
     * 取出任务执行
     */
    pop (): Task[] {
        const failedQueueLength = this.failedQueue.length
        const groupMaxLength = this.config.groupMaxLength
        const tasks: Task[] = failedQueueLength - groupMaxLength >= 0 ?
            this.failedQueue.splice(0, groupMaxLength) :
            this.failedQueue.splice(0, failedQueueLength).concat(this.queue.splice(0, groupMaxLength - failedQueueLength))

        this.updateStore()
        return tasks
    }

    /**
     * 更新任务缓存
     */
    updateStore (force?: boolean): void {
        const now = Date.now()
        if (this.store && now - this.lastStoreUpdate >= 500 || force && this.store) {
            this.store.update([...this.queue, ...this.failedQueue])
            this.lastStoreUpdate = now
        }
    }

    /**
     * 启动任务执行器
     */
    run (): void {
        setTimeout(this.executor.run.bind(this.executor), 0)
    }

    suspend (suspended: boolean): void {
        this.updateStore(true)
        this.executor.suspend(suspended)
    }
}

class Executor {
    status: QUEUE_EXECUTOR_STATUS
    sender: Sender
    timeoutId: Timer
    queueManager: QueueManager
    timer: Timer

    constructor () {
        this.status = QUEUE_EXECUTOR_STATUS.IDLE
    }

    get isIdle () {
        return this.sender &&
            this.queueManager &&
            this.status === QUEUE_EXECUTOR_STATUS.IDLE
    }

    init (sender: Sender, queueManager: QueueManager) {
        this.sender = sender
        this.queueManager = queueManager
    }

    run () {
        if (this.isIdle) {
            this.exec()
        }
    }

    exec () {
        const tasks = this.queueManager.pop()
        if (tasks.length) {
            this.status = QUEUE_EXECUTOR_STATUS.RUNNING
        } else {
            this.status = QUEUE_EXECUTOR_STATUS.IDLE
            return
        }
        Promise.all(tasks.map(task => this.sender.send(task)))
            .then((results: Task[]) => {
                results.forEach((task: Task)  => {
                    if (task.status !== TASK_STATUS.SUCCESS) {
                        this.queueManager.push(task)
                    }
                })
            })
            .then((): void => {
                this.timer = setTimeout(() => {
                    this.exec()
                }, this.queueManager.config.interval)
            })
    }

    suspend (pause: boolean) {
        if (pause) {
            this.status = QUEUE_EXECUTOR_STATUS.PAUSE
            // pause
            clearTimeout(this.timer)
        // 只有暂停状态时才能撤销暂停
        } else if (this.status === QUEUE_EXECUTOR_STATUS.PAUSE) {
            this.status = QUEUE_EXECUTOR_STATUS.IDLE
            // clearTimeout(this.timer)
            this.run()
        } else if (this.status === QUEUE_EXECUTOR_STATUS.IDLE) {
            this.run()
        }
    }
}
