declare interface Sender {
    url: string
    commonData: Object
    send (task: Task): Promise<Task>
}