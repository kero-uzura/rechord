import React, { Component } from "react"

import SelectField      from "../../commons/SelectField"
import * as instruments from "../../../constants/instruments"

export default class InstrumentControl extends Component {
  handleChangeInstrument = (e) => {
    this.props.handleSetState({ instrumentType: e.target.value })
  }
  render() {
    const { instrumentType, disabled } = this.props
    return (
      <SelectField icon="music" customClass="instrument-control">
        <select
          value={instrumentType}
          onChange={this.handleChangeInstrument}
          disabled={disabled}
        >
          {Object.keys(instruments.types()).map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </SelectField>
    )
  }
}
