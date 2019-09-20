'use strict'
import React, { Component } from 'react'
import styles from './jumbo.css'
import Ionicon from 'react-ionicons'

class Jumbo extends Component {
  render() {
    return(
      <div className="jumbo">
        <div className="jumboHeader">
          <Ionicon icon="ios-ionic" fontSize="150px" color="white"></Ionicon>
          <h1>react-ionicons</h1>
          <p>A React SVG Ionicon component</p>
          <iframe src="https://ghbtns.com/github-btn.html?user=zamarrowski&repo=react-ionicons&type=star&count=true" frameBorder="0" scrolling="0" width="150px" height="20px"></iframe>
          <a href="https://twitter.com/zamarrowski" className="twitter-follow-button" data-show-count="false">Follow @zamarrowski</a>
        </div>
      </div>
    )
  }
}

export default Jumbo
