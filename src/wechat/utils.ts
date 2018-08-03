declare interface RequestPramas {
    url: string,
    data?: Object,
    method: string,
    header?: Object,
    dataType?: string,
    responseType?: string
}

declare interface SetStorageParams {
    key: string,
    data: Object | string
}

declare interface GetStorageParams {
    key: string
}

/**
 * WeChat HTTP 请求
 * @param requestPramas
 */
export function request (requestPramas: RequestPramas): Promise<any> {
    return new Promise((resolve, reject) => {
        wx.request({
            ...requestPramas,
            success: (res: any) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve && resolve(res.data)
                } else {
                    reject && reject(res.data)
                }
            },
            fail: (err: Error) => {
                reject && reject(err)
            }
        })
    })
}

/**
 * 将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个异步接口。
 * @param pramas
 */
export function setStorage (pramas: SetStorageParams): Promise<any> {
    return new Promise((resolve, reject) => {
        wx.setStorage({
            ...pramas,
            success: (res: any): void => {
                resolve(res)
            },
            fail: (err: Error): void => {
                reject(err)
            }
        })
    })
}

/**
 * 从本地缓存中异步获取指定 key 对应的内容
 * @param pramas
 */
export function getStorage (pramas: GetStorageParams): Promise<any> {
    return new Promise((resolve, reject) => {
        wx.getStorage({
            ...pramas,
            success: (res: any): void => {
                resolve(res.data)
            },
            fail: (err: Error): void => {
                reject(err)
            }
        })
    })
}

/**
 * 获取系统信息。
 */
export function getSystemInfo (): Promise<any> {
    return new Promise((resolve, reject) => {
        wx.getSystemInfo({
            success: (res: any): void => {
                resolve(res)
            },
            fail: (err: Error): void => {
                reject(err)
            }
        })
    })
}

/**
 * 获取网络类型。
 */
export function getNetworkType (): Promise<any> {
    return new Promise((resolve, reject) => {
        wx.getNetworkType({
            success: (res: any): void => {
                resolve(res.networkType)
            },
            fail: (err: Error): void => {
                reject(err)
            }
        })
    })
}

/**
 * 监听网络状态变化。
 * @param callback
 */
export function onNetworkStatusChange (callback: Function): void {
    wx.onNetworkStatusChange(callback)
}