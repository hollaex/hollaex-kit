import React, { Component } from 'react';
import Image from 'components/Image';

import STRINGS from '../../config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

let timerInterval = '';

class ElapsedTimer extends Component {
	state = {
		seconds: this.props.timeoutSeconds - 1,
	};

	componentDidMount() {
		if (this.props.isLoading) {
			this.startTimer();
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.props.isLoading !== nextProps.isLoading) {
			if (nextProps.isLoading) {
				this.startTimer();
			} else {
				this.endTimer();
			}
		}
	}

	UNSAFE_componentWillUpdate(nextProps, nextState) {
		if (nextState.seconds === 0) {
			this.props.timeoutCallback();
			this.endTimer();
		}
	}

	componentWillUnmount() {
		this.endTimer();
	}

	startTimer = () => {
		timerInterval = setInterval(() => {
			this.setState({ seconds: this.state.seconds - 1 });
		}, this.props.intervalSeconds * 1000);
	};

	endTimer = () => {
		if (timerInterval) {
			clearInterval(timerInterval);
		}
		this.setState({ seconds: this.props.timeoutSeconds });
	};

	render() {
		const { isLoading, timerText, icons: ICONS } = this.props;
		if (!isLoading) {
			return null;
		}
		return (
			<div className="elapsed-timer-wrapper mb-4 d-flex align-items-center">
				<div className="timer-text">
					{timerText}
					<span className="timer-time mx-1">
						{this.state.seconds} {STRINGS['SECONDS']}
					</span>
				</div>
				<div>
					<Image
						iconId="PENDING_TIMER"
						icon={ICONS['PENDING_TIMER']}
						wrapperClassName="timer-svg"
					/>
				</div>
			</div>
		);
	}
}

ElapsedTimer.defaultProps = {
	isLoading: false,
	timeoutSeconds: 60,
	timerText: '',
	intervalSeconds: 1,
};

export default withConfig(ElapsedTimer);
