import typescript from 'rollup-plugin-typescript'
import tslint from 'rollup-plugin-tslint'

export default {
    input: 'src/index.ts',
    plugins: [
        typescript(),
        tslint()
    ],
    output: {
        file: 'dist/index.js',
        format: 'umd'
    }
}