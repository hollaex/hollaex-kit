import React, { Component } from 'react'
import Paper from 'material-ui/Paper'
import Ionicon from 'react-ionicons'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

import styles from './iconsContainer.css'
import iconsName from './icons.constant.js'

class IconsContainer extends Component {

  constructor() {
    super()
    this.state = {
      searchIcon: '',
      iconsFiltered: iconsName,
      filterSelected: 'all'
    }
  }

  render() {
    return (
      <div className="iconsContainerSection">
        <h2>Icons</h2>
          <p style={{color: 'black'}}><strong>NOTE:</strong> This icons are for react-ionicons v2 that uses ionicons v3.
            If you are looking for react-ionicons v1 check out this: <a href="http://ionicons.com/">Ionicons</a>
          </p>
          <SelectField
            floatingLabelText="Filter by type"
            value={this.state.filterSelected}
            onChange={this.handleFilter.bind(this)}
          >
          <MenuItem value={'all'} primaryText="All" />
          <MenuItem value={'ios'} primaryText="iOS" />
          <MenuItem value={'outline'} primaryText="iOS-Outline" />
          <MenuItem value={'md'} primaryText="Material design" />
          <MenuItem value={'logo'} primaryText="Logos" />
        </SelectField>
        <br/>
        <TextField
          floatingLabelText="Search icon..."
          value={this.state.searchIcon}
          onChange={this.handleSearchIcon.bind(this)}
        />
        <div className="iconsContainer">
            {this.state.iconsFiltered.map((icon, key) => (
              <div className="icon" key={key}>
                <Ionicon icon={icon} fontSize="30px"></Ionicon>
                <div>
                  <span className="iconName">{icon}</span>
                </div>
              </div>
              ))}
        </div>
      </div>
    )
  }

  handleSearchIcon(event) {
    this.setState({searchIcon: event.target.value})
    if (!this.filterSelected || this.filterSelected === 'all') {
      let icons = iconsName.filter(icon => icon.indexOf(event.target.value) > -1)
      this.setState({iconsFiltered: icons })
    } else {
      let icons = this.state.iconsFiltered.filter(icon => icon.indexOf(event.target.value) > -1)
      this.setState({iconsFiltered: icons })
    }

  }

  handleFilter(event, index, value) {
    this.setState({ filterSelected: value })
    if (value !== 'all') {
      let icons = iconsName.filter(icon => icon.indexOf(value) > -1)
      this.setState({ iconsFiltered: icons })
    } else {
      this.setState({ iconsFiltered: iconsName })
    }
  }

}

export default IconsContainer
