import { Initializer } from './Initializer'
import { QueueManager } from './QueueManager'

export declare class Core {
    readonly config: Initializer
    readonly queueManager: QueueManager

    constructor (config: Initializer)

    init (config: { sender: Sender, store?: Store }): void

    log (trackData: Task): void
}