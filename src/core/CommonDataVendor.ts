export interface CommonDataVendor {
    dataScheme: Object,
    getCommonData (config: {
        onLaunchOption: onLaunchOption
    }): Promise<any>,
    validate (data: any): Object
}