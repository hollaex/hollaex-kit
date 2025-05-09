import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Table, Button, Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import {
	fetchTransactions,
	updateTransaction,
} from 'containers/P2P/actions/p2pActions';
import { getToken } from 'utils/token';
import { WS_URL } from 'config/constants';
import { Coin } from 'components';

const dataSource = (setIsConfirmWarning, setUserData, setIsOrderDetails) => {
	return [
		{ title: 'Order Id', dataIndex: 'id', key: 'id' },
		{
			title: 'Buyer Name',
			render: (data) => {
				return (
					<Link className="pointer" to={`/admin/user?id=${data?.buyer?.id}`}>
						{data?.buyer?.full_name ? data?.buyer?.full_name : 'Anonymous'}
					</Link>
				);
			},
		},
		{
			title: 'Seller Name',
			render: (data) => {
				return (
					<Link className="pointer" to={`/admin/user?id=${data?.merchant?.id}`}>
						{data?.merchant?.full_name
							? data?.merchant?.full_name
							: 'Anonymous'}
					</Link>
				);
			},
		},
		{
			title: 'Payment Method',
			render: (data) => data?.payment_method_used?.system_name,
		},
		{
			title: 'Buying Asset',
			render: (data) => data?.deal?.buying_asset?.toUpperCase(),
		},
		{
			title: 'Selling Asset',
			render: (data) => data?.deal?.spending_asset?.toUpperCase(),
		},
		{
			title: 'Cancel',
			render: (data) => {
				return (
					<Button
						onClick={() => {
							setIsConfirmWarning(true);
							setUserData(data);
						}}
						className="green-btn"
					>
						Cancel
					</Button>
				);
			},
		},
		{
			title: 'View More',
			render: (data) => {
				return (
					<Button
						onClick={() => {
							setIsOrderDetails(true);
							setUserData(data);
						}}
						className="green-btn"
					>
						View More
					</Button>
				);
			},
		},
	];
};

