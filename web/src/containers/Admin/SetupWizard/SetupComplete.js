import React, { Component } from 'react';
import { ReactSVG } from 'react-svg';
import { Button, message } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { withRouter } from 'react-router';

import { STATIC_ICONS } from 'config/icons';
import { Carousel } from '../../../components';
import { setSetupCompleted } from '../../../utils/initialize';
import { getCompleteSetup } from '../Settings/action';

import './index.css';

const Carousel_items = [
	{
		icon: STATIC_ICONS.SETUP_SECTION_PRO_TRADING,
		title: 'Pro trading',
		description:
			'Manage users accounts and wallets on your exchange from the admin operator control panel. Easy-to-use powerful controls for smooth exchange operations.',
	},
	{
		icon: STATIC_ICONS.SETUP_SECTION_PRICE_DISCOVERY,
		title: 'Simple coin price discovery and distribution',
		description:
			'Do away with long and complicated coin listing fees and begin your coins price discovery process and distribution right from your very own exchange.',
	},
	{
		icon: STATIC_ICONS.SETUP_SECTION_QUICK_TRADE,
		title: 'Trade matching engine',
		description:
			'Match up various crypto assets and create new trading pairs. Allow the HollaEx engine to rapidly organize all orders and match all trades.',
	},
	{
		icon: STATIC_ICONS.SETUP_SECTION_LIQUIDITY,
		title: 'Crypto liquidity',
		description:
			'No more dry orderbooks. Tap into the HollaEx network crypto liquidity pool and provide your users fair pricing for major crypto assets globally.',
	},
	{
		icon: STATIC_ICONS.SETUP_SECTION_BACKOFFICE,
		title: 'Back office operator controls',
		description:
			'Manage users, wallet and other monitor the your exchange form the admin operator controls. Easy-to-use powerful controls for smooth exchange operations.',
	},
	{
		icon: STATIC_ICONS.SETUP_SECTION_CRYPTO_WALLET,
		title: 'Multi crypto asset wallet',
		description:
			'Give your users their own secure wallet with balances, deposits, withdrawals and easy-to-use transaction history records.',
	},
	{
		icon: STATIC_ICONS.SETUP_QUICK_TRADE,
		title: 'Quick trade',
		description:
			'Give your users a quick and easy way to trade crypto. Simple amount input and buying/selling.',
	},
];

class ExchangeSetup extends Component {
	constructor() {
		super();
		this.state = {
			isLoading: true,
			buttonLoading: false,
		};
	}

	componentDidMount() {
		setTimeout(() => {
			this.setState({ isLoading: false });
		}, 10000);
	}

	renderStatus = () => {
		return (
			<div className="icon-wrapper">
				<img src={STATIC_ICONS.SETUP_SECTION_LOADING} alt="Loading" />
			</div>
		);
	};

	CarouselData = () => {
		return Carousel_items.map((value, index) => {
			return (
				<div key={index}>
					<div className="icon-wrapper">
						<ReactSVG
							src={value.icon}
							className={
								value.icon === STATIC_ICONS.SETUP_QUICK_TRADE
									? null
									: 'icon-align'
							}
							beforeInjection={(svg) => {
								if (value.icon === STATIC_ICONS.SETUP_QUICK_TRADE) {
									svg.setAttribute('width', '216px');
									svg.setAttribute('height', '216px');
								}
							}}
						/>
					</div>
					<div className="setup-field-label">{value.title}</div>
					<div className="description">{value.description}</div>
				</div>
			);
		});
	};

	goToAccount = () => {
		this.setState({ buttonLoading: true });
		getCompleteSetup()
			.then((res) => {
				this.setState({ buttonLoading: false });
				setSetupCompleted(true);
				this.props.router.push('/account');
			})
			.catch((err) => {
				this.setState({ buttonLoading: false });
				let errMsg = err.message;
				if (
					err.data &&
					err.data.message &&
					err.data.message.includes(
						'Exchange setup is already flagged as completed'
					)
				) {
					this.props.router.push('/account');
					errMsg = err.data.message;
				}
				message.error(errMsg);
			});
	};

	render() {
		const menuItems = this.CarouselData();
		return (
			<div className="wizard-container">
				<div className="wizard-complete-status">
					{this.state.isLoading ? this.renderStatus() : <CheckCircleFilled />}
				</div>
				<div className="content">
					<div>
						{this.state.isLoading ? (
							<div className="header">YOUR EXCHANGE IS GETTING SETUP...</div>
						) : (
							<div>
								<div className="header">EXCHANGE SETUP IS COMPLETE</div>
								<div className="description">
									Your exchange is set up and ready to be used.
								</div>
							</div>
						)}
						<Carousel
							items={menuItems}
							groupItems={1}
							isInfinite={true}
							isActive={false}
						/>
						<div className="btn-container">
							<Button
								className="exchange-complete-btn"
								disabled={this.state.isLoading}
								onClick={this.goToAccount}
								loading={this.state.buttonLoading}
							>
								Enter Your Exchange
							</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(ExchangeSetup);
