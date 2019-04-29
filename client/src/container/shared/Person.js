import React, { Component } from "react";
import APIService from "./../../services/api";

import AdminNavbar from "./../shared/AdminNavbar";
import OperatorNavbar from "./../shared/OperatorNavbar";
import UserNavbar from "./../shared/UserNavbar";
import Footer from './../shared/Footer';
import './style.css';

class Person extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PersonId: "",
      FirstName: "",
      MiddleName: "",
      LastName: "",
      Gender: "Male",
      DateOfBirth: '',
      Age: 0,
      FlatNumber: "",
      SocietyName: "",
      AreaName: "",
      City: "",
      State: "",
      Pincode: 0,
      PhoneNo: 0,
      MobileNo: 0,
      PhysicalDisability: "",
      MaritalStatus: "Married",
      Education: "PhD",
      BirthSign: ""
    };
    
    this.service = new APIService();
  }

  componentDidMount() {
    let PersonId = this.props.match.params.uid;
    
    
    this.service
      .findPersonById(PersonId)
      .then(res => res.json())
      .then(resp => {
        //console.log(JSON.stringify(resp.data[0].FullName.FirstName));
        let person = resp.data[0];
        console.log(person);
        this.setState({
          PersonId: person.PersonId,
          FirstName: person.FullName.FirstName,
          MiddleName: person.FullName.MiddleName,
          LastName: person.FullName.LastName,
          Gender: person.Gender,
          DateOfBirth: person.DateOfBirth,
          Age: person.Age,
          FlatNumber: person.Address.FlatNumber,
          SocietyName: person.Address.SocietyName,
          AreaName: person.Address.AreaName,
          City: person.City,
          State: person.State,
          Pincode: person.Pincode,
          PhoneNo: person.PhoneNo,
          MobileNo: person.MobileNo,
          PhysicalDisability: person.PhysicalDisability,
          MaritalStatus: person.MaritalStatus,
          Education: person.Education,
          BirthSign: person.BirthSign
        });
      })
      .catch(err => console.log(err));
  }

  onEdit(e){
    const history = this.props.history;
    history.push(`/add-user-personal-info/${this.props.match.params.uid}/1`);
  }
  render() {
    return (
      <div>
        {localStorage.getItem("_v_it") === "1" ? ( <AdminNavbar />) : localStorage.getItem("_v_it") === "2" ? (<OperatorNavbar />) : (<UserNavbar />)}
        <div className="container">
          <h3 className="text-center">Person Information</h3>
          <button className="btn btn-primary person-edit" onClick={this.onEdit.bind(this)}> Edit </button>
          <table className="table table-border table-striped">
            <thead />
            <tbody>
              <tr>
                <td className="person-head">FullName</td>
                <td>
                  {this.state.FirstName} {this.state.MiddleName}{" "}
                  {this.state.LastName}
                </td>
              </tr>
              <tr>
                <td className="person-head">Gender</td>
                <td>{this.state.Gender}</td>
              </tr>
              <tr>
                <td className="person-head">Date of Birth</td>
                <td>{this.state.DateOfBirth.substring(0, 10)}</td>
              </tr>
              <tr>
                <td className="person-head">Age</td>
                <td>{this.state.Age}</td>
              </tr>
              <tr>
                <td className="person-head">Address</td>
                <td>
                  {this.state.FlatNumber}, {this.state.SocietyName},{" "}
                  {this.state.AreaName}
                </td>
              </tr>
              <tr>
                <td className="person-head">City</td>
                <td>{this.state.City}</td>
              </tr>
              <tr>
                <td className="person-head">State</td>
                <td>{this.state.State}</td>
              </tr>
              <tr>
                <td className="person-head">Pincode</td>
                <td>{this.state.Pincode}</td>
              </tr>
              <tr>
                <td className="person-head">Phone Number</td>
                <td>{this.state.PhoneNo}</td>
              </tr>
              <tr>
                <td className="person-head">Mobile Number</td>
                <td>{this.state.MobileNo}</td>
              </tr>
              <tr>
                <td className="person-head">Birth Sign</td>
                <td>{this.state.BirthSign}</td>
              </tr>
              <tr>
                <td className="person-head">Physical Disability</td>
                <td>{this.state.PhysicalDisability}</td>
              </tr>
              <tr>
                <td className="person-head">Marital Status</td>
                <td>{this.state.MaritalStatus}</td>
              </tr>
              <tr>
                <td className="person-head">Education</td>
                <td>{this.state.Education}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <br />
        <hr />
        {/* <Footer /> */}
      </div>
    );
  }
}

export default Person;
