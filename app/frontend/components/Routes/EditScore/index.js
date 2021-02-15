import React, { Component }          from "react"
import { EditorState, ContentState } from "draft-js"
import classNames                    from "classnames"

import Score                  from "../../Score"
import TitleControl           from "../../TitleControl"
import UpdateControl          from "./UpdateControl"
import scoreDecorator         from "../../../decorators/scoreDecorator"
import * as api               from "../../../api"
import * as utils             from "../../../utils"
import * as path              from "../../../utils/path"
import * as localStorageState from "../../../utils/localStorageState"
import { DEFAULT_BPM, DEFAULT_VOLUME, DEFAULT_INSTRUMENT_TYPE } from "../../../constants"

export default class EditScore extends Component {
  constructor(props) {
    super(props)
    const { currentUser } = props
    this.state = {
      loading:        true,
      editorState:    EditorState.createEmpty(),
      isPlaying:      false,
      capo:           0,
      loop:           false,
      volume:         DEFAULT_VOLUME,
      bpm:            DEFAULT_BPM,
      instrumentType: DEFAULT_INSTRUMENT_TYPE,
      userId:         currentUser && currentUser.id,
      errors:         {},
      isValid:        false
    }
  }
  componentDidMount() {
    const tempState = localStorageState.get("editScore")
    if (tempState) {
      this.setTempState(tempState)
    } else {
      const { token } = this.props.match.params
      api.editScore(
        { token },
        ({ data: { score } }) => {
          const contentState = ContentState.createFromText(score.content)
          utils.setMeta(score.title, "", this.props.history)
          this.setState({
            loading:        false,
            inputText:      score.content,
            editorState:    EditorState.createWithContent(contentState, scoreDecorator),
            title:          score.title,
            enabledClick:   score.click,
            bpm:            score.bpm,
            beat:           score.beat,
            capo:           score.capo,
            loop:           score.loop,
            status:         score.status,
            instrumentType: score.instrument,
            token:          score.token
          })
        },
        (errors) => this.props.history.push(path.root, utils.setFlashError(errors))
      )
    }
  }
  setTempState = (tempState) => {
    const { token } = this.props.match.params
    const contentState = ContentState.createFromText(tempState.inputText)
    const editorState  = EditorState.createWithContent(contentState, scoreDecorator)
    this.setState(Object.assign({ loading: false, token, editorState }, tempState))
    utils.setMeta(tempState.title, "", this.props.history)
    localStorageState.remove("editScore")
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
  handleSetState = (newState) => this.setState(newState)

  render() {
    const {
      loading, errors, inputText, title, editorState, beat, bpm, capo, volume, loop,
      instrumentType, isPlaying, enabledClick, status, userId, token, isValid
    } = this.state
    return (
      <div className={classNames({ "loading-wrapper": loading })}>
        <TitleControl
          title={title}
          errors={errors}
          handleSetState={this.handleSetState}
        />
        <Score
          inputText={inputText}
          editorState={editorState}
          instrumentType={instrumentType}
          beat={beat}
          bpm={bpm}
          capo={capo}
          loop={loop}
          volume={volume}
          title={title}
          enabledClick={enabledClick}
          isPlaying={isPlaying}
          errors={errors}
          setInputText={this.setInputText}
          handleSetState={this.handleSetState}
        />
        <UpdateControl
          title={title}
          content={inputText}
          instrument={instrumentType}
          beat={beat}
          bpm={bpm}
          capo={capo}
          loop={loop}
          click={enabledClick}
          status={status}
          userId={userId}
          token={token}
          isValid={isValid}
          handleSetState={this.handleSetState}
        />
      </div>
    )
  }
}
