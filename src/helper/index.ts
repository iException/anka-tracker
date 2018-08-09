export default {
    DEBUG: true,

    log (...e: any[]): void {
        this.DEBUG && console.log('[ 🔍 tracker]', ...e)
    }
}