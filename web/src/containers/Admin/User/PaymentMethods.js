import React, { useState, useEffect } from 'react';
import { message, Table, Button, Spin, Modal, Select, Checkbox } from 'antd';
import {
	fetchP2PPaymentMethods,
	deleteP2PPaymentMethod,
	updateP2PPaymentMethod,
} from './actions';
import { CloseOutlined } from '@ant-design/icons';
import withConfig from 'components/ConfigProvider/withConfig';
import { connect } from 'react-redux';

const PaymentMethods = ({ user }) => {
	const [coinData, setCoinData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [queryValues] = useState({ user_id: user.id });
	// eslint-disable-next-line
	const [editMode, setEditMode] = useState(false);
	const [selectedData, setSelectedData] = useState({});
	const [queryFilters, setQueryFilters] = useState({
		total: 0,
		page: 1,
		pageSize: 10,
		limit: 50,
		currentTablePage: 1,
		isRemaining: true,
	});

	const [displayCostumizationModal, setDisplayCostumizationModal] = useState(
		false
	);

	const [displayDeleteModal, setDisplayDeleteModal] = useState(false);

	const columns = [
		// {
		// 	title: 'ID',
		// 	dataIndex: 'id',
		// 	key: 'id',
		// 	render: (user_id, data) => {
		// 		return (
		// 			<div className="d-flex">
		// 				<Button className="ant-btn green-btn ant-tooltip-open ant-btn-primary">
		// 					{data?.id}
		// 				</Button>
		// 				{/* <div className="ml-3">{data.User.email}</div> */}
		// 			</div>
		// 		);
		// 	},
		// },
		{
			title: 'User ID',
			dataIndex: 'user_id',
			key: 'user_id',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						<Button className="ant-btn green-btn ant-tooltip-open ant-btn-primary">
							{data?.user_id}
						</Button>
					</div>
				);
			},
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.name}</div>;
			},
		},
		{
			title: 'Details',
			dataIndex: 'details',
			key: 'details',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						<ul>
							{data?.details?.fields.map((field) => (
								<li key={field.id}>
									{field.name}: {field.value}
								</li>
							))}
						</ul>
					</div>
				);
			},
		},
		{
			title: 'P2P',
			dataIndex: 'is_p2p',
			key: 'is_p2p',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.is_p2p ? 'Yes' : 'No'}</div>;
			},
		},
		{
			title: 'Fiat Controls',
			dataIndex: 'is_fiat_control',
			key: 'is_fiat_control',
			render: (user_id, data) => {
				return (
					<div className="d-flex">{data?.is_fiat_control ? 'Yes' : 'No'}</div>
				);
			},
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						{data?.status === 0 && 'Unverified'}
						{data?.status === 1 && 'Pending'}
						{data?.status === 2 && 'Rejected'}
						{data?.status === 3 && 'Verified'}
					</div>
				);
			},
		},
		{
			title: 'Edit',
			dataIndex: 'edit',
			key: 'edit',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						<Button
							onClick={(e) => {
								e.stopPropagation();
								setEditMode(true);
								setSelectedData(data);
								setDisplayCostumizationModal(true);
							}}
							style={{ backgroundColor: '#CB7300', color: 'white' }}
						>
							Edit
						</Button>
					</div>
				);
			},
		},
		{
			title: 'Delete',
			dataIndex: 'delete',
			key: 'delete',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						<Button
							onClick={(e) => {
								e.stopPropagation();
								setSelectedData(data);
								setDisplayDeleteModal(true);
							}}
							style={{ backgroundColor: '#cc0000', color: 'white' }}
						>
							Delete
						</Button>
					</div>
				);
			},
		},
	];

	useEffect(() => {
		setIsLoading(true);
		requesPaymentMethods(queryFilters.page, queryFilters.limit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		requesPaymentMethods(queryFilters.page, queryFilters.limit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryValues]);

	const requesPaymentMethods = (page = 1, limit = 50) => {
		setIsLoading(true);
		fetchP2PPaymentMethods({ page, limit, ...queryValues })
			.then((response) => {
				setCoinData(
					page === 1 ? response.data : [...coinData, ...response.data]
				);

				setQueryFilters({
					total: response.count,
					fetched: true,
					page,
					currentTablePage: page === 1 ? 1 : queryFilters.currentTablePage,
					isRemaining: response.count > page * limit,
				});
				setIsLoading(false);
			})
			.catch((error) => {
				// const message = error.message;
				setIsLoading(false);
			});
	};

	const pageChange = (count, pageSize) => {
		const { page, limit, isRemaining } = queryFilters;
		const pageCount = count % 5 === 0 ? 5 : count % 5;
		const apiPageTemp = Math.floor(count / 5);
		if (limit === pageSize * pageCount && apiPageTemp >= page && isRemaining) {
			requesPaymentMethods(page + 1, limit);
		}
		setQueryFilters({ ...queryFilters, currentTablePage: count });
	};

	const handleCostumizationModal = () => {
		setDisplayCostumizationModal(false);
		setSelectedData({});
		setEditMode(false);
	};

	return (
		<div className="admin-user-container">
			<div style={{ color: '#ccc' }}>
				Below are details of payment methods belonging to this user. These
				accounts can be used for P2P trading.
			</div>
			<div>
				<div style={{ marginTop: 20 }}></div>
				<div className="mt-5">
					<div className="mt-4" style={{ marginBottom: 80 }}>
						<Spin spinning={isLoading}>
							<div
								style={{
									marginBottom: 10,
									display: 'flex',
									justifyContent: 'space-between',
								}}
							>
								<div>
									<div style={{ fontSize: 20, marginBottom: 3 }}>
										Payment methods of the user
									</div>
								</div>
								{/* <div>
									<span>
										<Button
											onClick={() => {
												setDisplayCostumizationModal(true);
											}}
											style={{
												backgroundColor: '#288500',
												color: 'white',
												flex: 1,
												height: 35,
												marginRight: 10,
											}}
											type="default"
										>
											Create Payment Method
										</Button>
									</span>
								</div> */}
							</div>
							<Table
								className="blue-admin-table"
								columns={columns}
								dataSource={coinData}
								// expandedRowRender={renderRowContent}
								// expandRowByClick={true}
								rowKey={(data) => {
									return data.id;
								}}
								pagination={{
									current: queryFilters.currentTablePage,
									onChange: pageChange,
								}}
							/>
						</Spin>
					</div>
				</div>

				{displayCostumizationModal && (
					<Modal
						maskClosable={false}
						closeIcon={<CloseOutlined style={{ color: 'white' }} />}
						bodyStyle={{
							backgroundColor: '#27339D',
						}}
						visible={displayCostumizationModal}
						footer={null}
						onCancel={() => {
							handleCostumizationModal();
						}}
					>
						<div
							style={{
								fontWeight: '600',
								color: 'white',
								fontSize: 18,
								marginBottom: 10,
							}}
						>
							Update User's payment method
						</div>
						<div style={{ marginBottom: 10, color: '#ccc' }}></div>
						<div style={{ fontSize: 16, marginBottom: 5 }}>Features</div>

						<div style={{ marginBottom: 10 }}>
							<Checkbox
								style={{ color: 'white' }}
								onChange={(e) => {
									setSelectedData({
										...selectedData,
										is_p2p: e.target.checked,
									});
								}}
								checked={selectedData?.is_p2p}
							>
								P2P Enabled
							</Checkbox>
						</div>
						<div style={{ marginBottom: 10 }}>
							<Checkbox
								style={{ color: 'white' }}
								onChange={(e) => {
									setSelectedData({
										...selectedData,
										is_fiat_control: e.target.checked,
									});
								}}
								checked={selectedData?.is_fiat_control}
							>
								Fiat Control Enabled
							</Checkbox>
						</div>
						<div>
							<div style={{ fontSize: 16, marginBottom: 5 }}>Status</div>
							<Select
								showSearch
								className="select-box"
								placeholder="Vendor sells crypto only"
								value={selectedData?.status}
								style={{ width: 200 }}
								onChange={(e) => {
									setSelectedData({
										...selectedData,
										status: e,
									});
								}}
							>
								<Select.Option value={0}>Unverified</Select.Option>
								<Select.Option value={1}>Pending</Select.Option>
								<Select.Option value={2}>Rejected</Select.Option>
								<Select.Option value={3}>Verified</Select.Option>
							</Select>
						</div>

						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								gap: 15,
								justifyContent: 'space-between',
								marginBottom: 20,
								marginTop: 20,
							}}
						>
							<Button
								onClick={() => {
									handleCostumizationModal();
								}}
								style={{
									backgroundColor: '#288500',
									color: 'white',
									flex: 1,
									height: 35,
								}}
								type="default"
							>
								Back
							</Button>
							<Button
								onClick={async () => {
									try {
										await updateP2PPaymentMethod({
											id: selectedData.id,
											is_p2p: selectedData.is_p2p ? true : false,
											is_fiat_control: selectedData.is_fiat_control
												? true
												: false,
											status: selectedData.status,
											user_id: user.id,
										});
										requesPaymentMethods();
										message.success('Changes saved.');
										handleCostumizationModal();
									} catch (error) {
										message.error(error.response.data.message);
									}
								}}
								style={{
									backgroundColor: '#288500',
									color: 'white',
									flex: 1,
									height: 35,
								}}
								type="default"
							>
								PROCEED
							</Button>
						</div>
					</Modal>
				)}

				{displayDeleteModal && (
					<Modal
						maskClosable={false}
						closeIcon={<CloseOutlined style={{ color: 'white' }} />}
						bodyStyle={{
							backgroundColor: '#27339D',
						}}
						visible={displayDeleteModal}
						footer={null}
						onCancel={() => {
							setDisplayDeleteModal(false);
						}}
					>
						<div
							style={{
								fontWeight: '600',
								color: 'white',
								fontSize: 18,
								marginBottom: 10,
							}}
						>
							Delete Payment Method
						</div>
						<div style={{ marginBottom: 30, fontSize: 18 }}>
							Are you sure you want to delete this payment method?
						</div>

						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								gap: 15,
								justifyContent: 'space-between',
								marginBottom: 20,
							}}
						>
							<Button
								onClick={() => {
									setDisplayDeleteModal(false);
								}}
								style={{
									backgroundColor: '#288500',
									color: 'white',
									flex: 1,
									height: 35,
								}}
								type="default"
							>
								Back
							</Button>
							<Button
								onClick={async () => {
									try {
										await deleteP2PPaymentMethod({
											id: selectedData.id,
											user_id: user.id,
										});
										requesPaymentMethods();
										message.success('Changes saved.');
										setSelectedData({});
										setDisplayDeleteModal(false);
									} catch (error) {
										message.error(error.response.data.message);
									}
								}}
								style={{
									backgroundColor: '#288500',
									color: 'white',
									flex: 1,
									height: 35,
								}}
								type="default"
							>
								YES
							</Button>
						</div>
					</Modal>
				)}
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(PaymentMethods));
