import React, { Component } from "react";
import AdminNavbar from "./../shared/AdminNavbar";
import OperatorNavbar from "./../shared/OperatorNavbar";
import Footer from "../shared/Footer";
import OptionComponent from "./../../components/OptionComponent";

import TableHeader from "./../shared/TableHeader";
import TableRow from "./../shared/TableRow";
import APIService from "./../../services/api";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      person: [
        {
          PersonId: "",
          FullName: "",
          Gender: "",
          City: "",
          State: ""
        }
      ],
      PersonStatusCategoryType: "Pending",
      PersonStatusCategory: ["Pending", "Approved"],
      header: []
    };
    this.service = new APIService();
  }

  onAuthorized(e) {
    console.log(e);
    this.service
      .isAuthorizedPerson({ PersonId: e.PersonId, isAuthorized: "Approved" })
      .then(res => res.json())
      .then(resp => {
        let persons = [];
        resp.data.map((v, i) => {
          let per = {
            PersonId: v.PersonId,
            FullName: `${v.FullName.FirstName} ${v.FullName.MiddleName} ${
              v.FullName.LastName
            }`,
            Gender: v.Gender,
            City: v.City,
            State: v.State
          };
          persons.push(per);
        });

        console.log("response getting");

        this.setState({ person: persons });
      })
      .catch(err => console.log(err));
  }

  onReject(e) {
    // this.service
    //   .isAuthorized({ UserId: e.UserId, isAuthorized: "Rejected" })
    //   .then(res => res.json())
    //   .then(resp => {
    //     this.setState({ user: resp.user });
    //   })
    //   .catch(err => console.log(err));
  }

  onPersonInfo(e) {
    const history = this.props.history;
    history.push(`/person/${e.PersonId}`);
  }

  // getting user's based on status category
  onShowPersonByStatus(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
    this.service
      //************************** */
      .findPersonByStatus({ isAuthorized: e.target.value })
      .then(res => res.json())
      .then(resp => {
        let persons = [];
        resp.person.map((v, i) => {
          let per = {
            PersonId: v.PersonId,
            FullName: `${v.FullName.FirstName} ${v.FullName.MiddleName} ${
              v.FullName.LastName
            }`,
            Gender: v.Gender,
            City: v.City,
            State: v.State
          };
          persons.push(per);
        });
        this.setState({ person: persons });
      })
      .catch(err => console.log(err));
  }

  // getting all pending user's list
  componentDidMount() {
    this.service
      .findPersonByStatus({ isAuthorized: "Pending" })
      .then(res => res.json())
      .then(resp => {
        let persons = [];
        resp.person.map((v, i) => {
          let per = {
            PersonId: v.PersonId,
            FullName: `${v.FullName.FirstName} ${v.FullName.MiddleName} ${
              v.FullName.LastName
            }`,
            Gender: v.Gender,
            City: v.City,
            State: v.State
          };
          persons.push(per);
        });
        this.setState({ header: resp.header });
        this.setState({ person: persons });
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
        <h3 className="text-center">All Person's Information</h3>
        <div className="container bg-light">
        <br />
          <div className="form-group">
            <label htmlFor="PersonStatusCategoryType">
              Status Category
            </label>
            <select
              type="text"
              className="form-control"
              name="PersonStatusCategoryType"
              value={this.state.PersonStatusCategoryType}
              onChange={this.onShowPersonByStatus.bind(this)}
            >
              {this.state.PersonStatusCategory.map((c, i) => (
                <OptionComponent key={i} data={c} />
              ))}
            </select>
          </div>

         
          <table className="table table-bordered table-striped table-hover">
            <thead>
              <tr>
                {this.state.header.map((header, idx) => (
                  <TableHeader key={idx} header={header} />
                ))}

                {/* {Object.keys(this.state.person[0]).map((header, idx) => (
                  <TableHeader key={idx} header={header} />
                ))} */}
                {localStorage.getItem("_v_it") === "1" &&
                this.state.PersonStatusCategoryType === "Pending" ? (
                  <th>Action</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {/* {this.state.user.length !== 0 ? row : null) */}
              {this.state.person.length !== 0
                ? this.state.person.map((v, i) => (
                    <TableRow
                      key={i}
                      rec={v}
                      status={this.state.PersonStatusCategoryType}
                      authorize={this.onAuthorized.bind(this)}
                      reject={this.onReject.bind(this)}
                      person={this.onPersonInfo.bind(this)}
                    />
                  ))
                : <td className="no-record" colSpan="6">No Record Found</td>}
            </tbody>
          </table>
        </div>
        {/* <Footer /> */}
      </div>
    );
  }
}

export default Users;
