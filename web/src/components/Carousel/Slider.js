import React from 'react';
import { number, bool } from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import classnames from 'classnames';

class Slider extends React.PureComponent {
	slider = React.createRef();

	state = {
		isLeftButtonDisabled: true,
		isRightButtonDisabled: true,
		isArrowVisible: true,
		step: 0,
	};

	componentDidMount() {
		const { steps } = this.props;
		const step = this.slider.current.getClientWidth() / steps;
		this.setState({ step });
	}

	onUpdate = ({ left, scrollWidth, clientWidth }) => {
		const { autoHideArrows } = this.props;
		if (scrollWidth === clientWidth) {
			this.setState({
				isLeftButtonDisabled: true,
				isRightButtonDisabled: true,
				isArrowVisible: !autoHideArrows,
			});
		} else if (left === 0) {
			this.setState({
				isLeftButtonDisabled: true,
				isRightButtonDisabled: false,
				isArrowVisible: true,
			});
		} else if (left === 1) {
			this.setState({
				isLeftButtonDisabled: false,
				isRightButtonDisabled: true,
				isArrowVisible: true,
			});
		} else {
			this.setState({
				isLeftButtonDisabled: false,
				isRightButtonDisabled: false,
				isArrowVisible: true,
			});
		}
	};

	relativeScrollTo = (relativeValue) => {
		const value = this.slider.current.getScrollLeft() + relativeValue;
		this.slider.current.view.scroll({
			left: value,
			behavior: 'smooth',
		});
	};

	scrollLeft = () => {
		const { isLeftButtonDisabled, step } = this.state;

		if (isLeftButtonDisabled) return;

		this.relativeScrollTo(-step);
	};

	scrollRight = () => {
		const { isRightButtonDisabled, step } = this.state;

		if (isRightButtonDisabled) return;

		this.relativeScrollTo(step);
	};

	render() {
		const {
			isRightButtonDisabled,
			isLeftButtonDisabled,
			isArrowVisible,
		} = this.state;
		const {
			autoHideArrows,
			steps,
			containerClass,
			small,
			...restProps
		} = this.props;
		const { onUpdate, scrollLeft, scrollRight, slider } = this;

		return (
			<div className={classnames('slider__container', containerClass)}>
				{isArrowVisible && (
					<div
						className={classnames('slider__button', {
							disabled: isLeftButtonDisabled,
						})}
						onClick={scrollLeft}
					>
						<i className={classnames('slider__arrow left', { small: small })} />
					</div>
				)}

				<Scrollbars
					className="slider__slides-wrapper"
					autoHeight={true}
					{...restProps}
					onUpdate={onUpdate}
					renderView={(props) => <div {...props} className="slider__view" />}
					ref={slider}
				/>

				{isArrowVisible && (
					<div
						className={classnames('slider__button', {
							disabled: isRightButtonDisabled,
						})}
						onClick={scrollRight}
					>
						<i
							className={classnames('slider__arrow right', { small: small })}
						/>
					</div>
				)}
			</div>
		);
	}
}

Slider.propTypes = {
	autoHideArrows: bool,
	steps: number,
	small: bool,
};

Slider.defaultProps = {
	autoHideArrows: false,
	steps: 1,
	small: false,
};

export default Slider;
