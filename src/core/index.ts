import { Task } from './Task'
import { Store } from './Store'
import { Sender } from './Sender'
import { Inilialzer } from './Initializer'
import { QueueManager } from './QueueManager'

export default class Core {
    readonly config: Inilialzer
    readonly queueManager: QueueManager

    constructor (config: InilialzeConfig = {}) {
        this.config = new Inilialzer(config)
        this.queueManager = new QueueManager(this.config)
    }

    init (config: { sender: Sender, store?: Store }) {
        this.queueManager.init({
            ...this.config,
            ...config
        })
    }

    log (trackData: TrackData): void {
        this.queueManager.push(new Task(trackData))
    }
}
