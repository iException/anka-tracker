
export default {
    DEBUG: false,

    enableDebug () {
        this.DEBUG = true
    },

    log (...e: string[]): void {
        console.log(...e)
    }
}