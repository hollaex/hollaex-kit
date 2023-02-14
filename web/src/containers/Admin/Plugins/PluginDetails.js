import React, { useState, useEffect, useCallback } from 'react';
import { Button, Modal, Divider, Spin, message } from 'antd';
import {
	StarFilled,
	ClockCircleOutlined,
	InfoCircleOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { Carousel, BlueLink } from 'components';
import STRINGS from 'config/localizedStrings';
import { STATIC_ICONS } from 'config/icons';
import {
	addPlugin,
	updatePlugins,
	getPluginActivateDetails,
	getPluginStoreDetails,
} from './action';
import { setSelectedPlugin } from '../../../actions/appActions';
import ConfirmPlugin from './ConfirmPlugin';

const PluginDetails = ({
	handleBreadcrumb,
	selectedNetworkPlugin = {},
	selectedPlugin = {},
	handlePluginList,
	updatePluginList,
	removePlugin,
	pluginData,
	isLoading,
	restart,
	handleRedirect,
	exchange,
	activatedPluginDetails,
	getActivationsPlugin,
	setSelectedPlugin,
	router,
}) => {
	const [isOpen, setOpen] = useState(false);
	const [type, setType] = useState('');
	const [isConfirm, setConfirm] = useState(true);
	const [isAddLoading, setAddLoading] = useState(false);
	const [isVersionUpdate, setUpdate] = useState(false);
	const [isUpdateLoading, setUpdateLoading] = useState(false);
	const [pluginStoreDetails, setPluginStoreDetails] = useState({});
	// const [isLoading, setLoading] = useState(false);

	const checkactivatedPlugin = (name) => {
		const data = activatedPluginDetails.filter((item) => item.name === name);
		return data.length ? true : false;
	};

	const requestPlugin = useCallback(() => {
		getPluginStoreDetails({ name: selectedPlugin.name })
			.then((res) => {
				setPluginStoreDetails(res);
			})
			.catch((err) => {
				if (!selectedPlugin.enabled) {
					setPluginStoreDetails({});
				}
			});
	}, [selectedPlugin]);

	useEffect(() => {
		requestPlugin();
	}, [requestPlugin]);

	const onHandlePluginActivate = async () => {
		getPluginActivateDetails({ name: selectedPlugin.name })
			.then((res) => {
				if (
					res &&
					res.data &&
					res.data?.message === 'success' &&
					res.data?.is_active
				) {
					getActivationsPlugin();
				}
			})
			.catch((err) => {
				throw err;
			});
	};
	const handleAddPlugin = async () => {
		const data = Object.keys(pluginStoreDetails)?.length
			? pluginStoreDetails
			: pluginData;
		const body = {
			...data,
			enabled: true,
		};
		setAddLoading(true);
		addPlugin(body)
			.then((res) => {
				setAddLoading(false);
				handlePluginList(res);
				restart(() => message.success('Plugin installed successfully'));
				handleRedirect();
			})
			.catch((err) => {
				setAddLoading(false);
				const _error =
					err.data && err.data.message ? err.data.message : err.message;
				message.error(_error);
			});
	};

	const handleUpdatePlugin = () => {
		handleClose();
		const body = {
			...selectedNetworkPlugin,
		};
		setUpdateLoading(true);
		updatePlugins({ name: pluginData.name }, body)
			.then((res) => {
				setUpdateLoading(false);
				updatePluginList(pluginData);
				restart(() => message.success('Plugin updated successfully'));
			})
			.catch((err) => {
				setUpdateLoading(false);
				const _error =
					err.data && err.data.message ? err.data.message : err.message;
				message.error(_error);
			});
	};

	const handleClose = () => {
		setOpen(false);
		setType('');
		setUpdate(false);
	};

	const handleAdd = () => {
		handleClose();
		handleAddPlugin();
	};

	const handleType = (type) => {
		setOpen(true);
		setType(type);
	};

	const handleRemove = (type) => {
		setType(type);
		removePlugin({ name: pluginData.name });
		handleClose();
		restart(() => message.success('Removed plugin successfully'));
	};

	const handleChange = (e) => {
		if (e.target.value === 'I UNDERSTAND') {
			setConfirm(false);
		} else {
			setConfirm(true);
		}
	};

	const handleUpdate = () => {
		setOpen(true);
		setUpdate(true);
	};

	const renderPopup = () => {
		switch (type) {
			case 'remove':
				return (
					<div className="admin-plugin-modal-wrapper">
						<div className="remove-wrapper">
							<img
								src={STATIC_ICONS.PLUGIN_REMOVAL_WHITE}
								alt="Plugin"
								className="plugin-removal-icon"
							/>
							<h5>
								<b>Plugin removal</b>
							</h5>
							<div>
								Removing a plugin will discontinue any functionality it provides
								to your exchange. This may have unknown effects on your
								exchange.
							</div>
							<div className="my-4 btn-wrapper d-flex justify-content-between">
								<Button
									type="primary"
									className="add-btn"
									onClick={handleClose}
								>
									Back
								</Button>
								<Button
									type="primary"
									className="add-btn"
									onClick={() => handleType('confirm-plugin')}
								>
									I understand. Proceed.
								</Button>
							</div>
						</div>
					</div>
				);
			case 'confirm-plugin':
				return (
					<ConfirmPlugin
						header={'Confirm plugin removal'}
						description={`Please acknowledge that you understand the possible ramifications of removing this plugin from your exchange.`}
						pluginData={pluginData}
						isConfirm={isConfirm}
						isShowThumbnail={true}
						onHandleBack={() => handleType('remove')}
						okBtnlabel={'Remove'}
						onHandleChange={handleChange}
						onHandleSubmit={() => handleRemove('confirm-plugin')}
					/>
				);
			case 'buy':
				return (
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
									{!!pluginData?.free_for?.length ? (
										<>
											<p>Note:</p>{' '}
											<div>
												<InfoCircleOutlined />
											</div>{' '}
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
											{pluginData.payment_type}
										</>
									) : pluginData.payment_type === 'credits' ? (
										<>
											Type: <ReactSVG src={STATIC_ICONS['CREDITS_PLUGIN']} />{' '}
											{pluginData.payment_type}
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
							</div>
						</div>
					</div>
				);
			default:
				return (
					<div className="admin-plugin-modal-wrapper">
						<h2>
							{isVersionUpdate ? <b>Update plugin</b> : <b>Add plugin</b>}
						</h2>
						<div className="d-flex mt-4">
							<img
								src={
									pluginData && pluginData.icon
										? pluginData.icon
										: STATIC_ICONS.DEFAULT_PLUGIN_THUMBNAIL
								}
								alt="Plugin"
								className="plugin-icon"
							/>
							<div className="mx-3">
								<div>
									<b>Name:</b> {pluginData.name}
								</div>
								<div className="my-2">
									<b>Description:</b> {pluginData.description}
								</div>
								<div className="my-2">
									<b>Author:</b> {pluginData.author}
								</div>
								{isVersionUpdate ? (
									<div>
										<div>
											<b>Currently installed versions:</b>{' '}
											{selectedPlugin.version}
										</div>
										<div className="my-2 d-flex">
											<b>Newest version:</b> {pluginData.version}
										</div>
									</div>
								) : (
									<div>
										<b>Version:</b> {pluginData.version}
									</div>
								)}
							</div>
						</div>
						<Divider />
						{isVersionUpdate ? (
							<div>Are you sure you want to update this plugin?</div>
						) : (
							<div>Are you sure you want to add this plugin?</div>
						)}
						<div className="my-4">
							{isVersionUpdate ? (
								<Button
									type="primary"
									className="add-btn"
									onClick={handleUpdatePlugin}
								>
									Update
								</Button>
							) : (
								<Button type="primary" className="add-btn" onClick={handleAdd}>
									Add
								</Button>
							)}
						</div>
					</div>
				);
		}
	};

	const renderButtonContent = () => {
		const { payment_type, only_for, name, free_for } = pluginData;
		if (isAddLoading || isUpdateLoading) {
			return (
				<div className="d-flex mt-5">
					<ClockCircleOutlined />
					<div>
						{isUpdateLoading
							? 'Update is in progress...'
							: 'Installation in progress...'}
					</div>
				</div>
			);
		} else if (selectedPlugin.enabled) {
			return (
				<div className="btn-wrapper mt-3">
					<div className="d-flex justify-content-between">
						<Button
							type="primary"
							className="remove-btn mr-2"
							onClick={() => handleType('remove')}
						>
							Remove
						</Button>
						<Button
							type="primary"
							className="config-btn"
							onClick={handleBreadcrumb}
						>
							Configure
						</Button>
					</div>
					{selectedPlugin.url && (
						<div className="text-align-center">
							<a
								href={selectedPlugin.url}
								target="_blank"
								rel="noopener noreferrer"
								className="underline-text pointer"
							>
								Learn more
							</a>{' '}
							about this plugin
						</div>
					)}
					<div className="d-flex align-items-center justify-content-end">
						{selectedNetworkPlugin.version > selectedPlugin.version && (
							<div className="d-flex align-items-center flex-column">
								<Button
									type="primary"
									className="update-btn"
									onClick={handleUpdate}
								>
									Update
								</Button>
								<div className="d-flex">
									<div className="small-circle"></div>
									<div className="update-txt">{`v${selectedNetworkPlugin.version} available`}</div>
								</div>
							</div>
						)}
					</div>
				</div>
			);
		} else {
			if (
				payment_type?.toLowerCase() === 'activation' ||
				(name?.toLowerCase() === 'exclusive' &&
					only_for?.length &&
					!only_for?.includes(exchange.plan) &&
					free_for?.length &&
					!free_for?.includes(exchange.plan)) ||
				(only_for?.length &&
					!only_for?.includes(exchange.plan) &&
					free_for?.length &&
					!free_for?.includes(exchange.plan))
			) {
				let btnDisabled = false;
				if (
					payment_type?.toLowerCase() !== 'activation' &&
					only_for?.length &&
					!only_for?.includes(exchange.plan) &&
					free_for?.length &&
					!free_for?.includes(exchange.plan)
				) {
					btnDisabled = true;
				}
				return (
					<div className="btn-wrapper">
						<Button
							type="primary"
							className="add-btn"
							onClick={onHandlePluginActivate}
							disabled={btnDisabled}
						>
							Activate
						</Button>
						{btnDisabled ? (
							<div className="ml-2 font-weight-bold">
								{STRINGS['TERMS_OF_SERVICES.TO_GET_ACCESS']}
								<BlueLink
									href="mailto:sales@hollaex.com"
									text={'sales@hollaex.com'}
								/>
							</div>
						) : null}
					</div>
				);
			} else if (
				(payment_type === 'free' ||
					checkactivatedPlugin(name) ||
					(free_for?.includes(exchange.plan) && !only_for?.length) ||
					(free_for?.includes(exchange.plan) &&
						only_for?.includes(exchange.plan))) &&
				pluginData?.name?.toLowerCase() !== 'exclusive'
			) {
				return (
					<div className="btn-wrapper">
						<Button
							type="primary"
							className="add-btn"
							onClick={() => handleType('add')}
						>
							Install
						</Button>
						{pluginData.payment_type === 'free' ? (
							<div className="small-txt">Free to install</div>
						) : null}
					</div>
				);
			} else if (
				payment_type !== 'free' &&
				((!free_for?.length && !only_for?.length) ||
					(!free_for?.includes(exchange.plan) && !only_for?.length) ||
					name.toLowerCase() === 'exclusive')
			) {
				return (
					<div className="btn-wrapper">
						<Button
							type="primary"
							className="add-btn"
							onClick={() => handleType('buy')}
							disabled={!Object.keys(pluginData).length}
						>
							Buy
						</Button>
					</div>
				);
			}
		}
	};

	const onHandleBuy = () => {
		setSelectedPlugin(selectedPlugin);
		router.push('/admin/billing');
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

	if (isLoading) {
		return (
			<div className="app_container-content d-flex justify-content-center">
				<Spin size="large" />
			</div>
		);
	}

	const {
		icon,
		name,
		description,
		author,
		payment_type,
		price,
		version,
		free_for,
		only_for,
	} = pluginData;

	let isPriceTagHide = true;
	if (
		payment_type?.toLowerCase() !== 'activation' &&
		only_for?.length &&
		!only_for?.includes(exchange.plan) &&
		free_for?.length &&
		!free_for?.includes(exchange.plan)
	) {
		isPriceTagHide = false;
	} else if (price && payment_type.toLowerCase() !== 'activation') {
		isPriceTagHide = true;
	}

	let isPriceFreeTag = false;

	if (
		(payment_type === 'free' ||
			checkactivatedPlugin(name) ||
			(free_for?.includes(exchange.plan) && !only_for?.length) ||
			(free_for?.includes(exchange.plan) &&
				only_for?.includes(exchange.plan))) &&
		pluginData?.name?.toLowerCase() !== 'exclusive'
	) {
		isPriceFreeTag = true;
	}

	return (
		<div>
			<div className="plugin-details-wrapper">
				<div className="main-content">
					<div className="d-flex justify-content-between">
						<div className="d-flex">
							<img
								src={
									pluginData && icon
										? icon
										: STATIC_ICONS.DEFAULT_PLUGIN_THUMBNAIL
								}
								alt="Plugin"
								className="plugin-icon"
							/>
							<div className="plugin-container">
								<div className="plugin-content-wrapper">
									<div className="title-wrapper">
										{' '}
										<h4>{name}</h4> <h5> {`Version: ${version}`}</h5>{' '}
									</div>
									<p>{`Description: ${description}`}</p>
									<div>
										{' '}
										{!!free_for?.length ? (
											<>
												<p>Note:</p>{' '}
												<div>
													<InfoCircleOutlined />
												</div>{' '}
												{free_for?.map((item) => (
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
										{author}
									</p>
									{free_for?.length ? (
										<p>
											{' '}
											Free For: <>{free_for.join(' ')}</>{' '}
										</p>
									) : null}
									{only_for?.length ? (
										<p>
											{' '}
											Only For: <>{only_for.join(' ')}</>{' '}
										</p>
									) : null}

									{payment_type && payment_type !== 'free' ? (
										<p>
											Payment Type:{' '}
											<ReactSVG
												src={
													payment_type === 'one-time'
														? STATIC_ICONS['ONE_TIME_ACTIVATION_PLUGIN']
														: STATIC_ICONS['CREDITS_PLUGIN']
												}
											/>{' '}
											{payment_type}{' '}
											{payment_type === 'one-time' ? 'activation' : null}
										</p>
									) : null}
									{price && isPriceTagHide ? (
										<div>
											<p>Price: </p>{' '}
											<h6>
												{' '}
												{isPriceFreeTag
													? 'Free'
													: payment_type?.toLowerCase() === 'activation'
													? 'Activation'
													: `$ ${price}`}
											</h6>
										</div>
									) : null}
								</div>
								{renderButtonContent()}
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
					width={450}
					onCancel={handleClose}
					footer={
						type === 'buy' ? (
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
						) : (
							false
						)
					}
				>
					{renderPopup()}
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
