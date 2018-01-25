import React, { PureComponent } from 'react';
import Recaptcha from 'react-recaptcha';
import { CAPTCHA_SITEKEY } from '../../../config/constants';

class CaptchaField extends PureComponent {
	componentWillReceiveProps(nextProps) {
		if (
			(nextProps.input.value === '' &&
				nextProps.input.value !== this.props.input.value)
		) {
			this.captcha.reset();
		}
	}

	setRef = (el) => {
		this.captcha = el;
	};

	onVerifyCallback = (data) => {
		this.props.input.onChange(data);
	};

	onExpiredCallback = () => {
		this.props.input.onChange('');
		this.captcha.reset();
	};

	render() {
		return (
			<div className="field-wrapper">
				<Recaptcha
					ref={this.setRef}
					sitekey={CAPTCHA_SITEKEY}
					verifyCallback={this.onVerifyCallback}
					expiredCallback={this.onExpiredCallback}
				/>
			</div>
		);
	}
}

export default CaptchaField;
