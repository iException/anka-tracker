import ts from 'rollup-plugin-typescript'
import { uglify } from 'rollup-plugin-uglify'
import banner from 'rollup-plugin-license'
import tslint from 'rollup-plugin-tslint'
import typescript from 'typescript'

export default {
    input: 'src/index.ts',
    plugins: [
        ts({
            typescript
        }),
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