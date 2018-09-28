import rollupConfig from './rollup.config.base'

export default Object.assign(rollupConfig, {
    output: Object.assign(rollupConfig.output, {
        file: 'test/miniGame/anka-tracker.js'
    })
})
