import { resolve } from "path";

declare interface RequestPramas {
    url: string,
    data?: Object,
    method: string,
    header?: Object,
    dataType?: string,
    responseType?: string
}

declare interface StorageParams {
    key: string,
    data?: Object | string
}

/**
 * WeChat HTTP 请求
 * @param RequestPramas
 */
export const request = (requestPramas: RequestPramas): Promise<any> => {
    return new Promise((resolve, reject) => {
        wx.request({
            ...requestPramas,
            success (res: any) {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve && resolve(res.data)
                } else {
                    reject && reject(res.data)
                }
            },
            fail (err: Error) {
                reject && reject(err)
            }
        })
    })
}

export const setStorage = (pramas: StorageParams): Promise<any> => {
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

export const getStorage = (pramas: StorageParams): Promise<any> => {
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