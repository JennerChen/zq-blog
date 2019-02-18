import React from 'react'
import { insertScript, removeScript, checkIsBlockByGFW } from './utils'
import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
    from{
        opacity: 0;
        transform: scaleY(0);
    }
    
    to{
        opacity: 1;
        transform: scaleY(1);
    }
`

const AlertContainer = styled.div`
  color: #a94442;
  background-color: #f2dede;
  border-color: #ebccd1;
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  border-radius: 4px;
  animation: ${fadeIn} 0.6s;
  transform-origin: top;
  & code {
    background-color: #efefef;
    border-radius: 4px;
  }
`

export class DiscussionEmbed extends React.Component {
  state = {
    blockByGFW: false,
  }

  componentWillMount() {
    if (
      typeof window !== 'undefined' &&
      window.disqus_shortname &&
      window.disqus_shortname !== this.props.shortname
    )
      this.cleanInstance()
  }

  componentDidMount() {
    this.loadInstance()
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.shortname !== nextProps.shortname) return true
    if (nextState.blockByGFW !== this.state.blockByGFW) return true

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
      .then(() => {
        this.setState({
          blockByGFW: false,
        })
        this._loadInstance()
      })
      .catch(() => {
        this.setState({
          blockByGFW: true,
        })
      })
  }

  _loadInstance() {
    const doc = window.document
    if (window && window.DISQUS && doc.getElementById('dsq-embed-scr')) {
      window.DISQUS.reset({
        reload: true,
        config: this.getDisqusConfig(this.props.config),
      })
    } else {
      window.disqus_config = this.getDisqusConfig(this.props.config)
      window.disqus_shortname = this.props.shortname
      insertScript(
        `https://${this.props.shortname}.disqus.com/embed.js`,
        'dsq-embed-scr',
        doc.body
      )
    }
  }

  cleanInstance() {
    const doc = window.document
    removeScript('dsq-embed-scr', doc.body)
    if (window && window.DISQUS) window.DISQUS.reset({})

    try {
      delete window.DISQUS
    } catch (error) {
      window.DISQUS = undefined
    }
    const disqusThread = doc.getElementById('disqus_thread')
    if (disqusThread) {
      while (disqusThread.hasChildNodes())
        disqusThread.removeChild(disqusThread.firstChild)
    }
  }

  getDisqusConfig(config) {
    return function() {
      this.page.identifier = config.identifier
      this.page.url = config.url
      this.page.title = config.title
      this.callbacks.onNewComment = [config.onNewComment]
    }
  }

  render() {
    return (
      <>
        {this.state.blockByGFW ? (
          <AlertContainer>
            由于
            <a
              href={
                'https://zh.wikipedia.org/wiki/%E9%98%B2%E7%81%AB%E9%95%BF%E5%9F%8E'
              }
              target={'_blank'}
            >
              中国政策GFW
            </a>
            , 评论系统无法使用。
            <p>
              你可以使用vpn代理域名 <code>*.disqus.com</code>下所有请求, 然后
              <a
                href={'javascript:void(0);'}
                onClick={() => this.loadInstance()}
              >
                点击这里
              </a>
              即可重新加载评论
            </p>
          </AlertContainer>
        ) : null}
        <div id="disqus_thread" />
      </>
    )
  }
}
