import React, { useState } from 'react';
import { ReactSVG } from 'react-svg';
import { Button, Modal, Spin } from 'antd';
import { StarFilled, InfoCircleOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { Carousel } from 'components';
import { STATIC_ICONS } from 'config/icons';
import { setSelectedPlugin } from '../../../actions/appActions';

import './plugin.scss';

const PluginDetails = ({
	pluginData,
	selectedPlugin = {},
	isLoading,
	setSelectedPlugin,
	router,
}) => {
	const [isOpen, setOpen] = useState(false);

	const renderButtonContent = () => {
		const tempPluginData = {
			...pluginData,
			only_for: ['boost', 'crypto'],
			free_for: [],
		};
		if (tempPluginData.payment_type === 'free') {
			return (
				<div onClick={() => setOpen(true)} className="button-wrapper">
					<Button type="primary">Install</Button>
					<p>Free to install</p>
				</div>
			);
		} else {
			return (
				<Button onClick={() => setOpen(true)} type="primary">
					Buy
				</Button>
			);
		}
	};

	const getCards = () => {
		const cardData = [
			{
				logo:
					pluginData && pluginData.logo
						? pluginData.logo
						: STATIC_ICONS.DEFAULT_PLUGIN_PREVIEW,
			},
		];
		return cardData.map((data) => (
			<div>
				<img src={data.logo} alt="PluginCard" className="plugin-card" />
				<div className="d-flex mt-2 ml-1">
					<StarFilled />
					<div>Featured plugin</div>
				</div>
			</div>
		));
	};

	const onHandleBuy = () => {
		setSelectedPlugin(selectedPlugin);
		router.push('/admin/billing');
	};

	if (isLoading) {
		return (
			<div className="app_container-content d-flex justify-content-center">
				<Spin size="large" />
			</div>
		);
	}
	const {
		name,
		description,
		author,
		payment_type,
		price,
		version,
		logo,
		free_for,
	} = pluginData;
	return (
		<div>
			<div className="plugin-details-wrapper">
				<div className="main-content">
					<div className="d-flex justify-content-between">
						<div className="d-flex">
							<img
								src={
									pluginData && pluginData.icon
										? pluginData.icon
										: STATIC_ICONS.DEFAULT_PLUGIN_THUMBNAIL
								}
								alt="Plugin"
								className="plugin-icon"
							/>
							<div className="plugin-container">
								<div className="plugin-content-wrapper">
									<div className="title-wrapper">
										{' '}
										<h4>{pluginData.name}</h4>{' '}
										<h5> {`Version: ${pluginData.version}`}</h5>{' '}
									</div>
									<p>{`Description: ${pluginData.description}`}</p>
									<div>
										{' '}
										{!pluginData?.free_for?.length ? (
											<>
												Note: <InfoCircleOutlined />{' '}
												{pluginData?.free_for?.map((item) => (
													<p>{item}</p>
												))}
											</>
										) : (
											''
										)}{' '}
									</div>
									<p>
										Author:
										<ReactSVG
											src={STATIC_ICONS['VERIFIED_BADGE_PLUGIN_APPS']}
										/>{' '}
										{pluginData.author}
									</p>
									<p>
										{' '}
										{pluginData.payment_type &&
										pluginData.payment_type === 'one-time' ? (
											<>
												Type:{' '}
												<ReactSVG
													src={STATIC_ICONS['ONE_TIME_ACTIVATION_PLUGIN']}
												/>{' '}
												{pluginData.type}
											</>
										) : pluginData.payment_type === 'credits' ? (
											<>
												Type: <ReactSVG src={STATIC_ICONS['CREDITS_PLUGIN']} />{' '}
												{pluginData.type}
											</>
										) : (
											''
										)}{' '}
									</p>
									{pluginData.price && (
										<div>
											<p>Price: </p>{' '}
											<h6>
												{' '}
												{pluginData.payment_type === 'free'
													? 'Free'
													: `$ ${pluginData.price}`}
											</h6>
										</div>
									)}
									{renderButtonContent()}
								</div>
							</div>
						</div>
						<div className="plugin-carousel-wrapper ml-3">
							<Carousel items={getCards()} />
						</div>
					</div>
				</div>
			</div>
			<div className="plugin-divider"></div>
			<div className="plugin-details-wrapper">
				<div>
					<div>
						<div className="about-label">About</div>
						<div className="about-contents">
							<b>OverView</b>
							<div className="my-3">{pluginData.description}</div>
							<div className="my-5">
								<h2>Main features</h2>
							</div>
						</div>
					</div>
				</div>
				<Modal
					visible={isOpen}
					onCancel={() => setOpen(false)}
					width="400px"
					className="buy-modal"
					footer={
						<div className="buy-modal-footer">
							<div>
								<p>Do you want proceed with purchase?</p>
								<Button type="success" onClick={onHandleBuy}>
									Buy
								</Button>
							</div>
							<h6>
								*All plugin app purchases are conducted in cryptocurrency only
							</h6>
						</div>
					}
				>
					<div className="buy-modal-container">
						<h5>Buy plugin app</h5>
						<div className="buy-content-wrapper">
							<img src={logo} alt="" className="exchange-plugin-image" />
							<div>
								<p>
									{' '}
									<p>{`Name:  ${name}`}</p> <h5> {`version | ${version}`}</h5>{' '}
								</p>
								<p>{`Description: ${description}`}</p>
								<p>
									{' '}
									{!free_for?.length ? (
										<>
											Note: <InfoCircleOutlined />{' '}
											{free_for?.map((item) => (
												<p>{item}</p>
											))}
										</>
									) : (
										''
									)}{' '}
								</p>
								<p>
									Author:
									<ReactSVG
										src={STATIC_ICONS['VERIFIED_BADGE_PLUGIN_APPS']}
									/>{' '}
									{author}
								</p>
								<p>
									{' '}
									{payment_type && payment_type === 'one-time' ? (
										<>
											Type:{' '}
											<ReactSVG
												src={STATIC_ICONS['ONE_TIME_ACTIVATION_PLUGIN']}
											/>{' '}
											{payment_type}
										</>
									) : payment_type === 'credits' ? (
										<>
											Type: <ReactSVG src={STATIC_ICONS['CREDITS_PLUGIN']} />{' '}
											{payment_type}
										</>
									) : (
										''
									)}{' '}
								</p>
								{price && (
									<p>
										<p>Price: </p>{' '}
										<h6> {payment_type === 'free' ? 'Free' : `$ ${price}`}</h6>
									</p>
								)}
							</div>
						</div>
					</div>
				</Modal>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		exchange: state.asset.exchange,
	};
};

export default connect(mapStateToProps, { setSelectedPlugin })(PluginDetails);
