import React, { Component } from 'react';
import classnames from 'classnames';
import moment from 'moment';

import { playBackgroundAudioNotification } from '../../utils/utils';
import STRINGS from '../../config/localizedStrings';

import { Button, Loader } from '../';

const INIT_STATE = {
	countdown: -1,
	end: undefined,
	interval: undefined,
};

class Countdown extends Component {
	state = INIT_STATE;

	componentWillMount() {
		this.onInit(this.props.end);
	}

	componentWillUnmount() {
		this.onStop();
	}

	onInit = (expirationTime) => {
		playBackgroundAudioNotification(
			'review_quick_trade_order',
			this.props.settings
		);
		const end = moment.unix(expirationTime).subtract(5, 'seconds');
		this.onTick(end);
		const interval = setInterval(() => {
			this.onTick(this.state.end);
		}, 500);
		this.setState({ interval, end });
	};

	onTick = (end) => {
		const countdown = end.diff(moment(), 'seconds');
		if (countdown <= 0) {
			playBackgroundAudioNotification(
				'time_out_quick_trade',
				this.props.settings
			);
			this.onStop();
		} else {
			this.setState({
				countdown,
			});
		}
	};

	onStop = () => {
		clearInterval(this.state.interval);
		this.setState({ countdown: 0 });
	};

	render() {
		const { countdown } = this.state;
		if (countdown === -1) {
			return <Loader relative={true} background={false} />;
		}

		const {
			buttonDisabled,
			buttonLabel,
			onClickButton,
			children,
			className,
			timerClassName,
			renderCountdown,
			renderTimeout,
		} = this.props;

		const isFinished = countdown === 0;

		return (
			<div className={classnames('countdown-wrapper', className)}>
				{children && (
					<div className="countdown-children-wrapper">{children}</div>
				)}
				{countdown === 0 ? (
					<div className="countdown-expiration-message">
						{renderTimeout
							? renderTimeout()
							: STRINGS['COUNTDOWN_ERROR_MESSAGE']}
					</div>
				) : (
					<div
						className={classnames('countdown-timer', timerClassName, {
							invalid: isFinished,
						})}
					>
						{renderCountdown ? renderCountdown(countdown) : countdown}
					</div>
				)}
				<Button
					label={buttonLabel}
					disabled={isFinished || buttonDisabled}
					onClick={onClickButton}
					className="countdown-button"
					type="button"
				/>
			</div>
		);
	}
}

export default Countdown;
