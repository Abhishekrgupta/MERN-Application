import React, { Component } from "react";
import AdminNavbar from "./../shared/AdminNavbar";
import OperatorNavbar from "./../shared/OperatorNavbar";
import Footer from "../shared/Footer";
import OptionComponent from "./../../components/OptionComponent";

import TableHeader from "./../shared/TableHeader";
import TableRow from "./../shared/TableRow";
import APIService from "./../../services/api";
import './style.css';

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [
        {
          UserName: "",
          Email: "",
          Mobile: "",
          Authorized: ""
        }
      ],
      UserStatusCategoryType: "Pending",
      UserStatusCategory: ["Pending", "Approved", "Rejected"],
      header: []
    };

    //Role: ["Approved", "Pending", "Rejected", "All"],
    this.service = new APIService();
  }

  onAuthorized(e) {
    this.service
      .isAuthorized({ UserId: e.UserId, isAuthorized: "Approved" })
      .then(res => res.json())
      .then(resp => {
        this.setState({ user: resp.user });
      })
      .catch(err => console.log(err));
  }

  onReject(e) {
    this.service
      .isAuthorized({ UserId: e.UserId, isAuthorized: "Rejected" })
      .then(res => res.json())
      .then(resp => {
        this.setState({ user: resp.user });
      })
      .catch(err => console.log(err));
  }

  onPersonInfo(e) {
    const history = this.props.history;
    history.push(`/person/${e.UserId}`);
  }

  // getting user's based on status category
  onShowUserByStatus(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
    console.log(e.target.value);

    this.service
      .findUserByStatus({ isAuthorized: e.target.value })
      .then(res => res.json())
      .then(resp => {
        console.log(resp.user);

        this.setState({ user: resp.user });
      })
      .catch(err => console.log(err));
  }

  // getting all pending user's list
  componentDidMount() {
    this.service
      .findUserByStatus({ isAuthorized: "Pending" })
      .then(res => res.json())
      .then(resp => {
        this.setState({ header: resp.header });
        this.setState({ user: resp.user });
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        {localStorage.getItem("_v_it") === "1" ? (
          <AdminNavbar />
        ) : (
          <OperatorNavbar />
        )}
        <br />
        <h3 className="text-center">All User's Information</h3>
        <div className="container bg-light">
          <br />
          <div className="form-group">
            <label htmlFor="UserStatusCategoryType">
              User's Status Category
            </label>
            <select
              type="text"
              className="form-control"
              name="UserStatusCategoryType"
              value={this.state.UserStatusCategoryType}
              onChange={this.onShowUserByStatus.bind(this)}
            >
              {this.state.UserStatusCategory.map((c, i) => (
                <OptionComponent key={i} data={c} />
              ))}
            </select>
          </div>
          
          <table className="table table-bordered table-striped  table-hover">
            <thead>
              <tr>
                {this.state.header.map((header, idx) => (
                  <TableHeader key={idx} header={header} />
                ))}
                {/* {Object.keys(this.state.user[0]).map((header, idx) => (
                  <TableHeader key={idx} header={header} />
                 ))} */}
                {(localStorage.getItem("_v_it") === "1" && this.state.UserStatusCategoryType === 'Pending') ? <th>Action</th> : null}
              </tr>
            </thead>
            <tbody>
              {this.state.user.length !== 0
                ? this.state.user.map((v, i) => (
                    <TableRow
                      key={i}
                      rec={v}
                      status={this.state.UserStatusCategoryType}
                      authorize={this.onAuthorized.bind(this)}
                      reject={this.onReject.bind(this)}
                      person={this.onPersonInfo.bind(this)}
                    />
                  ))
                : <td className="no-record" colSpan="5">No Record Found</td>}
            </tbody>
          </table>
        </div>
        {/* <Footer /> */}
      </div>
    );
  }
}

export default Users;
