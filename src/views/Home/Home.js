import React, {Component} from 'react';
import {Link} from 'react-router';

import ToolbarNav from '../Nav/ToolbarNav.js';

import './css/gotoxray.css';

class GotoXray extends Component {
  render(){
    return(
        <div className="container-fluid">
          <div className="col">
            <div className="row">
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-lg-12">
                    <ToolbarNav/>         
                  </div>
                  <div className="col-lg-12 pt-5">
                    <div className="col-lg-6 offset-lg-3">
                      <h2 className="text-left goto_content_header">blockchain & cryptocurrency data analysis</h2>
                    </div>
                    <div className="col-lg-8 offset-lg-3 goto_content">
                      <p>Building on dozens of years of global payments experience, our team rebuilt the global payments network by merging the best of traditional systems with the flexi</p>
                    </div>
                    <div className="col-lg-8 offset-lg-3">
                          <p className="text-left"><b><Link to="/Underconstruction">LEARN MORE </Link></b></p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <img src="/assets/images/xray/goto.jpg" className="img-fluid"></img>
              </div>
            </div>

          </div>
        </div>
      )
  }
}

export default GotoXray; 