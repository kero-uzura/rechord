import React, { Component }          from "react"
import { EditorState, ContentState } from "draft-js"
import { Link }                      from "react-router-dom"

import Score              from "../../Score"
import UpdateControl      from "./UpdateControl"
import Field              from "../../shared/Field"
import scoreDecorator     from "../../../decorators/scoreDecorator"
import * as api           from "../../../api"
import * as utils         from "../../../utils"
import { DEFAULT_VOLUME } from "../../../constants"

export default class EditScore extends Component {
  constructor(props) {
    super(props)
    const { currentUser } = props
    this.state = {
      loading:   true,
      error:     "",
      isPlaying: false,
      volume:    DEFAULT_VOLUME,
      userId:    currentUser && currentUser.id
    }
  }
  componentDidMount() {
    const { token } = this.props.match.params
    api.editScore(
      { token },
      (success) => {
        const { score } = success.data
        const contentState = ContentState.createFromText(score.content)
        utils.setTitle(score.title)
        this.setState({
          loading:        false,
          error:          "",
          inputText:      score.content,
          editorState:    EditorState.createWithContent(contentState, scoreDecorator),
          title:          score.title,
          enabledClick:   score.click,
          bpm:            score.bpm,
          beat:           score.beat,
          status:         score.status,
          instrumentType: score.instrument,
          token:          score.token,
        })
      },
      (error) => this.setState({ loading: false, error: error.response.data })
    )
  }

  setEditorState = (inputText) => {
    const contentState = ContentState.createFromText(inputText)
    return EditorState.push(this.state.editorState, contentState)
  }
  setInputText = (nextInputText, setEditorState = true) => {
    this.handleSetState({ inputText: nextInputText })
    if (setEditorState) {
      this.setState({ editorState: this.setEditorState(nextInputText) })
    }
  }

  handleSetTitle = (e) => this.handleSetState({ title: e.target.value })
  handleSetState = (newState) => this.setState(newState)

  render() {
    const {
      loading, error,
      inputText, title, editorState, beat, bpm, volume, instrumentType,
      isPlaying, enabledClick, status, userId, token
    } = this.state
    const showPath = `/${token}`
    return (
      <div>
        <p>
          <Link to={showPath} className="button" style={{ marginBottom: "2rem" }}>
            <span className="icon">
              <i className="fa fa-undo" />
            </span>
            <span>back</span>
          </Link>
        </p>

        {!loading && (
          error ? (
            <div>{error}</div>
          ) : (
            <div>
              <Field label="Title">
                <input
                  className="input"
                  type="text"
                  placeholder="title"
                  value={title}
                  onChange={this.handleSetTitle}
                />
              </Field>
              <Score
                inputText={inputText}
                editorState={editorState}
                instrumentType={instrumentType}
                beat={beat}
                bpm={bpm}
                volume={volume}
                enabledClick={enabledClick}
                isPlaying={isPlaying}
                setInputText={this.setInputText}
                handleSetState={this.handleSetState}
              />
              <UpdateControl
                title={title}
                content={inputText}
                instrument={instrumentType}
                beat={beat}
                bpm={bpm}
                click={enabledClick}
                status={status}
                userId={userId}
                token={token}
                handleSetState={this.handleSetState}
              />
            </div>
          )
        )}
      </div>
    )
  }
}