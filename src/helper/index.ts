const DEBUG = true

export function log (...e: any[]): void {
    DEBUG && console.log('[tracker]', ...e)
}