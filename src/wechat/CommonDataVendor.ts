import qs from 'qs'
import * as wechat  from './utils'
import { CommonDataVendor } from '../core/CommonDataVendor'
import { version } from '../../package.json'        // [!] (tslint plugin) FatalError: Ensure that the files supplied to lint have a .ts, .tsx, .d.ts, .js or .jsx extension.

export const WeChatCommonDataVender: CommonDataVendor = {
    /**
     * 0 可选，1 必选
     */
    dataScheme: {
        event_type: 1,
        tracktype: 1,
        action: 1,
        timestamp_ms: 1,
        __debug: 0,
        app_type: 1,
        app_id: 1,
        app_name: 1,
        template_version: 1,
        app_category: 1,
        preview_version: 0,
        app_role: 0,
        internal_app: 0,
        track_id: 1,
        open_id: 0,
        union_id: 0,
        bx_user_id: 0,
        visitor_mobile: 0,
        distinct_id: 0,
        ip: 1,
        os: 1,
        os_version: 1,
        model: 1,
        network_type: 1,
        env_version: 0,
        source: 1,
        source_path: 1,
        source_params: 0,
        source_src_key: 0,
        source_app_id: 0,
        page_type: 1,
        page_id: 1,
        last_page_type: 0,
        last_page_id: 0,
        page_level: 1,
        sdk_version: 1
    },

    getCommonData (config: {
        onLaunchOption: onLaunchOption
    }): Promise<any> {
        const { onLaunchOption } = config
        return Promise.all([
            wechat.getSystemInfo(),
            wechat.getNetworkType()
        ]).then(([systemInfo, networkType]) => {
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
                source_app_id: onLaunchOption.referrerInfo ? onLaunchOption.referrerInfo.appId : '',
                source_params: query,
                source_src_key: onLaunchOption.query ? onLaunchOption.query.src : ''
                // 业务相关

            }
            return Promise.resolve(commonData)
        })
    },

    validate (data: any): Object {
        const result = {
            required: <string[]>[],
            optional: <string[]>[]
        }
        const dataScheme = this.dataScheme
        for (let key in dataScheme) {
            if (dataScheme.hasOwnProperty(key) && !data[key]) {
                result[dataScheme[key] === 1 ? 'required' : 'optional'].push(key)
            }
        }
        return result
    }
}