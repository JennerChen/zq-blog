import Typography from 'typography'
//import Wordpress2016 from 'typography-theme-wordpress-2016'
import githubTheme from 'typography-theme-github'
githubTheme.overrideThemeStyles = () => ({
  'a.gatsby-resp-image-link': {
    boxShadow: 'none',
  },
  '.gatsby-resp-image-wrapper': {
    maxWidth: '800px'
  }
})

delete githubTheme.googleFonts

const typography = new Typography(githubTheme)

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
