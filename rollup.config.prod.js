import typescript from 'rollup-plugin-typescript'
import { uglify } from 'rollup-plugin-uglify'
import banner from 'rollup-plugin-license'
import tslint from 'rollup-plugin-tslint'

export default {
    input: 'src/index.ts',
    plugins: [
        typescript(),
        tslint(),
        uglify(),
        banner({
            banner: `Tracker. \n${ new Date() } \n MIT License.`
        }),
    ],
    sourceMap: false,
    moduleName: 'Tracker',
    targets: [
        { dest: 'dist/index.min.js', format: 'umd' }
    ]
}