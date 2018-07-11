import React, { Component } from 'react';
import DashboardNav from "../../components/DashboardNav";

class YouTube extends Component {
  render(){
    return (
      <div>
      <DashboardNav/>
      <div className='container'>
        <h1 className='center-align'>YouTube Videos</h1>
      </div>
      </div>
    );
  }
}

export default YouTube