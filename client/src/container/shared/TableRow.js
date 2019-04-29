import React, { Component } from "react";

class TableRowComponent extends Component {
  onAuthorize() {
    this.props.authorize(this.props.rec);
  }

  onReject() {
    this.props.reject(this.props.rec);
  }

  onPersonInfo() {
    this.props.person(this.props.rec);
  }
  render() {
    let key = Object.keys(this.props.rec);
    return (
      <tr>
        {key.map((v, i) => (
          <td key={i} onClick={this.onPersonInfo.bind(this)}>
            {this.props.rec[v]}
          </td>
        ))}
         {/* && this.props.status === 'Pending' */}
        {/* {( localStorage.getItem("_v_it") === "1" && status === 'Pending' )?  */}
        {(localStorage.getItem("_v_it") === "1" && this.props.status === 'Pending')? (
          <td>
            <span className="btn-link" onClick={this.onAuthorize.bind(this)}>Authorize</span> /
            <span className="btn-link" onClick={this.onReject.bind(this)}> Reject</span>
          </td>
        ) : null}
      </tr>
    );
  }
}

export default TableRowComponent;
