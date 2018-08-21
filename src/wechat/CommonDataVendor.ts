import qs from 'qs'
import * as wechat  from './utils'
import { CommonDataVendor } from '../core/CommonDataVendor'
import { version } from '../../package.json'        // [!] (tslint plugin) FatalError: Ensure that the files supplied to lint have a .ts, .tsx, .d.ts, .js or .jsx extension.

export class WeChatCommonDataVender extends CommonDataVendor {
    getCommonData (options: {
        onLaunchOption: onLaunchOption
    }): Promise<any> {
        const { onLaunchOption = <onLaunchOption>{} } = options
        return Promise.all([
            this.getTrackId(),
            wechat.getSystemInfo(),
            wechat.getNetworkType()
        ]).then(([trackId, systemInfo, networkType]) => {
            const system = systemInfo.system.split(/\s+/)
            const query = qs.stringify(onLaunchOption.query)
            const commonData = {
                // 开发信息
                __debug: 1,            // 当前小程序是否是开发版本

                // sdk 信息
                sdk_version: version,

                // 设备相关信息
                model: systemInfo.model,
                os: system[0],
                os_version: system[1],
                network_type: networkType,
                env_version: systemInfo.version,
                ip: '',                // TODO：暂时无法得知

                // app 相关
                app_type: 'wx',        // 或者 alipay
                app_id: '',
                app_name: '',
                template_version: '',
                app_category: '',
                source: onLaunchOption.scene,
                source_path: onLaunchOption.path,
                source_app_id: onLaunchOption.referrerInfo ? onLaunchOption.referrerInfo.appId || '' : '',
                source_params: query,
                source_src_key: onLaunchOption.query ? onLaunchOption.query.src || '' : '',
                // 业务相关

                track_id: trackId
            }
            return Promise.resolve(commonData)
        })
    }

    getTrackId (): Promise<string> {
        return wechat.getStorage(this.config.trackIdKey)
            .then((trackId: string) => {
                return Promise.resolve(trackId)
            })
            .catch(err => {
                return this.setTrackId()
            })
    }

    setTrackId (): Promise<string> {
        const UUID = this.genUUId()
        return wechat.setStorage({
            key: this.config.trackIdKey,
            data: UUID
        }).then(() => {
            return Promise.resolve(UUID)
        }, () => {
            wechat.setStorage({
                key: this.config.trackIdKey,
                data: UUID
            })
            return Promise.resolve(UUID)
        })
    }

    genUUId () {
        return '' + Date.now() + '-' +
            Math.floor(1e7 * Math.random()) + '-' +
            Math.random().toString(16).replace('.', '') + '-' +
            String(Math.random() * 31242).replace('.', '').slice(0, 8)
    }
}
