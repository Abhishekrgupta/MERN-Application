import React, { Component } from "react";
import APIService from "./../../services/api";
import "./../shared/style.css";
import AdminNavbar from "./../shared/AdminNavbar";
import OperatorNavbar from "./../shared/OperatorNavbar";
import Footer from "../shared/Footer";

class NewUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      UserName: "",
      Email: "",
      Mobile: "",
      Password: "",
      Role: "AccessUser",
      Roles: ["AccessUser", "Admin", "Operator"],
      addUserToast: false,
      isMobileUnique: false,
      isEmailUnique: false,
      isUserNameUnique: false,
      isUsernameEmpty: false,
      isEmailEmpty:false,
      isPasswordEmpty: false
    };

    this.service = new APIService();
  }

  /*
   *  trigger at every change of form fields
   */
  onChangeUser(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  /*
   *  checking mobile is duplicate or not
   */
  onCheckMobile(e) {

    // if(this.target.value== undefined){

    //   this.setState({
    //     isMobileEmpty: true
    //   });
    // }
    // else{

    //   this.setState({
    //     isMobileEmpty: false
    //   });

    this.service
      .checkUniqueMobileNo({ Mobile: e.target.value })
      .then(res => res.json())
      .then(resp => {
        if (resp.status === 200) {
          this.setState({ isMobileUnique: true });
        }
        if (resp.status === 404) {
          this.setState({ isMobileUnique: false });
        }
        console.log(resp.status);
      })
      .catch(err => console.log(err));
    // }
  }

  /*
   *  checking username is duplicate or not
   */

  onCheckUserName(e) {
    // this.setState({
    //   [e.target.name]: e.target.value
    // });

    if(e.target.value == ""){
      this.setState({
        isUsernameEmpty:true
      });
    }else{
      this.setState({
        isUsernameEmpty:false
      });

    this.service
      .checkUniqueUserName({ UserName: e.target.value })
      .then(res => res.json())
      .then(resp => {
        if (resp.status === 200) {
          this.setState({ isUserNameUnique: true });
        }
        if (resp.status === 404) {
          this.setState({ isUserNameUnique: false });
        }
        console.log(resp.status);
      })
      .catch(err => console.log(err));

      
    }
  }

  onCheckPassword(e) {

    if(e.target.value == ""){
      this.setState({
        isPasswordEmpty:true
      });
    }else{
      this.setState({
        isPasswordEmpty:false
      });
    }
    
  }


  /*
   *  checking email is duplicate or not
   */
  onCheckEmail(e) {

    if(e.target.value == "")
    {
      this.setState({
        isEmailEmpty: true
      });
    }

    else{
      this.setState({
        isEmailEmpty: false
      });

    this.service
      .checkUniqueEmail({ Email: e.target.value })
      .then(res => res.json())
      .then(resp => {
        if (resp.status === 200) {
          this.setState({ isEmailUnique: true });
        }
        if (resp.status === 404) {
          this.setState({ isEmailUnique: false });
        }
        console.log(resp.status);
      })
      .catch(err => console.log(err));
    }
  }

  /*
   *  storing user into collection
   */
  onSaveUser(e) {
    const history = this.props.history;
    let user = {
      UserName: this.state.UserName,
      Email: this.state.Email,
      Mobile: this.state.Mobile,
      Password: this.state.Password,
      Role: this.state.Role,
      CreatedBy: localStorage.getItem("_v_it")
    };
    console.log(user);

    this.service
      .addNewUser(user)
      .then(res => res.json())
      .then(resp => {
        console.log(resp);
        // for notification
        this.setState({ addUserToast: true });
        setTimeout(() => {
          history.push(`/add-user-personal-info/${resp.uid}`);
        }, 1000);
      })
      .catch(err => console.log(err));
  }

  onCancel(e) {
    const history = this.props.history;
    if (localStorage.getItem("_v_it") === "1") {
      history.push("/admin-dashboard");
    } else {
      history.push("/operator-dashboard");
    }
  }

  componentDidMount() {

    this.service
      .getAllRoles()
      .then(res => res.json())
      .then(resp => {
        if (resp.status == 200) {
        // let roles = resp.data;
         //console.log(resp.data[0]);
          let roles = [];
         for(var i of resp.data){
           //console.log(i);
           roles.push(i.RoleType);
           
         }
        // console.log(roles);
         
         this.setState({
          Roles: roles
        });

        }
      })
      .catch(err => console.log(err));
  }

//   handleChangeUserName(e){
//     if(e.target.value.match("^[a-zA-Z ]*$") != null){
//         this.setState({UserName: e.target.value});
//     }
//  }

  render() {
    return (
      <div>
        {localStorage.getItem("_v_it") === "1" ? (
          <AdminNavbar />
        ) : (
          <OperatorNavbar />
        )}
        {this.state.addUserToast ? (
          <div className="toast-body alert-success col-md-3 float-right">
            User Added
          </div>
        ) : null}
        <div className="container bg-light login">
          <div className=" row  justify-content-center align-items-center">
            <div className="col-md-7">
              <h1 className="text-center">New User</h1>
              <hr />
              <form>
                <div className="form-group">
                  <label htmlFor="userName">
                    User Name <span className="required"> * </span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="userName"
                    name="UserName"
                    value={this.state.UserName}
                    onChange={this.onChangeUser.bind(this)}
                    onBlur={this.onCheckUserName.bind(this)}
                    placeholder=""
                    required
                  />
                  { this.state.isUsernameEmpty ? (
                    <p className="alert-danger">Username Required</p>
                  ) : null}
                  {this.state.isUserNameUnique ? (
                    <p className="alert-danger">Username already used</p>
                  ) : null}
                </div>
                <div className="form-group">
                  <label htmlFor="email">
                    Email <span className="required"> * </span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="Email"
                    value={this.state.Email}
                    onChange={this.onChangeUser.bind(this)}
                    onBlur={this.onCheckEmail.bind(this)}
                    placeholder=""
                    required
                  />

                   { this.state.isEmailEmpty ? (
                    <p className="alert-danger">Email Required</p>
                  ) : null}

                  {this.state.isEmailUnique ? (
                    <p className="alert-danger">Email already used</p>
                  ) : null}
                </div>
                <div className="form-group">
                  <label htmlFor="mobile">
                    Mobile No <span className="required"> * </span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="mobile"
                    name="Mobile"
                    value={this.state.Mobile}
                    onChange={this.onChangeUser.bind(this)}
                    onBlur={this.onCheckMobile.bind(this)}
                    placeholder=""
                    required
                  />

                  {/* { this.state.isMobileEmpty ? (
                    <p className="alert-danger">Mobile No Required</p>
                  ) : null}  */}

                  {this.state.isMobileUnique ? (
                    <p className="alert-danger">Mobile number already used</p>
                  ) : null}
                </div>
                <div className="form-group">
                  <label htmlFor="password">
                    Password <span className="required"> * </span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="Password"
                    value={this.state.Password}
                    onChange={this.onChangeUser.bind(this)}
                    onBlur={this.onCheckPassword.bind(this)}
                    placeholder=""
                    required
                  />
                  {this.state.isPasswordEmpty ? (
                    <p className="alert-danger">Password Required</p>
                  ) : null}
                </div>
                <div className="form-group">
                  <label htmlFor="role">
                    Role <span className="required"> * </span>
                  </label>
                  <select
                    className="form-control"
                    id="role"
                    onChange={this.onChangeUser.bind(this)}
                    name="Role"
                  >
                    {this.state.Roles.map((value, idx) => (
                      <option value={value} key={idx}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={this.onCancel.bind(this)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled= {this.state.isUsernameEmpty || this.state.isEmailEmpty || this.state.isPasswordEmpty ? true : false }
                  onClick={this.onSaveUser.bind(this)}
                >
                  Add User
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <br />
        <br />
        
      </div>
    );
  }
}

export default NewUser;
