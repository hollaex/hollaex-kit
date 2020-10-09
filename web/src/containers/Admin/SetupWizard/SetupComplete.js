import React, { Component } from 'react';
import ReactSVG from 'react-svg';
import { Button } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { browserHistory } from 'react-router';

import { ICONS } from '../../../config/constants';
import { Carousel } from 'components';
import './index.css';

const Carousel_items = [
	{
		icon: ICONS.SETUP_SECTION_PRO_TRADING,
		title: 'Pro trading',
		description:
			'Provide the full crypto trading experience with charts,orderBook and order management.'
	},
	{
		icon: ICONS.SETUP_SECTION_PRICE_DISCOVERY,
		title: 'Simple coin price discovery and distribution',
		description:
			'Do away with long and complicated coin listing fees and begin your coins price discovery process and distribution right from your very own exchange.'
	},
	{
		icon: ICONS.SETUP_SECTION_QUICK_TRADE,
		title: 'Trade matching engine',
		description:
			'Match up various crypto assets and create new trading pairs.Allow the HollaEx engine to rapidly organize all orders and match all trades.'
	},
	{
		icon: ICONS.SETUP_SECTION_LIQUIDITY,
		title: 'Crypto liquidity',
		description:
			'No more dry orderbooks.Tab into the HollaEx network crypto liquidity pool and provide your users fair pricing for major crypto assets globally.'
	},
	{
		icon: ICONS.SETUP_SECTION_BACKOFFICE,
		title: 'Back office operator controls',
		description:
			'Manage users, wallet and other monitor the your exchange form the admin operator controls.Easy-to-use powerful controls for smooth exchange operations.'
	},
	{
		icon: ICONS.SETUP_SECTION_CRYPTO_WALLET,
		title: 'Multi crypto asset wallet',
		description:
			'Give your users their own secure wallet with balances, deposits, withdrawals and easy-to-use transaction history records.'
	},
	{
		icon: ICONS.SETUP_QUICK_TRADE,
		title: 'Quick trade',
		description:
			'Give your users a quick and easy way to trade crypto.Simple amount input and buying/selling'
	}
];

export default class ExchangeSetup extends Component {
	constructor () {
		super();
		this.state = {
			isLoading: true
		};
	}

	componentDidMount () {
		setTimeout(() => {
			this.setState({ isLoading: false });
		}, 10000);
	}

	renderStatus = () => {
		return (
			<div className='icon-wrapper'>
				<img src={ICONS.SETUP_SECTION_LOADING} alt='Loading' />
			</div>
		);
	};

	CarouselData = () => {
		return Carousel_items.map((value, index) => {
			return (
				<div key={index}>
					<div className='icon-wrapper'>
						<ReactSVG
							path={value.icon}
							wrapperClassName='icon-align'
						/>
					</div>
					<div className='setup-field-label'>{value.title}</div>
					<div className='description'>
						{value.description}
					</div>
				</div>
			);
		});
	};

	goToAccount = () => browserHistory.push('/account');

	render () {
        const menuItems = this.CarouselData();
		return (
			<div className='wizard-container'>
				<div className="wizard-complete-status">
					{this.state.isLoading ? this.renderStatus() : <CheckCircleFilled />}
				</div>
				<div className='content'>
					<div>
						{this.state.isLoading ? (
							<div className='header'>YOUR EXCHANGE IS GETTING SETUP...</div>
						) : (
							<div>
								<div className='header'>EXCHANGE SETUP IS COMPLETE</div>
								<div className='description'>
									Your exchange is set up and ready to be used.
								</div>
							</div>
						)}
						<Carousel
							items={menuItems}
							groupItems={1}
						/>
						<div className='btn-container'>
							<Button
								className='exchange-btn'
								disabled={this.state.isLoading}
								onClick={this.gotoAccount}
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
