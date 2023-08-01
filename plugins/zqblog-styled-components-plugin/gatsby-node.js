exports.onCreateBabelConfig = function(_ref2, pluginOptions) {
  const stage = _ref2.stage,
    actions = _ref2.actions
  const ssr = stage === 'build-html' || stage === 'build-javascript'
  const { disableVendorPrefixes, ...babelOptions } = pluginOptions
  actions.setBabelPlugin({
    name: 'babel-plugin-styled-components',
    stage: stage,
    options: {
      ...babelOptions,
      ssr,
    },
  })
}
