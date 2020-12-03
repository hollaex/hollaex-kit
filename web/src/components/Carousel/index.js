import React from 'react';
import { oneOfType, array, number, string, object, bool } from 'prop-types';
import AliceCarousel from 'react-alice-carousel';
import classnames from 'classnames';

class Carousel extends React.PureComponent {
	constructor(props) {
		super(props);
		const { groupItems } = this.props;
		this.state = {
			currentIndex: 0,
			responsive: { 0: { items: groupItems } },
			isPrevSlideDisabled: true,
			isNextSlideDisabled: true,
		};
	}

	componentDidMount() {
		const { isActive } = this.props;
		this.setState({ currentIndex: 0 }, isActive ? this.slidePrev : null);
	}

	onInitialized = ({
		item: currentIndex,
		isPrevSlideDisabled,
		isNextSlideDisabled,
	}) =>
		this.setState({ currentIndex, isPrevSlideDisabled, isNextSlideDisabled });

	onSlideChanged = ({
		item: currentIndex,
		isPrevSlideDisabled,
		isNextSlideDisabled,
	}) =>
		this.setState({ currentIndex, isPrevSlideDisabled, isNextSlideDisabled });

	slidePrev = () => {
		const { isPrevSlideDisabled } = this.state;
		if (!isPrevSlideDisabled) {
			this.setState((prevState) => ({
				currentIndex: prevState.currentIndex - 1,
			}));
		}
	};

	slideNext = () => {
		const { isNextSlideDisabled } = this.state;
		if (!isNextSlideDisabled) {
			this.setState((prevState) => ({
				currentIndex: prevState.currentIndex + 1,
			}));
		}
	};

	render() {
		const { items, containerClass, containerStyle, isInfinite } = this.props;
		const {
			responsive,
			currentIndex,
			isPrevSlideDisabled,
			isNextSlideDisabled,
		} = this.state;

		const { onInitialized, onSlideChanged, slidePrev, slideNext } = this;

		return (
			<div
				style={containerStyle}
				className={classnames('carousel__container', {
					containerClass: !!containerClass,
				})}
			>
				<div
					className={classnames('slider__button', {
						disabled: isPrevSlideDisabled,
					})}
					onClick={slidePrev}
				>
					<i className="slider__arrow left" />
				</div>

				<div className="carousel__alice-wrapper">
					<AliceCarousel
						infinite={isInfinite}
						dotsDisabled={true}
						buttonsDisabled={true}
						items={items}
						responsive={responsive}
						slideToIndex={currentIndex}
						onSlideChanged={onSlideChanged}
						onInitialized={onInitialized}
					/>
				</div>

				<div
					className={classnames('slider__button', {
						disabled: isNextSlideDisabled,
					})}
					onClick={slideNext}
				>
					<i className="slider__arrow right" />
				</div>
			</div>
		);
	}
}

Carousel.propTypes = {
	items: array,
	groupItems: number,
	containerStyle: object,
	containerClass: oneOfType([bool, string]),
};

Carousel.defaultProps = {
	items: [],
	groupItems: 5,
	containerStyle: {},
	containerClass: false,
	isInfinite: false,
};

export default Carousel;
