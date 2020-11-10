import React, { Fragment } from 'react';
import { number, bool } from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import classnames from 'classnames';

class ControlledScrollbar extends React.PureComponent {
	scrollbar = React.createRef();

	state = {
		isUpButtonDisabled: true,
		isDownButtonDisabled: true,
		isArrowVisible: true,
		step: 0,
	};

	onUpdate = ({ top, scrollHeight, clientHeight }) => {
		const { autoHideArrows, steps } = this.props;
		const step = this.scrollbar.current.getClientHeight() / steps;
		this.setState({ step });

		if (scrollHeight === clientHeight) {
			this.setState({
				isUpButtonDisabled: true,
				isDownButtonDisabled: true,
				isArrowVisible: !autoHideArrows,
			});
		} else if (top === 0) {
			this.setState({
				isUpButtonDisabled: true,
				isDownButtonDisabled: false,
				isArrowVisible: true,
			});
		} else if (top === 1) {
			this.setState({
				isUpButtonDisabled: false,
				isDownButtonDisabled: true,
				isArrowVisible: true,
			});
		} else {
			this.setState({
				isUpButtonDisabled: false,
				isDownButtonDisabled: false,
				isArrowVisible: true,
			});
		}
	};

	relativeScrollTo = (relativeValue) => {
		const value = this.scrollbar.current.getScrollTop() + relativeValue;
		this.scrollbar.current.view.scroll({
			top: value,
			behavior: 'smooth',
		});
	};

	scrollUp = () => {
		const { isUpButtonDisabled, step } = this.state;

		if (isUpButtonDisabled) return;

		this.relativeScrollTo(-step);
	};

	scrollDown = () => {
		const { isDownButtonDisabled, step } = this.state;

		if (isDownButtonDisabled) return;

		this.relativeScrollTo(step);
	};

	render() {
		const {
			isDownButtonDisabled,
			isUpButtonDisabled,
			isArrowVisible,
		} = this.state;
		const { autoHideArrows, steps, ...restProps } = this.props;
		const { onUpdate, scrollUp, scrollDown, scrollbar } = this;

		return (
			<Fragment>
				{isArrowVisible && (
					<div
						className={classnames('controlled-scrollbar__button', {
							disabled: isUpButtonDisabled,
						})}
						onClick={scrollUp}
					>
						<i className="controlled-scrollbar__arrow up" />
					</div>
				)}

				<Scrollbars {...restProps} onUpdate={onUpdate} ref={scrollbar} />

				{isArrowVisible && (
					<div
						className={classnames('controlled-scrollbar__button', {
							disabled: isDownButtonDisabled,
						})}
						onClick={scrollDown}
					>
						<i className="controlled-scrollbar__arrow down" />
					</div>
				)}
			</Fragment>
		);
	}
}

ControlledScrollbar.propTypes = {
	autoHideArrows: bool,
	steps: number,
};

ControlledScrollbar.defaultProps = {
	autoHideArrows: false,
	steps: 1,
};

export default ControlledScrollbar;
