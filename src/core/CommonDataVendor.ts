export interface CommonDataVendor {
    TRACK_ID_KEY: string,
    dataScheme: Object,
    getCommonData (config: {
        onLaunchOption: onLaunchOption
    }): Promise<any>,
    getTrackId (): Promise<string>,
    setTrackId (): Promise<string>,
    genUUId (): string,
    validate (data: any): Object
}