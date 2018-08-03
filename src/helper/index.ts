export const objectMethodWrapper = (object: any, methodName: string, implement: Function) => {
    if (object[methodName]) {
        const originMethod = object[methodName]
        object[methodName] = function (...e: any[]) {
            implement.call(this, ...e, methodName)
            originMethod.call(this, ...e)
        }
    } else {
        object[methodName] = function (...e: any[]) {
            implement.call(this, ...e, methodName)
        }
    }
}