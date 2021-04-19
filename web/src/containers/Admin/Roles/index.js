import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, message } from 'antd';
import { connect } from 'react-redux';

import { checkRole } from '../../../utils/token';
import {
	OperatorRole,
	RoleAccess,
	EditModal,
	RevokeRole,
	renderRoleImage,
} from './ModalForm';
import { requestRole, inviteOperator, updateRole } from './action';
import './index.css';
import { handleUpgrade } from 'utils/utils';

const getColumns = (handleEdit = () => {}) => [
	{
		title: 'Operator email',
		dataIndex: 'email',
	},
	{
		title: 'Role',
		render: (data) => {
			if (data.is_admin) {
				return <div>Lead Operator</div>;
			} else if (data.is_supervisor) {
				return <div>Supervisor</div>;
			} else if (data.is_kyc) {
				return <div>KYC</div>;
			} else if (data.is_communicator) {
				return <div>Communicator</div>;
			} else if (data.is_support) {
				return <div>Support</div>;
			}
		},
	},
	{
		render: (data) => {
			if (checkRole() === 'admin') {
				return (
					<span className="admin-link" onClick={() => handleEdit(data)}>
						Edit
					</span>
				);
			}
		},
	},
];

const renderItems = () => {
	switch (checkRole()) {
		case 'supervisor':
			return (
				<div>
					<div className="sub-title">Your current role:</div>
					<div className="description">
						<span className="sub-title">Supervisor</span> can access all
						deposit, withdrawals and approval settings
					</div>
				</div>
			);
		case 'kyc':
			return (
				<div>
					<div className="sub-title">Your current role:</div>
					<div className="description">
						<span className="sub-title">KYC</span> role can access some user
						data to review KYC requirements
					</div>
				</div>
			);
		case 'tech':
			return (
				<div>
					<div className="sub-title">Your current role:</div>
					<div className="description">
						<span className="sub-title">Communications</span> can access to
						website direct editing for content management and communications
					</div>
				</div>
			);
		case 'support':
			return (
				<div>
					<div className="sub-title">Your current role:</div>
					<div className="description">
						<span className="sub-title">Support</span> can access some user
						information for user verification
					</div>
				</div>
			);
		default:
			return (
				<div>
					<div className="sub-title">Your current role:</div>
					<div className="description">
						<span className="sub-title">Administrator</span> can access all
						controls on the operator control panel
					</div>
				</div>
			);
	}
};

const Roles = ({ constants }) => {
	const limit = 50;
	const [operatorList, setOperatorList] = useState([]);
	const [page, setPage] = useState(1);
	const [currentTablePage, setCurrentTablePage] = useState(1);
	const [isRemaining, setIsRemaining] = useState(true);
	const [editData, setData] = useState([]);
	const [modalType, setType] = useState('');
	const [isOpen, setOpen] = useState(false);

	const isUpgrade = handleUpgrade(constants.info);
	const requestInitRole = (pageNo = 1) => {
		requestRole({ pageNo, limit })
			.then((res) => {
				let temp = pageNo === 1 ? res.data : [...operatorList, ...res.data];
				setOperatorList(temp);
				setPage(pageNo);
				let currentPage = pageNo === 1 ? 1 : currentTablePage;
				setCurrentTablePage(currentPage);
				setIsRemaining(res.count > pageNo * limit);
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				message.error(error);
			});
	};
	useEffect(() => {
		requestInitRole();
		//  TODO: Fix react-hooks/exhaustive-deps
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleInvite = (values) => {
		inviteOperator(values)
			.then((res) => {
				requestInitRole();
				handleClose();
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				message.error(error);
			});
	};

	const handleUpdateRole = (formProps, user_id) => {
		updateRole(formProps, { user_id })
			.then((res) => {
				requestInitRole();
				handleClose();
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				message.error(error);
			});
	};

	const renderContent = (type, onTypeChange, isUpgrade) => {
		switch (type) {
			case 'operator-role':
				return <OperatorRole
							handleInvite={handleInvite}
							isUpgrade={isUpgrade}
						/>;
			case 'role-access':
				return <RoleAccess
							handleClose={handleClose}
							isUpgrade={isUpgrade}
						/>;
			case 'edit':
				return (
					<EditModal
						editData={editData}
						onTypeChange={onTypeChange}
						handleUpdateRole={handleUpdateRole}
					/>
				);
			case 'revoke-role':
				return (
					<RevokeRole
						editData={editData}
						handleClose={handleClose}
						handleUpdateRole={handleUpdateRole}
					/>
				);
			default:
				return <div></div>;
		}
	};

	const handleAdd = () => {
		setOpen(true);
		setType('operator-role');
	};

	const handleRoleAccess = () => {
		setOpen(true);
		setType('role-access');
	};

	const handleEdit = (data) => {
		setOpen(true);
		setType('edit');
		setData(data);
	};

	const handleClose = () => {
		setOpen(false);
		setType('');
		setData({});
	};

	const onTypeChange = (type) => {
		setType(type);
	};

	const pageChange = (count, pageSize) => {
		const pageCount = count % 5 === 0 ? 5 : count % 5;
		const apiPageTemp = Math.floor(count / 5);
		if (limit === pageSize * pageCount && apiPageTemp >= page && isRemaining) {
			requestInitRole(page + 1);
		}
		setCurrentTablePage(count);
	};

	return (
		<div className="admin-roles-wrapper w-100 my-4">
			<div className="d-flex justify-content-between">
				<div>
					<h3>Designate operator roles</h3>
					<div className="description">
						Invite other exchange operators and specify their roles to help
						manage exchange.
					</div>
				</div>
				<div>
					<Button type="primary" className="green-btn" onClick={handleAdd}>
						Add operator
					</Button>
				</div>
			</div>
			<div className="d-flex my-4">
				<div>{renderRoleImage()}</div>
				<div className="ml-4">
					<div>{renderItems()}</div>
					<div className="sub-title">Role types:</div>
					<div className="mt-4">
						<div className="description text-nowrap">
							<span className="sub-title">1. Administrator</span> can access all
							areas. Coin creation, minting & burning, trading pair and
							designate operator roles
						</div>
						<div className="description text-nowrap">
							<span className="sub-title">2. Supervisor</span> can access all
							deposit, withdrawals and approval settings
						</div>
						<div className="description text-nowrap">
							<span className="sub-title">3. KYC</span> role can access some
							user data to review KYC requirements
						</div>
						<div className="description text-nowrap">
							<span className="sub-title">4. Communications</span> can access to
							website direct editing for content management and communications
						</div>
						<div className="description text-nowrap">
							<span className="sub-title">5. Support</span> can access some user
							information for user verification
						</div>
					</div>
					<div className="description mt-4">
						Learn more about{' '}
						<span className="pointer admin-link" onClick={handleRoleAccess}>
							operator role access.
						</span>
					</div>
				</div>
			</div>
			<div className="table-wrapper">
				<Table
					columns={getColumns(handleEdit)}
					dataSource={operatorList}
					rowKey={(data) => {
						return data.id;
					}}
					pagination={{
						current: currentTablePage,
						onChange: pageChange,
					}}
				/>
			</div>
			<Modal
				visible={isOpen}
				footer={null}
				onCancel={handleClose}
				width={modalType === 'role-access' ? 600 : (modalType === 'operator-role' ? 500 : 350)}
			>
				{renderContent(modalType, onTypeChange, isUpgrade)}
			</Modal>
		</div>
	);
};

const mapStateToProps = (state) => ({
	constants: state.app.constants,
});

export default connect(
	mapStateToProps
)(Roles);
