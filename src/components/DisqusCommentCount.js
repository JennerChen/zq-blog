import React, { Component } from 'react'
import Helmet from 'react-helmet'

/**
 * see https://zqblog-1.disqus.com/admin/settings/universalcode/
 * Append #disqus_thread to the href attribute in your links.
 * This will tell Disqus which links to look up and return the comment count.
 * For example: <a href="http://foo.com/bar.html#disqus_thread">Link</a>.
 */
export default class extends Component {

  render() {
    return (
      <Helmet>
        <script
          id={'dsq-count-scr'}
          src={'//zqblog-1.disqus.com/count.js'}
          async={true}
        />
      </Helmet>
    )
  }
}
