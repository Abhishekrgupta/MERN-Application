import React, { Component } from "react";

// component that will render <option> component of select list
class OptionComponent extends Component {
  render() {
    return <option value={this.props.data}>{this.props.data}</option>;
  }
}

export default OptionComponent;