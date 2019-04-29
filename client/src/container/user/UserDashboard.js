import React, { Component } from "react";
import UserNavbar from "./../shared/UserNavbar";
import Footer from "../shared/Footer";

class UserComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      UserId: ''
    };
  }

  componentDidMount(){
    this.setState({UserId: this.props.match.params.uid });
    const history = this.props.history;
    history.push(`/person/${this.props.match.params.uid}`);
  }
  render() {
    return (
      <div>
        <UserNavbar id={this.state.UserId}/>
       {/* <Footer /> */}
      </div>
    );
  }
}

export default UserComponent;
