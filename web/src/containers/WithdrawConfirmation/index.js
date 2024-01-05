import React, { Component } from 'react';
import classnames from 'classnames';

import { IconTitle, Button, Loader } from 'components';
import { performConfirmWithdrawal } from 'actions/walletActions';
import { FLEX_CENTER_CLASSES } from 'config/constants';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { EditWrapper } from 'components';
import { Button as AntButton } from 'antd';

class ConfirmWithdrawal extends Component {
	state = {
		is_success: false,
		error_txt: '',
		loading: false,
	};

	componentDidMount() {
		if (this.props.routeParams.token) {
			this.confirmWithdrawal(this.props.routeParams.token);
		} else {
			// TODO: this text is dummy will change to en.js after approval.
			this.setState({ error_txt: 'Invalid token Please try again.' });
		}
	}

	confirmWithdrawal = (token) => {
		this.setState({ loading: true });
		return performConfirmWithdrawal(token)
			.then((response) => {
				this.setState({ is_success: true, error_txt: '', loading: false });
				return response;
			})
			.catch((err) => {
				this.setState({
					is_success: false,
					error_txt: err.response.data.message || err.message,
					loading: false,
				});
			});
	};

	handleTransaction = () => {
		this.props.router.push('/transactions?tab=3');
	};

	render() {
		const { is_success, error_txt, loading } = this.state;
		const { icons: ICONS } = this.props;
		let childProps = {};
		if (loading) {
			childProps = {
				loading,
				child: <Loader relative={true} background={false} />,
			};
		} else if (!is_success && error_txt) {
			childProps = {
				titleSection: {
					iconId: 'RED_WARNING',
					iconPath: ICONS['RED_WARNING'],
					stringId: 'ERROR_TEXT',
					text: STRINGS['ERROR_TEXT'],
				},
				child: (
					<div className="text-center mb-4">
						<div>{error_txt}</div>
					</div>
				),
			};
		} else {
			childProps = {
				titleSection: {
					iconId: 'GREEN_CHECK',
					iconPath: ICONS['GREEN_CHECK'],
					stringId: 'SUCCESS_TEXT',
					text: STRINGS['SUCCESS_TEXT'],
				},
				useSvg: true,
				child: (
					<div className="text-center mb-4">
						<div>
							<EditWrapper stringId="WITHDRAW_PAGE.WITHDRAW_CONFIRM_SUCCESS_1">
								{STRINGS['WITHDRAW_PAGE.WITHDRAW_CONFIRM_SUCCESS_1']}
							</EditWrapper>
						</div>
						<div>
							<EditWrapper stringId="WITHDRAW_PAGE.WITHDRAW_CONFIRM_SUCCESS_2">
								{STRINGS['WITHDRAW_PAGE.WITHDRAW_CONFIRM_SUCCESS_2']}
							</EditWrapper>
						</div>
					</div>
				),
			};
		}
		return (
			<div
				className={classnames(
					...FLEX_CENTER_CLASSES,
					'flex-column',
					'f-1',
					'withdrawal-confirm-warpper'
				)}
			>
				<div
					style={{
						backgroundColor: '#303236',
						width: 400,
						height: 400,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 20,
					}}
				>
					<div style={{ fontSize: 18, color: 'white', marginTop: 30 }}>
						Withdrawal Details
					</div>

					<div>
						<div>
							Amount: <span style={{ fontWeight: 'bold' }}> 5 XHT</span>{' '}
						</div>
						<hr style={{ borderBottom: '1px solid white' }} />
						<div>
							Fee: <span style={{ fontWeight: 'bold' }}> 6 XHT</span>{' '}
						</div>
						<hr style={{ borderBottom: '1px solid white' }} />
						<div>
							Address:{' '}
							<span style={{ fontWeight: 'bold' }}>
								{' '}
								0xb9b424250b1d5025f69d5c099b7a90f0a0a9c275
							</span>
						</div>
						<hr style={{ borderBottom: '1px solid white' }} />
						<div>
							Network: <span style={{ fontWeight: 'bold' }}> eth</span>
						</div>
					</div>

					<div>Please click the button below to confirm the withdrawal</div>
					<AntButton
						type="default"
						style={{ color: 'white', backgroundColor: '#7C81FF' }}
					>
						Confirm Withdrawal
					</AntButton>
				</div>
			</div>
		);
	}
}

export default withConfig(ConfirmWithdrawal);
