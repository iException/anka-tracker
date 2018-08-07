import { Task } from './Task'

export interface Sender {
    url: string
    commonData: Object

    send (task: Task): Promise<Task>
}
