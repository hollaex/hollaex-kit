import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Filters from './Filters';
import TradeBlock from './TradeBlock';
import ActiveOrders from './ActiveOrders';
import LogoutInfoOrder from './LogoutInfoOrder';
import { cancelOrder, cancelAllOrders } from 'actions/orderAction';
import { isLoggedIn } from 'utils/token';
import { ActionNotification, Dialog, IconTitle, Button } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { activeOrdersSelector } from '../utils';
import { EditWrapper } from 'components';
import { setActiveOrdersMarket } from 'actions/appActions';

class OrdersWrapper extends Component {
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
		const {
			activeOrdersMarket,
			settings,
			cancelAllOrders,
			activeOrders,
		} = this.props;
		let cancelDelayData = [];
		activeOrders.forEach(({ id }) => {
			cancelDelayData = [...cancelDelayData, id];
		});
		this.setState({ cancelDelayData });
		setTimeout(() => {
			cancelAllOrders(activeOrdersMarket, settings);
			this.onCloseDialog();
		}, 700);
	};

	handleCancelOrders = (id) => {
		const { cancelOrder, settings } = this.props;
		this.setState({ cancelDelayData: this.state.cancelDelayData.concat(id) });
		setTimeout(() => {
			cancelOrder(id, settings);
		}, 700);
	};

	onCloseDialog = () => {
		this.setState({ showCancelAllModal: false });
	};

	render() {
		const {
			activeOrders,
			pairs,
			icons: ICONS,
			tool,
			activeOrdersMarket,
			setActiveOrdersMarket,
			goToTransactionsHistory,
		} = this.props;
		const { cancelDelayData, showCancelAllModal } = this.state;

		return (
			<Fragment>
				<TradeBlock
					title={`${STRINGS['TOOLS.OPEN_ORDERS']} (${activeOrders.length})`}
					action={
						isLoggedIn() ? (
							<ActionNotification
								stringId="TRANSACTION_HISTORY.TITLE"
								text={STRINGS['TRANSACTION_HISTORY.TITLE']}
								iconId="ARROW_TRANSFER_HISTORY_ACTIVE"
								iconPath={ICONS['ARROW_TRANSFER_HISTORY_ACTIVE']}
								onClick={() => goToTransactionsHistory('order-history')}
								status="information"
								className="trade-wrapper-action"
							/>
						) : (
							''
						)
					}
					stringId="TOOLS.OPEN_ORDERS"
					tool={tool}
					titleClassName="mb-4"
				>
					{isLoggedIn() ? (
						<Fragment>
							<Filters
								pair={activeOrdersMarket}
								onChange={setActiveOrdersMarket}
							/>
							<ActiveOrders
								pageSize={activeOrders.length}
								activeOrdersMarket={activeOrdersMarket}
								pairs={pairs}
								cancelDelayData={cancelDelayData}
								orders={activeOrders}
								onCancel={this.handleCancelOrders}
								onCancelAll={this.openConfirm}
							/>
						</Fragment>
					) : (
						<LogoutInfoOrder />
					)}
				</TradeBlock>
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
											activeOrdersMarket.toUpperCase()
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

OrdersWrapper.defaultProps = {
	activeOrders: [],
};

const mapStateToProps = (state) => ({
	activeOrders: activeOrdersSelector(state),
	settings: state.user.settings,
	activeOrdersMarket: state.app.activeOrdersMarket,
});

const mapDispatchToProps = (dispatch) => ({
	cancelOrder: bindActionCreators(cancelOrder, dispatch),
	cancelAllOrders: bindActionCreators(cancelAllOrders, dispatch),
	setActiveOrdersMarket: bindActionCreators(setActiveOrdersMarket, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(OrdersWrapper));
