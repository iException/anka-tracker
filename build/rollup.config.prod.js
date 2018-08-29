import uglify from 'rollup-plugin-uglify-es'
import banner from 'rollup-plugin-license'
import rollupConfig from './rollup.config.base'
import { version, license, homepage } from '../package.json'

export default Object.assign(rollupConfig, {
    plugins: rollupConfig.plugins.concat([
        uglify(),
        banner({
            banner: '@anka-dev/tracker.' + '\r\n' +
             'V' + version + '\r\n' +
             new Date() + '\r\n' +
             homepage + '\r\n' +
             license + ' License'
        })
    ]),
    output: Object.assign(rollupConfig.output, {
        file: 'dist/anka-tracker.min.js'
    })
})
