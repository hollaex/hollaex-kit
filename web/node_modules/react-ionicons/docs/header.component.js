'use strict'
import React, { Component } from 'react'
import Ionicon from 'react-ionicons'
import AppBar from 'material-ui/AppBar'

class Header extends Component {
  render() {
    const appBarStyles = {
      backgroundColor: '#298fff'
    }
    return(
      <AppBar
        title={<span>react-ionicons<sup style={{fontSize: '12px'}}>v2</sup></span>}
        style={appBarStyles}
        iconElementLeft={<Ionicon icon="ios-ionic" fontSize="50px" color="white" rotate={true}></Ionicon>}
      />
    )
  }
}

export default Header
