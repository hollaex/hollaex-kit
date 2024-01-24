import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isUUID } from 'validator';
import {
	verifyVerificationCode,
	checkVerificationCode,
} from 'actions/authAction';

import { IconTitle, Loader, Button } from 'components';
import { FLEX_CENTER_CLASSES } from 'config/constants';
import STRINGS from 'config/localizedStrings';
import { Button as AntBtn } from 'antd';
import withConfig from 'components/ConfigProvider/withConfig';

class VerifyEmailCode extends Component {
	state = {
		success: false,
		errorMessage: '',
		confirm: false,
	};

	UNSAFE_componentWillMount() {
		const { code } = this.props.params;
		if (!isUUID(code)) {
			this.setError(STRINGS['VERIFICATION_EMAIL.INVALID_UUID']);
		}
	}

	setError = (errorMessage = '') => {
		this.setState({ errorMessage });
	};

	onClickLogin = () => {
		this.props.router.replace('login');
	};
	render() {
		const {
			data: { fetching, fetched, error },
			icons: ICONS,
		} = this.props;
		const { errorMessage } = this.state;

		let childProps = {};

		if (fetching || (!fetched && !errorMessage)) {
			childProps = {
				loading: true,
				child: <Loader relative={true} background={false} />,
			};
		} else if (error || errorMessage) {
			childProps = {
				titleSection: {
					iconPath: ICONS['LETTER'],
					text: STRINGS['ERROR_TEXT'],
				},
				child: <div>{error || errorMessage}</div>,
			};
		} else {
			childProps = {
				titleSection: {
					iconId: 'SUCCESS_BLACK',
					iconPath: ICONS['SUCCESS_BLACK'],
					stringId: 'SUCCESS_TEXT',
					text: STRINGS['SUCCESS_TEXT'],
				},
				child: (
					<div className="text-center w-100">
						<div>{STRINGS['VERIFICATION_EMAIL.TEXT_1']}</div>
						<div>{STRINGS['VERIFICATION_EMAIL.TEXT_2']}</div>
						<Button
							label={STRINGS['LOGIN_TEXT']}
							className="button-margin"
							onClick={this.onClickLogin}
						/>
					</div>
				),
			};
		}

		return !this.state.confirm ? (
			<div
				className={classnames({ auth_wrapper: true })}
				style={{ padding: 30 }}
			>
				<div style={{ fontSize: 18, color: 'white', marginBottom: 10 }}>
					{STRINGS['VERIFICATION_EMAIL.CONFIRM_TEXT']}
				</div>
				<div style={{ marginBottom: 20 }}>
					{STRINGS['VERIFICATION_EMAIL.CONFIRM_DESCRIPTION']}
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						gap: 15,
						justifyContent: 'space-between',
						marginTop: 30,
					}}
				>
					<AntBtn
						onClick={() => {
							this.props.router.push('/');
						}}
						style={{
							backgroundColor: '#5D63FF',
							color: 'white',
							flex: 1,
							height: 35,
						}}
						type="default"
					>
						{STRINGS['VERIFICATION_EMAIL.CANCEL_BUTTON']}
					</AntBtn>
					<AntBtn
						onClick={async () => {
							this.setState({ confirm: true });
							const { code } = this.props.params;
							this.props.verifyCode({ verification_code: code });
						}}
						style={{
							backgroundColor: '#5D63FF',
							color: 'white',
							flex: 1,
							height: 35,
						}}
						type="default"
					>
						{STRINGS['VERIFICATION_EMAIL.CONFIRM_BUTTON']}
					</AntBtn>
				</div>
			</div>
		) : (
			<div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'f-1')}>
				<div
					className={classnames(
						...FLEX_CENTER_CLASSES,
						'flex-column',
						'w-100',
						{ auth_wrapper: !childProps.loading }
					)}
				>
					<IconTitle
						textType="title"
						className="w-100"
						{...childProps.titleSection}
					/>
					<div
						className={classnames(
							...FLEX_CENTER_CLASSES,
							'flex-column',
							'w-100',
							{ 'auth_form-wrapper': !childProps.loading }
						)}
					>
						{childProps.child}
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	data: state.auth.verification,
});

const mapDispatchToProps = (dispatch) => ({
	checkVerificationData: bindActionCreators(checkVerificationCode, dispatch),
	verifyCode: bindActionCreators(verifyVerificationCode, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(VerifyEmailCode));
