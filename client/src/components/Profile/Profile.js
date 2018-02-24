import React, { Component } from 'react';
import Navbar from "../Navbar/Navbar";
import { Link } from 'react-router-dom';
import './Profile.css';

export default class Profile extends Component {

  render() {
    var years = [<option></option>],
        days = [<option></option>];
    var startYear = 1910;
    var startDay = 1;
    while (startYear < 2018){
      years.push(<option key={startYear}>{startYear}</option>)
      startYear++
    }
    while (startDay < 32){
      days.push(<option key={startDay}>{startDay}</option>)
      startDay++
    }
    return (
      <div className="main-wrapper">
        <Navbar />
        <div className="dashboard-wrapper">

          <div className="profile-info">
            <div className="profile-box">
              <img className="profile-image" src="https://robohash.org/me" />
              <div className="profile-name">Name</div>
            </div>
            <div className="profile-details-wrapper">


              <div className="update-button">
                <Link to="/profile">Update</Link>
              </div>
              <div className="cancel-button">
                <Link to="/profile">Cancel</Link>
              </div>
            </div>
          </div>




        </div>
        <div className="profile-fields-wrapper">

          <div className="input-box">
            First Name<br />
            <input className="o-bounds" type="text" />
          </div><div className="input-box">
            Hobby<br />
            <select><option value=""></option>
              <option>Video Games</option>
              <option>Hiking</option>
              <option>Fishing</option>
              <option>Rafting</option>
            </select>
          </div>
          <div className="input-box">
            Last Name<br />
            <input className="o-bounds" type="text" />
          </div><div className="input-box">
            Birth Day<br />
            <select>
              {days}
            </select>
          </div>
          <div className="input-box">
            Gender<br />
            <select><option value=""></option><option value="male">Male</option><option value="female">Female</option></select>
          </div><div className="input-box">
            Birth Month<br />
            <select>
              <option value=""></option>
              <option value="january">January</option>
              <option value="february">February</option>
              <option value="march">March</option>
              <option value="april">April</option>
              <option value="may">May</option>
              <option value="june">June</option>
              <option value="july">July</option>
              <option value="august">August</option>
              <option value="september">September</option>
              <option value="october">October</option>
              <option value="november">November</option>
              <option value="december">December</option>
            
            </select>
          </div>
          <div className="input-box">
            Hair Color<br />
            <select><option value=""></option>
              <option>Brown</option>
              <option>Blonde</option>
              <option>Blue</option>
              <option>Green</option>
              <option>Red</option>
              <option>White</option>
            </select>
          </div><div className="input-box">
            Birth Year<br />
            <select>
              {years}
            </select>
          </div>
          <div className="input-box">
            Eye Color<br />
            <select>
            <option value=""></option>
              <option>Brown</option>
              <option>Blue</option>
              <option>Green</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
}
