const DEFAULT_CONFIG: InilialzeConfig = {
    debug: true,
    httpMethod: 'POST',
    retry: 2,
    interval: 1000,
    groupMaxLength: 5,
    timestampKey: 'timestamp_ms',
    trackIdKey: '__track_id',
    queueMaxLength: 500,
    commonData: {},
    dataScheme: {},
    sourceSrcKey: 'src',
    detectChanel: true,
    attachActionToUrl: false,
    extractOnLaunchOption: true
    // beforeSend: (data: TrackData): TrackData => data
}

export class Initializer implements InilialzeConfig {
    constructor (config: InilialzeConfig = {}) {
        Object.assign(this, DEFAULT_CONFIG, config)
    }
}
