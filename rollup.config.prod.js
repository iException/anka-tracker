import ts from 'rollup-plugin-typescript'
import { uglify } from 'rollup-plugin-uglify'
import banner from 'rollup-plugin-license'
import tslint from 'rollup-plugin-tslint'
import typescript from 'typescript'
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
    input: 'src/index.ts',
    plugins: [
        ts({
            typescript
        }),
        uglify(),
        banner({
            banner: `Tracker. \n${ new Date() } \n MIT License.`
        }),
        resolve(),
        commonjs()
    ],
    sourceMap: false,
    moduleName: 'Tracker',
    targets: [
        { dest: 'dist/index.min.js', format: 'umd' }
    ]
}