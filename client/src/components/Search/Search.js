import React, { Component } from 'react';
import Navbar from "../Navbar/Navbar";
import { Link } from 'react-router-dom';
import './Search.css';

export default class Profile extends Component {

  render() {
    
    return (
      <div className="main-wrapper">
        <Navbar />

        <div className="container-box">
          
            <select>
              <option value="firstname">First Name</option>
              <option value="lastname">Last Name</option>
            </select>
            <input type="text" />
            <div className="update-button">
              <Link to="#">Search</Link>
            </div>
            <div className="cancel-button">
              <Link to="#">Reset</Link>
            </div>
          
          {/* <div id="searchBottom"></div> */}
        </div>
        <div className="container-box">
          
            
          
          
        </div>
        
      </div>
    );
  }
}
