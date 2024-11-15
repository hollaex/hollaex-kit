import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import {
	fetchTransactions,
	updateTransaction,
} from 'containers/P2P/actions/p2pActions';
import { getToken } from 'utils/token';
import { WS_URL } from 'config/constants';

const dataSource = (setIsConfirmWarning, setUserData) => {
	return [
		{ title: 'Order Id', dataIndex: 'id', key: 'id' },
		{
			title: 'Buyer Name',
			render: (data) =>
				data?.buyer?.full_name ? data?.buyer?.full_name : 'Anonymous',
		},
		{
			title: 'Seller Name',
			render: (data) =>
				data?.merchant?.full_name ? data?.merchant?.full_name : 'Anonymous',
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
	];
};

const P2PActive = ({ user }) => {
	const [getOrders, setGetOrders] = useState();
	const [selectedTransaction, setSelectedTransaction] = useState();
	const [webSocket, setWebSocket] = useState();
	const [isConfirmWarning, setIsConfirmWarning] = useState(false);
	const [userData, setUserData] = useState();

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
			notificationStatus('cancelled');
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
			<Table
				columns={dataSource(setIsConfirmWarning, setUserData)}
				dataSource={filteredOrders}
				pagination={{ pageSize: 10 }}
			/>
		</div>
	);
};

const mapStateToProps = (state) => ({
	user: state.user,
});

export default connect(mapStateToProps)(P2PActive);
