import React, { Component } from 'react';
import DashboardNav from "../../components/DashboardNav";

class Books extends Component {
  render(){
    return (
      <div>
      <DashboardNav/>
      <div className='container'>
        <h1 className='center-align'>Books</h1>
      </div>
      </div>
    );
  }
}

export default Books