import ts from 'rollup-plugin-typescript'
import tslint from 'rollup-plugin-tslint'
import typescript from 'typescript'
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
    input: 'src/index.ts',
    plugins: [
        json(),
        ts({
            typescript
        }),
        resolve(),
        commonjs()
    ],
    output: {
        name: 'Tracker',
        file: 'test/tracker.js',
        format: 'umd',
        globals: {
            qs: 'qs'
        }
    }
}