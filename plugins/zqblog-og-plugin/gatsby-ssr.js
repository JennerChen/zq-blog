const react = require('react')

exports.onRenderBody = (
  { setHeadComponents },
  {
    cache_busting_mode: cacheBusting,
    icon,
  }
) => {


  setHeadComponents([
    react.createElement('meta', {
      key: 'og-image',
      property: 'og:image',
      content: '/icons/icon-256x256.png',
    }),
  ])
}
