import React, { Component } from 'react';
import AccordionSection from './AccordionSection';

class Accordion extends Component {
  state = {
    openSections: [],
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
    this.scrollToTop();
  }

  openNextSection = () => {
    if (!this.props.allowMultiOpen) {
      const currentSection = this.state.openSections.length > 0 ? this.state.openSections[0] : -1;
      this.openSection(currentSection + 1);
      this.scrollToTop(this.accordion.children[currentSection + 1].this.accordion.getBoundingClientRect().top);
    }
  }

  closeAll = () => {
    this.setState({ openSections: [] });
    this.scrollToTop();
  }

  setRef = (el) => {
    this.accordion = el;
  }

  scrollToTop = (paramTop = 0) => {
    const top = this.accordion ? this.accordion.getBoundingClientRect() : paramTop;
    window.scrollTo(top, 0);
  }

  render() {
    const { sections } = this.props;
    return (
      <div className="accordion_wrapper" ref={this.setRef}>
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
