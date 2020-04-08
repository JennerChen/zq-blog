export const pathNav = (currPath, rootPath) => {
  const pathArr = currPath.split('/')

  const rootPathArr = rootPath.split('/')

  return {
    go: function(subPath) {
      switch (subPath) {
        case undefined:
        case '':
        case '/':
          return rootPath
        case '..':
          if (pathArr.length > rootPathArr.length) {
            return pathArr.slice(0, pathArr.length - 1).join('/')
          } else {
            return rootPath
          }
        default:
          return currPath + '/' + subPath
      }
    },
  }
}
