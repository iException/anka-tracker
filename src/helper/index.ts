export default {
    DEBUG: true,

    log (...e: any[]): void {
        this.DEBUG && console.log('[ 🔍 tracker]', ...e)
    }
}

export function readonlyDecorator () {
    return function (target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) {
        propertyDescriptor.writable = false
    }
}