import React, { Component } from "react"
import classNames           from "classnames"
import * as qs              from "qs"
import SortSelect           from "./SortSelect"
import OptionCheckbox       from "./OptionCheckbox"
import ScoresResults        from "./ScoresResults"
import UsersResults         from "./UsersResults"
import { setTitle }         from "../../../utils"
import * as api             from "../../../api"
import * as path            from "../../../utils/path"

export default class CardsList extends Component {
  constructor(props) {
    super(props)
    const query = qs.parse(props.location.search.substr(1))
    this.state = {
      query,
      result:  [],
      loading: true
    }
    this.handleSearch(props.type, this.state.query)
  }
  componentDidMount = () => {
    const { word } = this.state
    const { label, history } = this.props
    const title = word ? `検索: ${word}` : `${label}一覧`
    setTitle(title, history)
  }
  handleSearch = (type, query) => (
    api[type](
      { query: qs.stringify(query) },
      (success) => {
        const { result, total_count: totalCount, current_page: currentPage, total_pages: totalPages } = success.data
        this.setState({ result, totalCount, currentPage, totalPages, loading: false })
      },
      () => this.props.history.push(path.root, { flash: ["error", "読み込みに失敗しました。"] })
    )
  )
  handlePush = (type, query) => {
    const searchPath = path.search(type, qs.stringify(query))
    this.props.history.push(searchPath)
  }

  updateQuery = (params) => {
    this.setState({ query: Object.assign({}, this.state.query, params) })
  }
  handleInputWord = (e) => this.updateQuery({ word: e.target.value })
  handleKeyDown = (e) => {
    if (e.keyCode === 13) this.handlePush(this.props.type, this.state.query)
  }
  handleChangeOption = (key, value) => {
    const { query } = this.state
    query[key] = value
    this.handlePush(this.props.type, query)
  }

  render() {
    const { query, result, totalCount, currentPage, totalPages, loading } = this.state
    const { word, sort } = query
    const { type, options } = this.props
    const searchResult = () => {
      switch (type) {
        case "scores": return <ScoresResults word={word} scores={result} />
        case "users":  return <UsersResults  word={word} users={result} />
        default:       return ""
      }
    }
    const renderOptions = () => (
      options.map(option => (
        <OptionCheckbox
          key={option.key}
          option={option}
          value={query[option.key]}
          handleChangeOption={this.handleChangeOption}
        />
      ))
    )
    const renderPageCount = () => {
      const perPage = 50
      const currentCount = totalPages > 1 ? (
        <span>
          <span>{(perPage * (currentPage - 1)) + 1} - {perPage * currentPage}</span>
          <span className="separator">/</span>
          <strong>{totalCount}</strong>
        </span>
      ) : (
        <strong>{result.length}</strong>
      )
      return (
        <span>
          {currentCount}
          <span className="unit">{type}</span>
        </span>
      )
    }
    return (
      <div className={classNames("search", { "loading-wrapper": loading })}>
        <div className="field is-grouped search-control">
          <div className="control search-input has-icons-left">
            <span className="icon is-left">
              <i className="fa fa-search" />
            </span>
            <input
              className="input"
              type="text"
              placeholder="search..."
              value={word || ""}
              onChange={this.handleInputWord}
              onKeyDown={this.handleKeyDown}
            />
          </div>
          <div className="control is-hidden-mobile has-icons-left">
            <SortSelect sort={sort} type={type} handleChangeOption={this.handleChangeOption} />
          </div>
          <div className="control options is-hidden-mobile">
            {renderOptions()}
          </div>
          <div className="control hits is-hidden-mobile">
            {renderPageCount()}
          </div>
        </div>

        <div className="field is-grouped is-only-mobile">
          <div className="control has-icons-left">
            <SortSelect sort={sort} type={type} handleChangeOption={this.handleChangeOption} />
          </div>
          <div className="control options">
            {renderOptions()}
          </div>
          <div className="control hits">
            {renderPageCount()}
          </div>
        </div>

        {searchResult()}
      </div>
    )
  }
}
