import React, { Component } from 'react';
import classnames from 'classnames';
import { ReCaptcha } from 'react-recaptcha-v3';
import { connect } from 'react-redux';

import { CAPTCHA_SITEKEY, DEFAULT_CAPTCHA_SITEKEY, CAPTCHA_TIMEOUT } from '../../config/constants';

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
	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			nextProps.input.value === '' &&
			nextProps.input.value !== this.props.input.value
		) {
			this.captcha.execute();
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
		this.captcha.execute();
	};

	render() {
		const { constants: { captcha = {} } } = this.props;
		const { ready, active } = this.state;
		return (
			active && (
				<div className={classnames('field-wrapper', { hidden: !ready })}>
					<ReCaptcha
						ref={this.setRef}
						// sitekey={captcha.site_key || CAPTCHA_SITEKEY}
						sitekey={CAPTCHA_SITEKEY || captcha.sitekey || DEFAULT_CAPTCHA_SITEKEY}
						verifyCallback={this.onVerifyCallback}
						expiredCallback={this.onExpiredCallback}
					/>
				</div>
			)
		);
	}
}

const mapStateToProps = (state) => ({
	constants: state.app.constants
});

export default connect(mapStateToProps)(CaptchaField);
