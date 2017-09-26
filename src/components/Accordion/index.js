import React, { Component } from 'react';
import AccordionSection from './AccordionSection';

class Accordion extends Component {
  state = {
    openSections: []
  }

  componentWillMount() {

  }

  openSection = (section, open = true) => {
    let openSections = [].concat(...this.state.openSections);

    if (open) {
      if (openSections.indexOf(section) === -1) {
        if (this.props.allowMultiOpen) {
          openSections.push(section)
        } else {
          openSections = [section];
        }
      }
    } else {
      const index = openSections.indexOf(section);
      if (index > -1) {
        openSections.splice(index, 1);
      }
    }
    this.setState({ openSections });
  }

  render() {
    const { sections } = this.props;
    return (
      <div className="accordion_wrapper">
        {sections.map((section, index) => (
          <AccordionSection
            key={index}
            index={index}
            openSection={this.openSection}
            isOpen={this.state.openSections.indexOf(index) > -1}
            {...section}
          />
        ))}
      </div>
    );

  }
}

Accordion.defaultProps = {
  allowMultiOpen: false
}

export default Accordion;
