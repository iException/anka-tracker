export abstract class CommonDataVendor {
    static TRACK_ID_KEY = 'bx_track_id'

    /**
     * 0 可选，1 必选
     */
    static dataScheme = {
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
        ip: 0,
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
    }

    abstract getCommonData (config: {
        onLaunchOption: onLaunchOption
    }): Promise<any>
    abstract getTrackId (): Promise<string>
    abstract setTrackId (): Promise<string>
    abstract genUUId (): string
    // abstract static validate (data: any): Object

    static validate (data: any): Object {
        const result = {
            required: <string[]>[],
            optional: <string[]>[]
        }
        const dataScheme = <any>this.dataScheme
        for (let key in dataScheme) {
            if (dataScheme.hasOwnProperty(key) && !data[key]) {
                result[dataScheme[key] === 1 ? 'required' : 'optional'].push(key)
            }
        }
        return result
    }
}