const P2PActive = ({ user, coins }) => {
	const [getOrders, setGetOrders] = useState();
	const [selectedTransaction, setSelectedTransaction] = useState();
	const [webSocket, setWebSocket] = useState();
	const [isConfirmWarning, setIsConfirmWarning] = useState(false);
	const [userData, setUserData] = useState();
	const [isOrderDetails, setIsOrderDetails] = useState(false);

	const fetchData = async () => {
		try {
			const orders = await fetchTransactions();
			setGetOrders(orders);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		let pingInterval;

		const connectWebSocket = () => {
			const url = `${WS_URL}/stream?authorization=Bearer ${getToken()}`;
			const p2pWebSocket = new WebSocket(url);

			p2pWebSocket.onopen = () => {
				setWebSocket(p2pWebSocket);

				if (selectedTransaction?.first_created) {
					p2pWebSocket.send(
						JSON.stringify({
							op: 'p2pChat',
							args: [
								{
									action: 'getStatus',
									data: {
										id: selectedTransaction?.id,
										status: 'created',
										title: 'p2p',
										receiver_id:
											user?.id === selectedTransaction?.merchant_id
												? selectedTransaction?.user_id
												: selectedTransaction?.merchant_id,
									},
								},
							],
						})
					);
				}

				pingInterval = setInterval(() => {
					if (p2pWebSocket.readyState === WebSocket.OPEN) {
						p2pWebSocket.send(JSON.stringify({ op: 'ping' }));
					}
				}, 55000);
			};

			p2pWebSocket.onclose = (event) => {
				clearInterval(pingInterval);
				setTimeout(connectWebSocket, 3000);
			};

			p2pWebSocket.onerror = (error) => {
				clearInterval(pingInterval);
				p2pWebSocket.close();
			};

			return p2pWebSocket;
		};

		const p2pWebSocket = connectWebSocket();

		fetchData();

		return () => {
			clearInterval(pingInterval);
			p2pWebSocket.close();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const notificationStatus = (status, title = '') => {
		webSocket.send(
			JSON.stringify({
				op: 'p2pChat',
				args: [
					{
						action: 'getStatus',
						data: {
							id: userData?.id,
							status,
							title,
							receiver_id:
								user?.id === userData?.merchant_id
									? userData?.user_id
									: userData?.merchant_id,
						},
					},
				],
			})
		);
	};

	const onHandleCancel = async (data) => {
		try {
			await updateTransaction({
				id: data?.id,
				user_status: 'cancelled',
			});
			fetchData();
			notificationStatus('cancelled', 'admin cancel');
			setSelectedTransaction(data);
		} catch (error) {
			console.error(error);
		}
	};

	const filteredOrders = getOrders?.data?.filter(
		(data) => data?.transaction_status === 'active'
	);

	return (
		<div>
			<Modal
				maskClosable={false}
				closeIcon={<CloseOutlined />}
				visible={isConfirmWarning}
				footer={null}
				onCancel={() => {
					setIsConfirmWarning(false);
				}}
				width={400}
				className="p2p-admin-confirm-warning-popup-wrapper"
			>
				<div className="p2p-admin-confirm-popup">
					<div className="title">
						{' '}
						Are you sure you want to cancel this order?
					</div>
					<div className="confirm-button-container">
						<Button
							onClick={() => setIsConfirmWarning(false)}
							className="green-btn w-50"
						>
							Back
						</Button>
						<Button
							className="green-btn w-50"
							onClick={() => {
								setIsConfirmWarning(false);
								onHandleCancel(userData);
							}}
						>
							Confirm
						</Button>
					</div>
				</div>
			</Modal>
			<Modal
				maskClosable={false}
				closeIcon={<CloseOutlined />}
				visible={isOrderDetails}
				footer={null}
				onCancel={() => {
					setIsOrderDetails(false);
				}}
				width={450}
				className="p2p-admin-order-details-popup-wrapper p2p-admin-confirm-warning-popup-wrapper"
			>
				<div className="p2p-admin-order-details-container">
					<div className="title">Order Details</div>
					<div className="order-details">
						<span className="font-weight-bold order-title">
							Transaction Id :
						</span>
						<span className="ml-2">{userData?.transaction_id}</span>
					</div>
					<div className="order-details">
						<span className="font-weight-bold order-title">Fiat Amount:</span>
						<span className="ml-2">{userData?.amount_fiat}</span>
						<span className="ml-1">
							{userData?.deal?.spending_asset?.toUpperCase()}
						</span>
						<span className="asset-icon ml-1">
							<Coin
								iconId={coins[userData?.deal?.spending_asset]?.icon_id}
								type="CS4"
							/>
						</span>
					</div>

					<div className="order-details">
						<span className="font-weight-bold order-title">Price:</span>
						<span className="ml-2">{userData?.price}</span>
						<span className="ml-1">
							{userData?.deal?.spending_asset?.toUpperCase()}
						</span>
						<span className="asset-icon ml-1">
							<Coin
								iconId={coins[userData?.deal?.spending_asset]?.icon_id}
								type="CS4"
							/>
						</span>
						<span className="ml-2">(per coin)</span>
						<span className="ml-2">
							{userData?.deal?.buying_asset?.toUpperCase()}
						</span>
						<span className="asset-icon ml-1">
							<Coin
								iconId={coins[userData?.deal?.buying_asset]?.icon_id}
								type="CS4"
							/>
						</span>
					</div>
					<div className="order-details">
						<span className="font-weight-bold order-title">Crypto Amount:</span>
						<span className="ml-2">{userData?.amount_digital_currency}</span>
						<span className="ml-1">
							{userData?.deal?.buying_asset?.toUpperCase()}
						</span>
						<span className="asset-icon ml-1">
							<Coin
								iconId={coins[userData?.deal?.buying_asset]?.icon_id}
								type="CS4"
							/>
						</span>
					</div>
					<div className="order-details">
						<span className="font-weight-bold order-title">
							Payment Method:
						</span>
						<span className="ml-2">
							{userData?.payment_method_used?.system_name}
						</span>
					</div>
				</div>
			</Modal>
			<Table
				columns={dataSource(
					setIsConfirmWarning,
					setUserData,
					setIsOrderDetails
				)}
				dataSource={filteredOrders}
				pagination={{ pageSize: 10 }}
			/>
		</div>
	);
};

const mapStateToProps = (state) => ({
	user: state.user,
	coins: state.app.coins,
});

export default connect(mapStateToProps)(P2PActive);
