import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';

import MobileOrders from '../MobileOrders';
import { cancelOrder, cancelAllOrders } from 'actions/orderAction';
import { isLoggedIn } from 'utils/token';
import { Dialog, IconTitle, Button } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { userTradesSelector, activeOrdersSelector } from '../utils';
import { EditWrapper } from 'components';

class MobileOrdersWrapper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cancelDelayData: [],
			showCancelAllModal: false,
		};
	}

	openConfirm = () => {
		this.setState({
			showCancelAllModal: true,
		});
	};

	cancelAllOrders = () => {
		let cancelDelayData = [];
		this.props.activeOrders.map((order) => {
			cancelDelayData = [...cancelDelayData, order.id];
			return '';
		});
		this.setState({ cancelDelayData });
		setTimeout(() => {
			this.props.cancelAllOrders(this.props.pair, this.props.settings);
			this.onCloseDialog();
		}, 700);
	};

	handleCancelOrders = (id) => {
		this.setState({ cancelDelayData: this.state.cancelDelayData.concat(id) });
		setTimeout(() => {
			this.props.cancelOrder(id, this.props.settings);
		}, 700);
	};

	onCloseDialog = () => {
		this.setState({ showCancelAllModal: false });
	};

	render() {
		const {
			pair,
			pairData,
			activeOrders,
			userTrades,
			activeTheme,
			pairs,
			coins,
			icons: ICONS,
			goToTransactionsHistory,
		} = this.props;
		const { cancelDelayData, showCancelAllModal } = this.state;

		return (
			<Fragment>
				{isMobile && (
					<MobileOrders
						isLoggedIn={isLoggedIn()}
						activeOrders={activeOrders}
						cancelOrder={this.handleCancelOrders}
						cancelDelayData={cancelDelayData}
						cancelAllOrders={this.openConfirm}
						goToTransactionsHistory={goToTransactionsHistory}
						pair={pair}
						pairData={pairData}
						pairs={pairs}
						coins={coins}
						userTrades={userTrades}
						activeTheme={activeTheme}
					/>
				)}
				<Dialog
					isOpen={showCancelAllModal}
					label="token-modal"
					onCloseDialog={this.onCloseDialog}
					shouldCloseOnOverlayClick={true}
					showCloseText={false}
				>
					<div className="quote-review-wrapper">
						<IconTitle
							iconId="CANCEL_ORDERS"
							iconPath={ICONS['CANCEL_ORDERS']}
							stringId="CANCEL_ORDERS.HEADING"
							text={STRINGS['CANCEL_ORDERS.HEADING']}
							textType="title"
							underline={true}
							className="w-100"
						/>
						<div>
							<div>
								<EditWrapper stringId="CANCEL_ORDERS.SUB_HEADING">
									<div>{STRINGS['CANCEL_ORDERS.SUB_HEADING']}</div>
								</EditWrapper>
							</div>
							<div className="mt-3">
								<EditWrapper stringId="CANCEL_ORDERS.INFO_1">
									<div>
										{STRINGS.formatString(
											STRINGS['CANCEL_ORDERS.INFO_1'],
											pairData.display_name
										)}
									</div>
								</EditWrapper>
							</div>
							<div className="mt-1 mb-5">
								<EditWrapper stringId="CANCEL_ORDERS.INFO_2">
									<div>{STRINGS['CANCEL_ORDERS.INFO_2']}</div>
								</EditWrapper>
							</div>
							<div className="w-100 buttons-wrapper d-flex">
								<Button
									label={STRINGS['BACK_TEXT']}
									onClick={this.onCloseDialog}
								/>
								<div className="separator" />
								<Button
									label={STRINGS['CONFIRM_TEXT']}
									onClick={this.cancelAllOrders}
								/>
							</div>
						</div>
					</div>
				</Dialog>
			</Fragment>
		);
	}
}

MobileOrdersWrapper.defaultProps = {
	activeOrders: [],
	userTrades: [],
};

const mapStateToProps = (state) => ({
	activeOrders: activeOrdersSelector(state),
	userTrades: userTradesSelector(state),
	settings: state.user.settings,
});

const mapDispatchToProps = (dispatch) => ({
	cancelOrder: bindActionCreators(cancelOrder, dispatch),
	cancelAllOrders: bindActionCreators(cancelAllOrders, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(MobileOrdersWrapper));
