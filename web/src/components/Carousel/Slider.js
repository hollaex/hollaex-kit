import React from 'react';
import { number, bool } from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import classnames from "classnames";

class Slider extends React.PureComponent {

  slider = React.createRef()

  state = {
    isLeftButtonDisabled: true,
    isRightButtonDisabled: true,
    isArrowVisible: true,
  }

  onUpdate = ({ left, scrollWidth, clientWidth }) => {
    const { autoHideArrows } = this.props;
    if (scrollWidth === clientWidth) {
      this.setState({
        isLeftButtonDisabled: true,
        isRightButtonDisabled: true,
        isArrowVisible: !autoHideArrows,
      })
    } else if(left === 0) {
      this.setState({
        isLeftButtonDisabled: true,
        isRightButtonDisabled: false,
        isArrowVisible: true,
      })
    } else if (left === 1) {
      this.setState({
        isLeftButtonDisabled: false,
        isRightButtonDisabled: true,
        isArrowVisible: true,
      })
    } else {
      this.setState({
        isLeftButtonDisabled: false,
        isRightButtonDisabled: false,
        isArrowVisible: true,
      })
    }
  }

  relativeScrollTo = (relativeValue) => {
    const value = this.slider.current.getScrollLeft() + relativeValue
    this.slider.current.view.scroll({
      left: value,
      behavior: 'smooth',
    });
  }

  scrollLeft = () => {
    const { isLeftButtonDisabled } = this.state;
    const { scrollingStep } = this.props;

    if (isLeftButtonDisabled) return;

    this.relativeScrollTo(-scrollingStep)
  }

  scrollRight = () => {
    const { isRightButtonDisabled } = this.state;
    const { scrollingStep } = this.props;

    if (isRightButtonDisabled) return;

    this.relativeScrollTo(scrollingStep)
  }

  render() {
    const { isRightButtonDisabled, isLeftButtonDisabled, isArrowVisible } = this.state;
    const { autoHideArrows, scrollingStep, ...restProps } = this.props;
    const { onUpdate, scrollLeft, scrollRight, slider } = this;

    return (
      <div className="slider__container">
        {
          isArrowVisible && (
            <div
              className={classnames("slider__button", { disabled: isLeftButtonDisabled })}
              onClick={scrollLeft}
            >
              <i className="slider__arrow left"/>
            </div>
          )
        }

        <Scrollbars
          className="slider__slides-wrapper"
          autoHeight={true}
          {...restProps}
          onUpdate={onUpdate}
          renderView={props => <div {...props} className="slider__view"/>}
          ref={slider}
        />

        {
          isArrowVisible && (
            <div
              className={classnames("slider__button", { disabled: isRightButtonDisabled })}
              onClick={scrollRight}
            >
              <i className="slider__arrow right"/>
            </div>
          )
        }
      </div>
    );
  }
}

Slider.propTypes = {
  autoHideArrows: bool,
  scrollingStep: number,
}

Slider.defaultProps = {
  autoHideArrows: false,
  scrollingStep: 35,
}

export default Slider;