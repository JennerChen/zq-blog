const sheetByPathname = new Map() // eslint-disable-next-line react/prop-types,react/display-name

const styled = require('styled-components')

exports.wrapRootElement = function(_ref, pluginOptions) {
  const element = _ref.element,
    pathname = _ref.pathname
  const sheet = new styled.ServerStyleSheet()
  sheetByPathname.set(pathname, sheet)
  return element
}

exports.onRenderBody = function(_ref2) {
  var setHeadComponents = _ref2.setHeadComponents,
    pathname = _ref2.pathname
  var sheet = sheetByPathname.get(pathname)

  if (sheet) {
    setHeadComponents([sheet.getStyleElement()])
    sheetByPathname.delete(pathname)
  }
}
