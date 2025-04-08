import React, { useState, useEffect } from 'react';
import {
	Form,
	Input,
	Button,
	Divider,
	Row,
	Col,
	Card,
	message,
	Modal,
	Tree,
	Typography,
	Tabs,
	Collapse,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
	fetchRoles,
	createRoles,
	updateRoles,
	deleteRoles,
	fetchEndpoints,
} from './action';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;

const KIT_CONFIG_KEYS = [
	'captcha',
	'api_name',
	'description',
	'color',
	'title',
	'links',
	'defaults',
	'native_currency',
	'logo_image',
	'valid_languages',
	'new_user_is_activated',
	'interface',
	'icons',
	'strings',
	'meta',
	'features',
	'setup_completed',
	'email_verification_required',
	'injected_values',
	'injected_html',
	'user_meta',
	'black_list_countries',
	'onramp',
	'offramp',
	'user_payments',
	'dust',
	'coin_customizations',
	'fiat_fees',
	'balance_history_config',
	'transaction_limits',
	'p2p_config',
	'referral_history_config',
	'chain_trade_config',
	'selectable_native_currencies',
	'auto_trade_config',
	'apps',
	'timezone',
];

const KIT_SECRETS_KEYS = [
	'allowed_domains',
	'admin_whitelist',
	'emails',
	'security',
	'captcha',
	'smtp',
];

