import React, { useState, useEffect, useCallback } from 'react';
import { Button, Modal, Divider, Input, Spin } from 'antd';
import { StarFilled } from '@ant-design/icons';

import { STATIC_ICONS } from 'config/icons';
import { addPlugin, getPlugin } from './action';

const PluginDetails = ({
	handleBreadcrumb,
	selectedPlugin = {},
	removePlugin,
}) => {
	const [isOpen, setOpen] = useState(false);
	const [type, setType] = useState('');
	const [isConfirm, setConfirm] = useState(true);
	const [isLoading, setLoading] = useState(false);
	const [pluginData, setPlugin] = useState({});

	const requestPlugin = useCallback(() => {
		setLoading(true);
		getPlugin({ name: selectedPlugin.name })
			.then((res) => {
				setLoading(false);
				if (res) {
					setPlugin(res);
				}
			})
			.catch((err) => {
				setLoading(false);
			});
	}, [selectedPlugin]);

	useEffect(() => {
		requestPlugin();
	}, [requestPlugin]);

	const handleAddPlugin = async () => {
		const body = {
			name: pluginData.name,
			script: pluginData.script,
			version: pluginData.version,
			description: pluginData.description,
			author: pluginData.author,
			enabled: true,
		};
		addPlugin(body)
			.then((res) => {
				console.log('res', res);
			})
			.catch((err) => {
				console.log('err', err);
			});
	};

	const handleClose = () => {
		setOpen(false);
		setType('');
	};

	const handleAdd = (value) => {
		handleClose();
		handleAddPlugin();
	};

	const handleType = (type) => {
		setOpen(true);
		setType(type);
	};

	const handleRemove = (type) => {
		setType(type);
		removePlugin();
		handleClose();
	};

	const handleChange = (e) => {
		if (e.target.value === 'I UNDERSTAND') {
			setConfirm(false);
		} else {
			setConfirm(true);
		}
	};

	const renderPopup = () => {
		switch (type) {
			case 'remove':
				return (
					<div className="modal-wrapper">
						<div className="remove-wrapper">
							<img
								src={STATIC_ICONS.PLUGIN_THUMBNAIL.robolla}
								alt="Plugin"
								className="plugin-icon"
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
					<div className="modal-wrapper">
						<div className="confirm-plugin-wrapper">
							<h5>
								<b>Confirm plugin removal</b>
							</h5>
							<div>
								Please acknowledge that you understand the possible
								ramifications of removing this plugin from your exchange.
							</div>
							<div className="d-flex">
								<img
									src={
										pluginData.icon
											? pluginData.icon
											: STATIC_ICONS.DEFAULT_PLUGIN_THUMBNAIL
									}
									alt="plugin-icons"
									className="plugins-icon"
								/>
								<div className="my-5 mx-3">
									<h2>{pluginData.name}</h2>
									<div>
										<b>Version:</b> {pluginData.version}
									</div>
								</div>
							</div>
							<div>
								Type 'I UNDERSTAND' to confirm
								<Input className="mt-2" onChange={handleChange} />
							</div>

							<div className="my-4 btn-wrapper d-flex justify-content-between">
								<Button
									type="primary"
									className="add-btn"
									onClick={() => handleType('remove')}
								>
									Back
								</Button>
								<Button
									type="primary"
									className="remove-btn"
									// onClick={() => handleType('confirm-plugin')}
									onClick={() => handleRemove('confirm-plugin')}
									disabled={isConfirm}
								>
									Remove
								</Button>
							</div>
						</div>
					</div>
				);
			case 'add':
			default:
				return (
					<div className="modal-wrapper">
						<h2>Add plugin</h2>
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
							<div className="mx-3">
								<div>
									<b>Name:</b> {pluginData.name}
								</div>
								<div className="my-2">
									<b>Description:</b> {pluginData.description}
								</div>
								<div>
									<b>Version:</b> {pluginData.version}
								</div>
								<div className="my-2">
									<b>Author:</b> {pluginData.author}
								</div>
							</div>
						</div>
						<Divider />
						<div>Are you sure you want to add this plugin?</div>
						<div className="my-4">
							<Button
								type="primary"
								className="add-btn"
								onClick={() => handleAdd(true)}
							>
								Add
							</Button>
						</div>
					</div>
				);
		}
	};

	if (isLoading) {
		return <Spin></Spin>;
	}

	return (
		<div>
			<div className="plugin-divider"></div>
			<div className="plugin-details-wrapper">
				<div className="main-content">
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
						<div className="ml-3 inner-content">
							<h3>{pluginData.name}</h3>
							<p>{pluginData.bio}</p>
							<div>
								<b>Version:</b> {pluginData.version}
							</div>
							<div>
								<b>Author:</b> {pluginData.author}
							</div>
							<div className="btn-wrapper">
								<Button
									type="primary"
									className="add-btn"
									onClick={() => setOpen(true)}
								>
									Add
								</Button>
								<div className="small-txt">Free to install</div>
							</div>
							{/* <div className="btn-wrapper d-flex justify-content-between">
								<Button
									type="primary"
									className="remove-btn"
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
							<div className="d-flex mt-5">
								<ClockCircleOutlined />{' '}
								<div>Installation in progress...</div>
							</div> */}
						</div>
						<div className="ml-3">
							<img
								src={
									pluginData && pluginData.icon
										? pluginData.icon
										: STATIC_ICONS.DEFAULT_PLUGIN_PREVIEW
								}
								alt="PluginCard"
								className="plugin-card"
							/>
							<div className="d-flex mt-2">
								<StarFilled />
								<div>Featured plugin</div>
							</div>
						</div>
					</div>
					<div className="about-label">About</div>
					<div className="about-contents">
						<b>OverView</b>
						<div className="my-3">{pluginData.description}</div>
						<div className="my-5">
							<h2>Main features</h2>
						</div>
					</div>
				</div>
				<Modal
					visible={isOpen}
					width={450}
					onCancel={handleClose}
					footer={false}
				>
					{renderPopup()}
				</Modal>
			</div>
		</div>
	);
};

export default PluginDetails;
