import { Task } from './Task'

export interface Sender {
    url: string
    globalData: Object

    send (task: Task): Promise<Task>
}
