import React, { Component } from 'react';
import classnames from 'classnames';

import { IconTitle, Button, Loader } from 'components';
import { performConfirmWithdrawal } from 'actions/walletActions';
import { FLEX_CENTER_CLASSES } from 'config/constants';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { EditWrapper } from 'components';
import { Button as AntBtn } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './_withdrawConfirmation.scss';

class ConfirmWithdrawal extends Component {
	state = {
		is_success: false,
		error_txt: '',
		loading: false,
		confirm: false,
	};

	componentDidMount() {
		if (!this.props.routeParams.token) {
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
		const { is_success, error_txt, loading, confirm } = this.state;
		const { icons: ICONS } = this.props;
		let childProps = {};
		if (!confirm) {
			const {
				currency,
				fee_coin,
				amount,
				address,
				fee,
				network,
			} = this.props.location.query;
			childProps = {
				child: (
					<div className="withdrawal-confirm-option">
						<div
							style={{
								fontSize: 18,
								color: 'white',
								marginTop: 10,
								marginBottom: 10,
							}}
						>
							<EditWrapper stringId="WITHDRAW_PAGE.WITHDRAW_CONFIRM_SUCCESS_2">
								{STRINGS['WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_FINAL']}
							</EditWrapper>
						</div>
						<div>
							<EditWrapper stringId="WITHDRAW_PAGE.WITHDRAW_CONFIRM_SUCCESS_2">
								{STRINGS['WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_WARNING']}
							</EditWrapper>
						</div>

						<div style={{ marginTop: 20 }}>
							<div>
								<EditWrapper stringId="WITHDRAW_PAGE.WITHDRAW_CONFIRM_SUCCESS_2">
									{STRINGS['WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_AMOUNT']}
								</EditWrapper>
								:{' '}
								<span style={{ fontWeight: 'bold' }}>
									{this.props?.coins?.[currency]?.logo && (
										<img
											src={this.props?.coins?.[currency]?.logo}
											alt={currency}
											width={20}
											height={20}
										/>
									)}{' '}
									{amount} {currency?.toUpperCase()}
								</span>{' '}
							</div>
							<hr style={{ borderBottom: '1px solid #ccc' }} />
							<div>
								<EditWrapper stringId="WITHDRAW_PAGE.WITHDRAW_CONFIRM_SUCCESS_2">
									{STRINGS['WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_FEE']}
								</EditWrapper>
								:{' '}
								<span style={{ fontWeight: 'bold' }}>
									{' '}
									{fee} {(fee_coin || currency)?.toUpperCase()}
								</span>{' '}
							</div>
							<hr style={{ borderBottom: '1px solid #ccc' }} />
							<div>
								<EditWrapper stringId="WITHDRAW_PAGE.WITHDRAW_CONFIRM_SUCCESS_2">
									{STRINGS['WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_ADDRESS']}
								</EditWrapper>
								: <span style={{ fontWeight: 'bold' }}> {address}</span>
							</div>
							<hr style={{ borderBottom: '1px solid #ccc' }} />
							<div>
								<EditWrapper stringId="WITHDRAW_PAGE.WITHDRAW_CONFIRM_SUCCESS_2">
									{STRINGS['WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_NETWORK']}
								</EditWrapper>
								:{' '}
								<span style={{ fontWeight: 'bold' }}>
									{' '}
									{network?.toUpperCase()}
								</span>
							</div>
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
									this.handleTransaction();
								}}
								style={{
									backgroundColor: '#5D63FF',
									color: 'white',
									flex: 1,
									height: 35,
								}}
								type="default"
							>
								<EditWrapper stringId="WITHDRAW_PAGE.WITHDRAW_CONFIRM_SUCCESS_2">
									{STRINGS['WITHDRAW_PAGE.WITHDRAWAL_CANCEL_BUTTON']}
								</EditWrapper>
							</AntBtn>
							<AntBtn
								onClick={async () => {
									this.setState({ confirm: true });
									this.confirmWithdrawal(this.props.routeParams.token);
								}}
								style={{
									backgroundColor: '#5D63FF',
									color: 'white',
									flex: 1,
									height: 35,
								}}
								type="default"
							>
								<EditWrapper stringId="WITHDRAW_PAGE.WITHDRAW_CONFIRM_SUCCESS_2">
									{STRINGS['WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_BUTTON']}
								</EditWrapper>
							</AntBtn>
						</div>
					</div>
				),
			};
		} else if (loading) {
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
					className={classnames(
						...FLEX_CENTER_CLASSES,
						'flex-column',
						'w-100',
						{ auth_wrapper: !loading }
					)}
				>
					<IconTitle
						textType="title"
						className="w-100"
						{...childProps.titleSection}
					/>
					{childProps.child}
					{!loading && confirm && (
						<Button
							className="w-50"
							stringId="WITHDRAW_PAGE.GO_WITHDRAWAL_HISTORY"
							label={STRINGS['WITHDRAW_PAGE.GO_WITHDRAWAL_HISTORY']}
							onClick={this.handleTransaction}
						/>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	coins: store.app.coins,
});

export default connect(mapStateToProps)(
	withRouter(withConfig(ConfirmWithdrawal))
);
