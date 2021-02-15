import React, { Component } from "react"

import ScoreEditor       from "./ScoreEditor"
import UndoControl       from "./UndoControl"
import KeyControl        from "./KeyControl"
import ClearButton       from "./ClearButton"
import SetSampleButton   from "./SetSampleButton"
import InstrumentControl from "./InstrumentControl"
import BeatControl       from "./BeatControl"
import BpmControl        from "./BpmControl"
import CapoControl       from "./CapoControl"
import ClickControl      from "./ClickControl"
import LoopControl       from "./LoopControl"
import VolumeControl     from "./VolumeControl"
import SoundControl      from "./SoundControl"
import ErrorBoundary     from "../commons/ErrorBoundary"
import Button            from "../commons/Button"
import { validate }      from "./validate"
import { scoreMaker }    from "../../utils/scoreMaker"
import * as decorator    from "../../decorators/scoreEditorDecorator"
import scoreToMidi       from "../../utils/scoreToMidi"

export default class Score extends Component {
  constructor(props) {
    super(props)
    const { beat, inputText, bpm } = props
    const parsedText = decorator.parseChordProgression(inputText)
    const score      = beat && parsedText && scoreMaker(parsedText, beat)
    const isValid    = score && validate(score, bpm)
    this.state = { score, isValid }
  }
  componentWillReceiveProps({ inputText, beat, bpm }) {
    if (bpm !== this.props.bpm) {
      const { score } = this.state
      const isValid = validate(score, bpm)
      this.setState({ score, isValid })
      this.props.handleSetState({ isValid })
    }
    if (inputText !== this.props.inputText || beat !== this.props.beat) {
      const parsedText = decorator.parseChordProgression(inputText)
      const score = beat && parsedText && scoreMaker(parsedText, beat)
      const isValid = validate(score, this.props.bpm)
      this.setState({ score, isValid })
      this.props.handleSetState({ isValid })
    }
  }
  handleChangeEditorState = (editorState) => {
    this.props.handleSetState({ editorState }, false)
    this.props.setInputText(editorState.getCurrentContent().getPlainText(), false)
  }
  handleClickToMidi = () => {
    const { title, bpm } = this.props
    const { score } = this.state

    if (!score) return

    const buffer = scoreToMidi(score, { tempo: bpm })
    const url = URL.createObjectURL(new Blob([buffer], { type: 'audio/midi'}))
    const link = document.createElement('a')
    link.href = url
    link.download = `${title || 'rechord'}.mid`
    link.click()

    URL.revokeObjectURL(url)
  };

  render() {
    const {
      hideLabel, inputText, editorState, beat, bpm, capo, volume, loop,
      instrumentType, enabledClick, isPlaying, handleSetState, setInputText, errors
    } = this.props
    const { score, isValid } = this.state

    return (
      <div className="field" style={{ paddingBottom: "1.5rem" }}>
        {!hideLabel && (
          <label className="label">Score</label>
        )}
        <div className="control">
          <div className="columns">
            <div className="column control">
              <ScoreEditor
                validate
                inputText={inputText}
                editorState={editorState}
                errors={errors}
                handleSetState={handleSetState}
                handleChangeEditorState={this.handleChangeEditorState}
                readOnly={isPlaying}
              />
            </div>

            <div className="column score-controls">
              <div className="columns">
                <div className="column editor-control">
                  <UndoControl
                    editorState={editorState}
                    handleChangeEditorState={this.handleChangeEditorState}
                    disabled={isPlaying}
                  />
                  <KeyControl
                    inputText={inputText}
                    setInputText={setInputText}
                    disabled={isPlaying}
                  />
                  <ClearButton
                    setInputText={setInputText}
                    disabled={isPlaying}
                  />
                  <SetSampleButton
                    setInputText={setInputText}
                    disabled={isPlaying}
                  />
                </div>

                <div className="column">
                  <InstrumentControl
                    instrumentType={instrumentType}
                    handleSetState={handleSetState}
                    disabled={isPlaying}
                  />
                  <BeatControl
                    beat={beat}
                    handleSetState={handleSetState}
                    disabled={isPlaying}
                  />
                  <BpmControl
                    bpm={bpm}
                    handleSetState={handleSetState}
                  />
                  <CapoControl
                    capo={capo}
                    handleSetState={handleSetState}
                  />
                </div>
              </div>
              <ErrorBoundary>
                <SoundControl
                  instrumentType={instrumentType}
                  beat={beat}
                  bpm={bpm}
                  capo={capo}
                  loop={loop}
                  volume={volume}
                  enabledClick={enabledClick}
                  score={score}
                  isValid={isValid}
                  isPlaying={isPlaying}
                  handleSetState={handleSetState}
                />
              </ErrorBoundary>
              <div className="columns play-control">
                <div className="column">
                  <ClickControl
                    enabledClick={enabledClick}
                    handleSetState={handleSetState}
                  />
                </div>
                <div className="column">
                  <LoopControl
                    loop={loop}
                    handleSetState={handleSetState}
                  />
                </div>
              </div>
              <VolumeControl
                volume={volume}
                handleSetState={handleSetState}
              />
              <Button onClick={this.handleClickToMidi} text='Download MIDI' />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
