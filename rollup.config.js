import ts from 'rollup-plugin-typescript'
import tslint from 'rollup-plugin-tslint'
import typescript from 'typescript'

export default {
    input: 'src/index.ts',
    plugins: [
        ts({
            typescript
        }),
        tslint()
    ],
    output: {
        name: 'Tracker',
        file: 'test/tracker.js',
        format: 'umd'
    }
}