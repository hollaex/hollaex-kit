import React from 'react'
import { oneOf, array, number, string, object, bool } from 'prop-types';
import AliceCarousel from 'react-alice-carousel'
import classnames from "classnames";

class Carousel extends React.Component {

  constructor(props){
    super(props);
    const { groupItems } = this.props;
    this.state={
      currentIndex: 0,
      responsive: { 0: { items: groupItems } },
      isPrevSlideDisabled: true,
      isNextSlideDisabled: true,
    }
  }

  onInitialized = ({ item: currentIndex, isPrevSlideDisabled, isNextSlideDisabled }) =>
    this.setState({ currentIndex, isPrevSlideDisabled, isNextSlideDisabled })

  onSlideChanged = ({ item: currentIndex, isPrevSlideDisabled, isNextSlideDisabled }) =>
    this.setState({ currentIndex, isPrevSlideDisabled, isNextSlideDisabled })

  slidePrev = () => {
    const { isPrevSlideDisabled } = this.state;
    if (!isPrevSlideDisabled) {
      this.setState((prevState) => ({ currentIndex: prevState.currentIndex - 1 }))
    }
  }

  slideNext = () => {
    const { isNextSlideDisabled } = this.state;
    if (!isNextSlideDisabled) {
      this.setState((prevState) => ({ currentIndex: prevState.currentIndex + 1 }))
    }
  }

  render() {
    const { items, containerClass, containerStyle } = this.props;
    const {
      responsive,
      currentIndex,
      isPrevSlideDisabled,
      isNextSlideDisabled
    } = this.state;

    const {
      onInitialized,
      onSlideChanged,
      slidePrev,
      slideNext,
    } = this;

    return (
      <div style={containerStyle} className={classnames("carousel__container", { containerClass: !!containerClass  })} >
        <div
          className={classnames("carousel__button mr-2", { disabled: isPrevSlideDisabled })}
          onClick={slidePrev}
        >
          Prev
        </div>

        <AliceCarousel
          infinite={false}
          dotsDisabled={true}
          buttonsDisabled={true}
          items={items}
          responsive={responsive}
          slideToIndex={currentIndex}
          onSlideChanged={onSlideChanged}
          onInitialized={onInitialized}
        />

        <div
          className={classnames("carousel__button ml-2", { disabled: isNextSlideDisabled })}
          onClick={slideNext}
        >
          Next
        </div>
      </div>
    )
  }
}

Carousel.propTypes = {
  items: array,
  groupItems: number,
  containerStyle: object,
  containerClass: oneOf([bool, string]),
}

Carousel.defaultProps = {
  items: [],
  groupItems: 5,
  containerStyle: {},
  containerClass: false,
}

export default Carousel;