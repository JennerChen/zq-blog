import React, { Component, Fragment } from 'react'
import Helmet from 'react-helmet'

let PAGE_URL = null

let PAGE_IDENTIFIER = null

let PAGE_TITLE = null
if (window) {
//  window.disqus_config = function() {
//    if (PAGE_IDENTIFIER) {
//      this.page.identifier = PAGE_IDENTIFIER
//    }
//
//    if (PAGE_URL) {
//      this.page.url = PAGE_URL
//    }
//  }
}
export default class extends Component {
  constructor(props) {
    super(props)

    //    PAGE_URL = this.props

    if (this.props.identifier) {
      PAGE_IDENTIFIER = this.props.identifier
    } else {
      PAGE_IDENTIFIER = undefined
    }

    if (this.props.title) {
      PAGE_TITLE = this.props.title
    } else {
      this.page.title = undefined
    }
  }

  componentDidMount() {
    console.log(window.DISQUS);
    //    window.disqus_config = function () {
    //      this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
    //      this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    //    };
    //    let d = document,
    //      s = d.createElement('script')
    //    s.src = 'https://zqblog-1.disqus.com/embed.js'
    //    s.setAttribute('data-timestamp', +new Date())
    //    ;(d.head || d.body).appendChild(s)
    //
    //    console.log(111)
  }

  render() {
    const { style } = this.props;

//    let helmet = window.DISQUS ? null : <Helmet>
//      <script
//        async={true}
//        data-timestamp={+new Date()}
//        src={'https://zqblog-1.disqus.com/embed.js'}
//      />
//    </Helmet>



    return (
      <Fragment>
        <Helmet>
          <script
            async={true}
            data-timestamp={+new Date()}
            src={'https://zqblog-1.disqus.com/embed.js'}
          />
        </Helmet>
        <div id={'disqus_thread'} style={style} />
      </Fragment>
    )
  }
}
