import uglify from 'rollup-plugin-uglify-es'
import banner from 'rollup-plugin-license'
import rollupConfig from './rollup.config.base'

export default Object.assign(rollupConfig, {
    plugins: rollupConfig.plugins.concat([
        uglify(),
        banner({
            banner: `@anka-dev/tracker. \n${ new Date() } \n MIT License.`
        })
    ]),
    output: Object.assign(rollupConfig.output, {
        file: 'dist/anka-tracker.min.js'
    })
})
