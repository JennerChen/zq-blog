import React from 'react'
import {
  insertScript,
  removeScript,
  debounce,
  checkIsBlockByGFW,
} from './utils'

const queueResetCount = debounce(
  () => {
    if (window.DISQUSWIDGETS) window.DISQUSWIDGETS.getCount({ reset: true })
  },
  300,
  false
) // eslint-disable-line no-magic-numbers

export class CommentCount extends React.Component {
  componentDidMount() {
    this.loadInstance()
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.shortname !== nextProps.shortname) return true

    const nextConfig = nextProps.config
    const config = this.props.config
    if (
      nextConfig.url === config.url ||
      nextConfig.identifier === config.identifier
    )
      return false
    return true
  }

  componentWillUpdate(nextProps) {
    if (this.props.shortname !== nextProps.shortname) this.cleanInstance()
  }

  componentDidUpdate() {
    this.loadInstance()
  }

  loadInstance() {
    checkIsBlockByGFW()
      .then(() => this._loadInstance())
      .catch((error) => null)
  }

  _loadInstance() {
    const doc = window.document
    if (doc.getElementById('dsq-count-scr')) queueResetCount()
    else
      insertScript(
        `https://${this.props.shortname}.disqus.com/count.js`,
        'dsq-count-scr',
        doc.body
      )
  }

  cleanInstance() {
    const body = window.document.body
    removeScript('dsq-count-scr', body)

    // count.js only reassigns this window object if it's undefined.
    window.DISQUSWIDGETS = undefined
  }

  render() {
    const { style, className } = this.props
    return (
      <span
        className={'disqus-comment-count ' + (className ? className : '')}
        data-disqus-identifier={this.props.config.identifier}
        data-disqus-url={this.props.config.url}
        style={style}
      >
        {this.props.children}
      </span>
    )
  }
}
