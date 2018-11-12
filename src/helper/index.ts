export default {
    DEBUG: true,

    log (...e: any[]): void {
        const time = new Date()
        const t = `${this.format(time.getHours())}:${this.format(time.getMinutes())}:${this.format(time.getSeconds())}`
        this.DEBUG && console.log(`%c[🔍 tracker] ${t}`, 'color:rgba(118,147,92,1);', ...e)
    },

    format (val: string | number = '', fixed: number = 2): string {
        return ('00' + val).slice(0 - fixed)
    }
}

/**
 * readonly 类方法/属性装饰器
 * 禁止重写实例上的方法和属性
 */
export function readonlyDecorator () {
    return function (target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) {
        propertyDescriptor.writable = false
        return propertyDescriptor
    }
}
