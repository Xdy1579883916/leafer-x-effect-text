// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',
    pnpm: false,
    rules: {
      'ts/explicit-function-return-type': 'off',
      'ts/no-unused-expressions': 'off',
      'no-cond-assign': 'off',
      'no-console': 'off',
      'jsdoc/check-param-names': 'off',
    },
  },
)
