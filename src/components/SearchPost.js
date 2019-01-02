import React, { Component, createRef } from 'react'
import { Index } from 'elasticlunr'
import { graphql, Link, StaticQuery } from 'gatsby'
import styled from 'styled-components'
import Tag from './Tag'

const SearchBox = styled.div`
  position: sticky;
  background: #f2f2f2;
  width: calc(100%);
  margin: 20px auto;
  height: 80px;
  top: 0;
  z-index: 10;
`

const SearchIcon = styled.svg.attrs({
  viewBox: '0 0 48 48',
})`
  margin: auto 0;
  position: absolute;
  height: 50px;
  fill: #b2afaf;
  top: 0;
  bottom: 0;
  left: 20px;
  right: 0;
  fill: #b2afaf;
`

const CloseIcon = styled.svg.attrs({
  viewBox: '0 0 24 24',
})`
  margin: auto 0;
  position: absolute;
  height: 50px;
  fill: #b2afaf;
  top: 0;
  bottom: 0;
  right: 20px;
  cursor: pointer;
`

const SearchInput = styled.input`
  width: calc(100%);
  line-height: 80px;
  font-size: 30px;
  max-height: 90px;
  border: 0;
  padding: 0 2vw;
  font-weight: 300;
  color: #b2afaf;
  padding-left: 80px;
  background: transparent;
`

const PopupLayer = styled.div`
  position: absolute;
  width: 100%;
  min-height: 100px;
  border: 1px solid #f2f2f2;
  background-color: #fff;
  left: 0;
  top: 100%;
  box-shadow: rgba(57, 63, 72, 0.3) 0px 3px 5px -2px;
  max-height: 500px;
  overflow: auto;
`

const SearchArticleItem = styled.div`
  padding: 5px 12px;
  &:hover {
    background-color: #f7f7f7;
  }
`

class BoxInner extends Component {
  constructor(props) {
    super(props)
    this.container = createRef()
    this.state = {
      query: ``,
      results: [],
      overlay: false,
    }
  }

  componentDidMount() {
    document.body.addEventListener('click', this.closePopLayer)
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.closePopLayer)
  }

  closePopLayer = ({ target }) => {
    if (this.container.current.contains(target)) {
      console.log(22)
    } else {
      this.setState({
        overlay: false,
        query: '',
        results: [],
      })
    }
  }

  getOrCreateIndex = () =>
    this.index
      ? this.index
      : // Create an elastic lunr index and hydrate with graphql query results
        Index.load(this.props.data)

  handleChangeInput = ({ target: { value } }) => {
    this.index = this.getOrCreateIndex()

    this.setState({
      query: value,
      // Query the index with search string to get an [] of IDs
      results: this.index
        .search(value, {})
        // Map over each ID and return the full document
        .map(({ ref }) => this.index.documentStore.getDoc(ref)),

      overlay: true,
    })
  }

  render() {
    const { query, results, overlay } = this.state
    console.log(results)
    return (
      <SearchBox ref={this.container}>
        <SearchIcon>
          <path d="M31 28h-1.59l-.55-.55C30.82 25.18 32 22.23 32 19c0-7.18-5.82-13-13-13S6 11.82 6 19s5.82 13 13 13c3.23 0 6.18-1.18 8.45-3.13l.55.55V31l10 9.98L40.98 38 31 28zm-12 0c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z" />
        </SearchIcon>

        <CloseIcon>
          <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
        </CloseIcon>

        <SearchInput
          value={query}
          placeholder={'请输入主题...'}
          onChange={this.handleChangeInput}
        />

        {overlay ? (
          <PopupLayer>
            {results.map(({ id, slug, tags, title }) => (
              <SearchArticleItem key={id}>
                <div>
                  <Link to={slug}>{title}</Link>
                </div>
                <div>
                  {tags.map(tag => (
                    <Tag key={tag} label={tag} style={{ marginBottom: 0 }} />
                  ))}
                </div>
              </SearchArticleItem>
            ))}

            {results.length === 0 ? (
              <p style={{ textAlign: 'center', margin: '20px 0' }}>
                找不到&nbsp;&nbsp;
                <span style={{ color: 'red', fontSize: '1.4em' }}>{query}</span>
                &nbsp;&nbsp;的结果
              </p>
            ) : null}
          </PopupLayer>
        ) : null}
      </SearchBox>
    )
  }
}
// Search component
export default class Search extends Component {
  render() {
    return (
      <StaticQuery
        query={graphql`
          query {
            siteSearchIndex {
              index
            }
          }
        `}
        render={data => (
          <BoxInner {...this.props} data={data.siteSearchIndex.index} />
        )}
      />
    )
  }
}
