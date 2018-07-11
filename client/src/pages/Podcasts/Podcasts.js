import React, { Component } from 'react';
import DashboardNav from "../../components/DashboardNav";

class Podcasts extends Component {
  render(){
    return (
      <div>
      <DashboardNav/>
      <div className='container'>
        <h1 className='center-align'>Podcasts</h1>
      </div>
      </div>
    );
  }
}

export default Podcasts