export default {
    DEBUG: true,

    log (...e: any[]): void {
        this.DEBUG && console.log('%c[🔍 tracker]', 'color:rgba(118,147,92,1);', ...e)
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