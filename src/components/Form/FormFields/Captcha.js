import React, { Component } from 'react';
import classnames from 'classnames';
import Recaptcha from 'react-recaptcha';
import { CAPTCHA_SITEKEY, CAPTCHA_TIMEOUT, DEFAULT_LANGUAGE } from '../../../config/constants';

class CaptchaField extends Component {
	state = {
		active: false,
		ready: false
	};
	componentDidMount() {
		setTimeout(() => {
			this.setState({ active: true });
		}, CAPTCHA_TIMEOUT);
	}
	componentWillReceiveProps(nextProps) {
		if (
			nextProps.input.value === '' &&
			nextProps.input.value !== this.props.input.value
		) {
			this.captcha.reset();
		}
	}

	setRef = (el) => {
		this.captcha = el;
	};

	onLoadCallback = () => {
		this.setState({ ready: true });
	};

	onVerifyCallback = (data) => {
		this.props.input.onChange(data);
	};

	onExpiredCallback = () => {
		this.props.input.onChange('');
		this.captcha.reset();
	};

	render() {
		const { language } = this.props;
		const { ready, active } = this.state;
		return (
			active && (
				<div
					className={classnames('field-wrapper', { hidden: !ready })}
				>
					<Recaptcha
						ref={this.setRef}
						sitekey={CAPTCHA_SITEKEY}
						verifyCallback={this.onVerifyCallback}
						expiredCallback={this.onExpiredCallback}
						onloadCallback={this.onLoadCallback}
						hl={language || DEFAULT_LANGUAGE}
					/>
				</div>
			)
		);
	}
}

export default CaptchaField;
