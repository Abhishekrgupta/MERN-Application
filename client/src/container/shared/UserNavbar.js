import React, { Component } from 'react';
import "./style.css";
import { Link } from "react-router-dom";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      UserId: ''
     }
  }

  componentDidMount(){
   // console.log("xxxxxxxxxxxxxx",this.props.id);
    this.setState({UserId : `/person/${this.props.id}`});
    
  }
  render() { 
    return ( 
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand" to="/user-dashboard">
      Harbinger Systems ||
      </Link>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link className="nav-link" to={this.state.UserId}>
            Personal Info
          </Link>
        </li>
      </ul>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/logout">
            Logout
          </Link>
        </li>
      </ul>
    </nav>
     );
  }
}
 
export default NavBar;

