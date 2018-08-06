import { Task } from './Task'
import { Store } from './Store'
import { Sender } from './Sender'
import { Inilialzer } from './Initializer'
import { QueueManager } from './QueueManager'

export default class Core {
    readonly config: Inilialzer
    readonly queueManager: QueueManager

    constructor (config: Inilialzer) {
        this.config = config
        this.queueManager = new QueueManager(this.config)
    }

    init (config: { sender: Sender, store?: Store }) {
        // config.sender.
        this.queueManager.init({
            ...config
        })
    }

    log (trackData: Task): void {
        this.queueManager.push(trackData)
    }
}
