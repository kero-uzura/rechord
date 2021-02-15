import React, { Component }          from "react"
import { EditorState, ContentState } from "draft-js"

import Score                  from "../../Score"
import TitleControl           from "../../TitleControl"
import CreateControl          from "./CreateControl"
import ShareModal             from "../../ShareModal"
import RestoreModal           from "./RestoreModal"
import scoreDecorator         from "../../../decorators/scoreDecorator"
import sampleScore            from "../../../constants/sampleScore"
import { window }             from "../../../utils/browser-dependencies"
import * as utils             from "../../../utils"
import * as localStorageState from "../../../utils/localStorageState"
import { DEFAULT_BPM, DEFAULT_VOLUME, DEFAULT_BEAT, DEFAULT_INSTRUMENT_TYPE } from "../../../constants"

export default class NewScore extends Component {
  constructor() {
    super()
    const { currentUser } = window.data
    let score = ""
    let inputText = ""

    // 初めての訪問の場合はサンプルを表示
    if (Object.keys(currentUser).length === 0 && !localStorageState.isVisited()) {
      score     = sampleScore
      inputText = sampleScore
      localStorageState.visit()
    }

    const contentState = ContentState.createFromText(score)
    this.state = {
      inputText,
      editorState:    EditorState.createWithContent(contentState, scoreDecorator),
      isPlaying:      false,
      volume:         DEFAULT_VOLUME,
      title:          "",
      enabledClick:   false,
      bpm:            DEFAULT_BPM,
      beat:           DEFAULT_BEAT,
      capo:           0,
      loop:           false,
      instrumentType: DEFAULT_INSTRUMENT_TYPE,
      status:         "published",
      userId:         currentUser.id,
      restoreState:   localStorageState.get(),
      errors:         {},
      isValid:        false
    }
  }
  componentDidMount = () => utils.setMeta("", "", this.props.history)

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

  handleResetLocalStorage = () => {
    this.setState({ restoreState: false })
    localStorageState.remove()
  }
  handleSetState = (newState, saveLocalStorage = true) => {
    if (saveLocalStorage) localStorageState.set(Object.assign({}, this.state, newState))
    this.setState(newState)
  }

  render() {
    const {
      inputText, title, editorState, beat, bpm, capo, loop, volume, instrumentType,
      isPlaying, enabledClick, status, userId, token, modal, restoreState,
      errors, isValid
    } = this.state
    return (
      <div>
        {!userId && (
          <article className="message is-primary">
            <div className="message-body bordered has-icon">
              <span className="icon is-large">
                <i className="fa fa-envira fa-2x" />
              </span>
              <p className="is-size-7">
                <strong>Easy to Play, Easy to Share !</strong><br />
                rechord は、テキスト入力するだけで実際に演奏もできるコード進行共有サービスです。<br />
                自由に入力し、自由に鳴らし、自由に共有してみてください。
              </p>
            </div>
          </article>
        )}

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
        <CreateControl
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
          handleResetLocalStorage={this.handleResetLocalStorage}
        />
        <ShareModal
          label="Let's share!"
          token={token}
          title={title}
          isActive={modal}
          handleSetState={this.handleSetState}
        />
        <RestoreModal
          restoreState={restoreState}
          setInputText={this.setInputText}
          handleSetState={this.handleSetState}
          handleResetLocalStorage={this.handleResetLocalStorage}
        />
      </div>
    )
  }
}
