export declare class QueueManager {
    private static queue
    private static failedQueue
    private static push(task: TaskConfig): void
    private static consume(): void
}