function transformPermissions(role, configKeys = [], secretKeys = []) {
	const transformedPermissions = role.permissions.map((permission) => {
		// Handle route permissions (starting with /admin/)
		if (permission.startsWith('/admin/')) {
			const [path, method] = permission.split(':');
			const routePath = path.replace('/admin/', '').replace(/\//g, '.');
			return `route:${routePath}.${method}`;
		} else if (configKeys.includes(permission)) {
			return `config:${permission}`;
		} else if (secretKeys.includes(permission)) {
			return `secret:${permission}`;
		}
		return permission;
	});

	return {
		...role,
		permissions: transformedPermissions,
	};
}

const convertRoutesToTree = (routes, parentPath = '') => {
	return Object.entries(routes)
		.map(([key, value]) => {
			const path = parentPath ? `${parentPath}.${key}` : key;
			const hasHttpMethods =
				value.get || value.post || value.put || value.delete;

			if (typeof value === 'object' && !hasHttpMethods) {
				return {
					title: key.replace(/-/g, ' '),
					key: `route:${path}`,
					children: convertRoutesToTree(value, path),
				};
			} else if (typeof value === 'object' && hasHttpMethods) {
				const httpMethodChildren = Object.entries(value)
					.filter(([method]) =>
						['get', 'post', 'put', 'delete'].includes(method)
					)
					.map(([method]) => ({
						title: method.toUpperCase(),
						key: `route:${path}.${method}`,
						isLeaf: true,
					}));

				// Check for nested routes in the same object
				const nestedRoutes = Object.entries(value)
					.filter(
						([k, v]) =>
							typeof v === 'object' &&
							!['get', 'post', 'put', 'delete'].includes(k)
					)
					.flatMap(([k, v]) => convertRoutesToTree({ [k]: v }, path));

				return {
					title: key.replace(/-/g, ' '),
					key: `route:${path}`,
					children: [...httpMethodChildren, ...nestedRoutes],
				};
			}
			return null;
		})
		.filter(Boolean);
};

let routes = {};

const kitConfigPermissions = KIT_CONFIG_KEYS.map((key) => ({
	title: key,
	key: `config:${key}`,
	isLeaf: true,
}));

const kitSecretsPermissions = KIT_SECRETS_KEYS.map((key) => ({
	title: key,
	key: `secret:${key}`,
	isLeaf: true,
}));

const PermissionTabs = ({ checkedKeys, setCheckedKeys, treeData }) => {
	// const onCheck = (checkedKeys, { checkedNodes, halfCheckedKeys }, type) => {
	//     const leafKeys = checkedNodes
	//         .filter(node => node.isLeaf)
	//         .map(node => node.key);

	//     const otherKeys = checkedKeys.filter(key => !key.startsWith(`${type}:`));
	//     setCheckedKeys([...otherKeys, ...leafKeys]);
	// };

	const onCheck = (keys, { checkedNodes, halfCheckedKeys }, type) => {
		// Get all leaf nodes that are checked
		const leafKeys = checkedNodes
			.filter((node) => node.isLeaf)
			.map((node) => node.key);

		// Get all keys NOT from the current tab
		const otherTabKeys = checkedKeys.filter(
			(key) => !key.startsWith(`${type}:`)
		);

		// Combine existing keys from other tabs with new keys from current tab
		const newCheckedKeys = [...otherTabKeys, ...leafKeys];

		// Remove duplicates
		setCheckedKeys(Array.from(new Set(newCheckedKeys)));
	};

	return (
		<Tabs defaultActiveKey="1">
			<TabPane tab={<span style={{ color: 'white' }}>API Routes</span>} key="1">
				<div
					style={{
						maxHeight: '400px',
						overflow: 'auto',
						border: '1px solid #d9d9d9',
						padding: '10px',
					}}
				>
					<Tree
						className="custom-tree"
						checkable
						onCheck={(keys, info) => onCheck(keys, info, 'route')}
						checkedKeys={checkedKeys.filter((key) => key.startsWith('route:'))}
						treeData={treeData}
						height={400}
					/>
				</div>
			</TabPane>
			<TabPane
				tab={<span style={{ color: 'white' }}>Kit Configuration</span>}
				key="2"
			>
				<div
					style={{
						maxHeight: '400px',
						overflow: 'auto',
						border: '1px solid #d9d9d9',
						padding: '10px',
					}}
				>
					<Tree
						className="custom-tree"
						checkable
						onCheck={(keys, info) => onCheck(keys, info, 'config')}
						checkedKeys={checkedKeys.filter((key) => key.startsWith('config:'))}
						treeData={kitConfigPermissions}
						height={400}
					/>
				</div>
			</TabPane>
			<TabPane
				tab={<span style={{ color: 'white' }}>Kit Secrets</span>}
				key="3"
			>
				<div
					style={{
						maxHeight: '400px',
						overflow: 'auto',
						border: '1px solid #d9d9d9',
						padding: '10px',
					}}
				>
					<Tree
						checkable
						className="custom-tree"
						onCheck={(keys, info) => onCheck(keys, info, 'secret')}
						checkedKeys={checkedKeys.filter((key) => key.startsWith('secret:'))}
						treeData={kitSecretsPermissions}
						height={400}
					/>
				</div>
			</TabPane>
		</Tabs>
	);
};

const RoleForm = ({
	initialValues,
	onSubmit,
	onCancel,
	isEditing,
	treeData,
}) => {
	const [form] = Form.useForm();
	const [checkedKeys, setCheckedKeys] = useState([]);

	useEffect(() => {
		if (initialValues) {
			form.setFieldsValue({
				role_name: initialValues.role_name,
				description: initialValues.description,
			});
			setCheckedKeys(initialValues.permissions || []);
		}
	}, [initialValues, form]);

	const handleSubmit = () => {
		form
			.validateFields()
			.then((values) => {
				const payload = {
					name: values.role_name,
					description: values.description,
					permissions: checkedKeys,
				};
				onSubmit(payload);
			})
			.catch((info) => {
				message.error('Validate Failed:', info);
			});
	};

	return (
		<Form form={form} layout="vertical">
			<Form.Item
				name="role_name"
				label={
					<span style={{ color: 'white', fontWeight: 'bold' }}>Role Name</span>
				}
				rules={[
					{ required: true, message: 'Please input the role name!' },
					{ max: 50, message: 'Role name cannot exceed 50 characters!' },
				]}
			>
				<Input placeholder="Enter role name" />
			</Form.Item>

			<Form.Item
				name="description"
				label={
					<span style={{ color: 'white', fontWeight: 'bold' }}>
						Description
					</span>
				}
				rules={[
					{ required: true, message: 'Please input the role description!' },
					{ max: 255, message: 'Description cannot exceed 255 characters!' },
				]}
			>
				<Input.TextArea rows={3} placeholder="Enter role description" />
			</Form.Item>

			<Divider orientation="left">
				<span style={{ color: 'white', fontWeight: 'bold' }}>Permissions</span>
			</Divider>

			<Collapse defaultActiveKey={['1']}>
				<Panel header="Permission Settings" key="1">
					<PermissionTabs
						checkedKeys={checkedKeys}
						setCheckedKeys={setCheckedKeys}
						treeData={treeData}
					/>
				</Panel>
			</Collapse>

			<Divider />

			<Form.Item>
				<Button
					type="primary"
					onClick={handleSubmit}
					style={{ marginRight: 8, backgroundColor: '#288501' }}
				>
					{isEditing ? 'Update Role' : 'Create Role'}
				</Button>
				<Button onClick={onCancel}>Cancel</Button>
			</Form.Item>
		</Form>
	);
};

const RoleManagement = ({ userId }) => {
	const [roles, setRoles] = useState([
		// {
		//     id: 1,
		//     role_name: "Super Admin",
		//     description: "Has full access to all system features and configurations",
		//     permissions: [
		//         "route:user.get",
		//         "route:user.post",
		//         "route:user.put",
		//         "route:user.delete",
		//         "route:user.role.get",
		//         "route:user.role.put",
		//         "route:email.types.get",
		//         "route:email.types.post",
		//         "config:api_name",
		//         "config:description",
		//         "config:color",
		//         "config:title",
		//         "config:logo_image",
		//         "config:features",
		//         "secret:allowed_domains",
		//         "secret:admin_whitelist",
		//         "secret:emails",
		//         "secret:security"
		//     ]
		// },
		// {
		//     id: 2,
		//     role_name: "Support Agent",
		//     description: "Can view user accounts and perform basic support actions",
		//     permissions: [
		//         "route:user.get",
		//         "route:user.email.get",
		//         "route:user.meta.get",
		//         "route:user.note.post",
		//         "config:interface",
		//         "config:strings"
		//     ]
		// },
		// {
		//     id: 3,
		//     role_name: "Content Manager",
		//     description: "Can manage system content and configurations",
		//     permissions: [
		//         "route:announcements.get",
		//         "route:announcements.post",
		//         "route:announcements.put",
		//         "config:title",
		//         "config:links",
		//         "config:strings",
		//         "config:meta",
		//         "config:injected_html"
		//     ]
		// },
		// {
		//     id: 4,
		//     role_name: "Security Auditor",
		//     description: "Can view security logs and audit trails",
		//     permissions: [
		//         "route:logins.get",
		//         "route:audits.get",
		//         "route:user.sessions.get",
		//         "secret:security",
		//         "secret:captcha"
		//     ]
		// },
		// {
		//     id: 5,
		//     role_name: "Financial Operator",
		//     description: "Can process financial transactions and view balances",
		//     permissions: [
		//         "route:deposits.get",
		//         "route:withdrawals.get",
		//         "route:transfer.post",
		//         "route:balance.get",
		//         "config:fiat_fees",
		//         "config:transaction_limits",
		//         "config:balance_history_config"
		//     ]
		// }
	]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [currentRole, setCurrentRole] = useState(null);
	// eslint-disable-next-line
	const [loading, setLoading] = useState(false);
	const [treeData, setTreeData] = useState([]);
	useEffect(() => {
		fetchEndpoints()
			.then((response) => {
				Object.assign(routes, response?.data?.admin || {});

				const sortedObj = Object.keys(routes)
					.sort()
					.reduce((acc, key) => {
						acc[key] = routes[key];
						return acc;
					}, {});

				setTreeData(convertRoutesToTree(sortedObj));
			})
			.catch((err) => {
				message.error('Error fetching roles:', err);
			});
		fetchRoles()
			.then((response) => {
				const transformedRoles = response.data.map((role) =>
					transformPermissions(role, KIT_CONFIG_KEYS, KIT_SECRETS_KEYS)
				);

				setRoles(transformedRoles);
			})
			.catch((err) => {
				message.error('Error fetching roles:', err);
			});
	}, []);

	const handleCreate = () => {
		setCurrentRole(null);
		setIsModalVisible(true);
	};

	const handleEdit = (role) => {
		setCurrentRole(role);
		setIsModalVisible(true);
	};

	const handleDelete = async (roleId) => {
		Modal.confirm({
			title: (
				<span style={{ color: 'white' }}>
					Are you sure you want to delete this role?
				</span>
			),
			content: 'This action cannot be undone.',
			okText: 'Yes, delete it',
			okType: 'danger',
			cancelText: 'No',
			onOk: async () => {
				try {
					setLoading(true);
					await deleteRoles({ id: roleId });
					// setRoles(roles.filter(role => role.id !== roleId));

					fetchRoles()
						.then((response) => {
							const transformedRoles = response.data.map((role) =>
								transformPermissions(role, KIT_CONFIG_KEYS, KIT_SECRETS_KEYS)
							);

							setRoles(transformedRoles);
						})
						.catch((err) => {
							message.error('Error fetching roles:', err);
						});
					message.success('Role deleted successfully');
				} catch (error) {
					message.error('Failed to delete role');
				} finally {
					setLoading(false);
				}
			},
		});
	};

	const handleSubmit = async (values) => {
		try {
			setLoading(true);
			if (currentRole) {
				await updateRoles({
					...values,
					id: currentRole.id,
					user_id: userId,
				});
				// setRoles(roles.map(role => role.id === currentRole.id ? updatedRole : role));
				message.success('Role updated successfully');
			} else {
				await createRoles({
					...values,
					user_id: userId,
				});
				// setRoles([...roles, newRole]);
				message.success('Role created successfully');
			}

			fetchRoles()
				.then((response) => {
					const transformedRoles = response.data.map((role) =>
						transformPermissions(role, KIT_CONFIG_KEYS, KIT_SECRETS_KEYS)
					);

					setRoles(transformedRoles);
				})
				.catch((err) => {
					message.error('Error fetching roles:', err);
				});
			setIsModalVisible(false);
		} catch (error) {
			message.error(error.response?.data?.message || 'Failed to save role');
		} finally {
			setLoading(false);
		}
	};

	const formatPermissionType = (permission) => {
		if (permission.startsWith('route:')) return 'API Route';
		if (permission.startsWith('config:')) return 'Kit Config';
		if (permission.startsWith('secret:')) return 'Kit Secret';
		return 'Unknown';
	};

	const formatPermissionName = (permission) => {
		return permission.split(':').slice(1).join(':');
	};

	return (
		<div>
			<Title level={2}>Role Management</Title>

			<Button
				type="primary"
				icon={<PlusOutlined />}
				onClick={handleCreate}
				style={{ marginBottom: 16, backgroundColor: '#288501' }}
			>
				Create New Role
			</Button>

			<Row gutter={[16, 16]}>
				{roles
					.sort((a, b) => a.id - b.id)
					.map((role) => (
						<Col key={role.id}>
							<Card
								style={{
									backgroundColor: '#202980',
									color: 'white',
									width: 350,
								}}
								title={<span style={{ color: 'white' }}>{role.role_name}</span>}
								actions={[
									<EditOutlined
										style={{ color: 'white' }}
										key="edit"
										onClick={() => handleEdit(role)}
									/>,
									<DeleteOutlined
										style={{ color: 'white' }}
										key="delete"
										onClick={() => handleDelete(role.id)}
									/>,
								]}
							>
								<p style={{ color: 'white' }}>{role.description}</p>
								<Collapse style={{ backgroundColor: ' #27339D' }}>
									<Panel
										style={{ backgroundColor: ' #27339D' }}
										header={
											<span style={{ color: 'white' }}>
												Permissions ({role.permissions.length})
											</span>
										}
										key="1"
									>
										<ul style={{ paddingLeft: 20 }}>
											{role.permissions.slice(0, 5).map((perm, i) => (
												<li style={{ color: 'white' }} key={i}>
													<strong>{formatPermissionType(perm)}:</strong>{' '}
													{formatPermissionName(perm)}
												</li>
											))}
											{role.permissions.length > 5 && (
												<li style={{ color: 'white' }}>
													...and {role.permissions.length - 5} more
												</li>
											)}
										</ul>
									</Panel>
								</Collapse>
							</Card>
						</Col>
					))}
			</Row>

			<Modal
				title={
					<span style={{ color: 'white' }}>
						{currentRole ? 'Edit Role' : 'Create New Role'}
					</span>
				}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
				width={800}
				destroyOnClose
			>
				<RoleForm
					initialValues={currentRole}
					onSubmit={handleSubmit}
					onCancel={() => setIsModalVisible(false)}
					isEditing={!!currentRole}
					treeData={treeData}
				/>
			</Modal>
		</div>
	);
};

export default RoleManagement;
