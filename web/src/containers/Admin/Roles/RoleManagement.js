import React, { useState, useEffect } from 'react';
import { ReactSVG } from 'react-svg';
import { browserHistory } from 'react-router';
import {
	Form,
	Input,
	Button,
	Divider,
	Col,
	message,
	Modal,
	Tree,
	Typography,
	Tabs,
	Collapse,
	Tooltip,
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import ColorPicker from '../ColorPicker';
import {
	fetchRoles,
	createRoles,
	updateRoles,
	deleteRoles,
	fetchEndpoints,
} from './action';
import { OtpForm } from 'components';
import { STATIC_ICONS } from 'config/icons';
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
	'smtp',
];

function transformPermissions(role, configKeys = [], secretKeys = []) {
	const transformedPermissions = role.permissions.map((permission) => {
		// Handle route permissions (starting with /admin/)
		if (permission.startsWith('/admin/')) {
			const [path, method] = permission.split(':');
			const routePath = path.replace('/admin/', '').replace(/\//g, '.');
			return `route:${routePath}.${method}`;
		}
		return permission;
	});

	const transformedConfigs = role?.configs?.map((permission) => {
		if (configKeys.includes(permission)) {
			return `config:${permission}`;
		} else if (secretKeys.includes(permission)) {
			return `secret:${permission}`;
		}
		return permission;
	});

	return {
		...role,
		permissions: transformedPermissions,
		configs: transformedConfigs,
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

const totalCharacters = (name) => {
	let sum = 0;
	if (!name) return sum;

	for (let char of name.toLowerCase()) {
		if (/[a-z]/.test(char)) {
			sum += char.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
		} else {
			sum += char.charCodeAt(0);
		}
	}
	return sum;
};

export const onHandleBadge = (role) => {
	const roleCharacter = totalCharacters(role);
	const badgeList = Object.keys(STATIC_ICONS.ADMIN_ROLE_IMAGES);
	const modulo = roleCharacter % badgeList?.length;
	const badge = badgeList[modulo];
	return STATIC_ICONS.ADMIN_ROLE_IMAGES[`${badge}`];
};

export const roleStyles = {
	admin: {
		cardWrapper: 'operator-card-wrapper admin-operator-card-wrapper',
		rolesImage: STATIC_ICONS.ADMIN_ROLE,
	},
	manager: {
		cardWrapper: 'operator-card-wrapper manager-operator-card-wrapper',
		rolesImage: STATIC_ICONS.MANAGER_ROLE,
	},
	supervisor: {
		cardWrapper: 'supervisor-operator-card-wrapper operator-card-wrapper',
		rolesImage: STATIC_ICONS.SUPERVISOR_ROLE,
	},
	kyc: {
		cardWrapper: 'operator-card-wrapper kyc-operator-card-wrapper',
		rolesImage: STATIC_ICONS.KYC_ROLE,
	},
	communicator: {
		cardWrapper: 'communication-operator-card-wrapper operator-card-wrapper',
		rolesImage: STATIC_ICONS.SUPPORT_COMMUNICATION_ROLE,
	},
	support: {
		cardWrapper: 'support-operator-card-wrapper operator-card-wrapper',
		rolesImage: STATIC_ICONS.SUPPORT_ROLE,
	},
	auditor: {
		cardWrapper: 'auditor-operator-card-wrapper operator-card-wrapper',
		rolesImage: STATIC_ICONS.AUDITOR_ROLE,
	},
	announcer: {
		cardWrapper: 'announcer-operator-card-wrapper operator-card-wrapper',
		rolesImage: STATIC_ICONS.ANNOUNCER_ROLE,
	},
	'Customize a Role': {
		cardWrapper: 'customize-role-operator-card-wrapper operator-card-wrapper',
	},
	default: {
		cardWrapper: 'operator-card-wrapper',
	},
};

const PermissionTabs = ({
	checkedKeys,
	setCheckedKeys,
	treeData,
	restrictions,
	setRestrictions,
	permissionDescriptions,
	coins,
}) => {
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

	// const addRestriction = (type) => {
	// 	setRestrictions((prev) => {
	// 		const safePrev = prev || {};
	// 		if (safePrev[type]) {
	// 			// Already exists, don't allow adding another
	// 			return safePrev;
	// 		}
	// 		return {
	// 			...safePrev,
	// 			[type]: { currencies: [], max_amount: null },
	// 		};
	// 	});
	// };

	// const updateRestriction = (type, field, value) => {
	// 	setRestrictions((prev) => {
	// 		const safePrev = prev || {};
	// 		if (!safePrev[type]) {
	// 			// If no restriction yet, initialize it
	// 			return {
	// 				...safePrev,
	// 				[type]: {
	// 					currencies: field === 'currencies' ? value : [],
	// 					max_amount: field === 'max_amount' ? value : null,
	// 				},
	// 			};
	// 		}
	// 		return {
	// 			...safePrev,
	// 			[type]: {
	// 				...safePrev[type],
	// 				[field]: value,
	// 			},
	// 		};
	// 	});
	// };

	const renderTreeNodes = (nodes) => {
		return nodes.map((node) => {
			const endpointKey = node.key
				.replace('route:', '/')
				.replace(/\./g, '/')
				.replace(/\/(get|post|put|delete)$/, ':$1');

			const description = permissionDescriptions[`/admin${endpointKey}`]
				? ` (${permissionDescriptions[`/admin${endpointKey}`]})`
				: '';

			return {
				...node,
				title: (
					<span className="tree-node-label">
						{node.title} {description}
					</span>
				),
				children: node.children ? renderTreeNodes(node.children) : null,
			};
		});
	};

	// const currenciesList = Object.keys(coins);

	return (
		<Tabs defaultActiveKey="1">
			<TabPane
				tab={<span className="permission-tab-header">API Routes</span>}
				key="1"
			>
				<div className="permission-tab-content">
					<Tree
						className="custom-tree"
						checkable
						onCheck={(keys, info) => onCheck(keys, info, 'route')}
						checkedKeys={checkedKeys.filter((key) => key.startsWith('route:'))}
						treeData={renderTreeNodes(treeData)}
						height={400}
					/>
				</div>
			</TabPane>
			<TabPane
				tab={<span className="permission-tab-header">Kit Configuration</span>}
				key="2"
			>
				<div className="permission-tab-content">
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
				tab={<span className="permission-tab-header">Kit Secrets</span>}
				key="3"
			>
				<div className="permission-tab-content">
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
			{/* <TabPane
				tab={<span style={{ color: 'white' }}>Restricitons</span>}
				key="4"
			>
				<div
					style={{
						maxHeight: '400px',
						overflow: 'auto',
						border: '1px solid #d9d9d9',
						padding: '10px',
					}}
				>
					<div style={{ color: 'white', marginBottom: '10px' }}>
						<Button
							onClick={() => addRestriction('mint')}
							type="primary"
							style={{ marginRight: '10px', marginBottom: 10 }}
						>
							Add Mint Restriction
						</Button>
						<Button onClick={() => addRestriction('burn')} type="primary">
							Add Burn Restriction
						</Button>
					</div>

					{['mint', 'burn']?.map(
						(type) =>
							restrictions?.[type] && (
								<Card
									key={type}
									size="small"
									title={`${
										type.charAt(0).toUpperCase() + type.slice(1)
									} Restriction`}
									style={{ marginBottom: '10px' }}
									className="resctiction-details-card"
								>
									<div style={{ marginBottom: '10px' }}>
										<Select
											mode="multiple"
											placeholder="Select currencies"
											style={{ width: '100%', color: 'black' }}
											value={restrictions[type].currencies}
											onChange={(value) =>
												updateRestriction(type, 'currencies', value)
											}
										>
											{currenciesList.map((currency) => (
												<Option key={currency} value={currency}>
													{currency}
												</Option>
											))}
										</Select>
									</div>
									<InputNumber
										className="admin-role-input-number"
										placeholder="Max amount"
										style={{ width: '100%', backgroundColor: '#27339D' }}
										value={restrictions[type].max_amount}
										onChange={(value) =>
											updateRestriction(type, 'max_amount', value)
										}
									/>
								</Card>
							)
					)}
				</div>
			</TabPane> */}
		</Tabs>
	);
};

const RoleForm = ({
	initialValues,
	onSubmit,
	onCancel,
	isEditing,
	treeData,
	permissionDescriptions,
	coins,
}) => {
	const [form] = Form.useForm();
	const [checkedKeys, setCheckedKeys] = useState([]);
	const [restrictions, setRestrictions] = useState({});
	const [selectedBadge, setSelectedBadge] = useState('');

	function separateKeys(keys) {
		const configAndSecretKeys = [];
		const otherKeys = [];

		for (const key of keys) {
			if (key.startsWith('config:') || key.startsWith('secret:')) {
				configAndSecretKeys.push(key);
			} else {
				otherKeys.push(key);
			}
		}

		return [configAndSecretKeys, otherKeys];
	}

	useEffect(() => {
		if (initialValues) {
			form.setFieldsValue({
				role_name: initialValues.role_name,
				description: initialValues.description,
				color: initialValues.color || '#27339d',
				restrictions: Array.isArray(initialValues.restrictions)
					? {}
					: initialValues.restrictions,
			});
			setCheckedKeys(
				[...initialValues.permissions, ...initialValues.configs] || []
			);
			setRestrictions(initialValues.restrictions || {});
		} else {
			form.setFieldsValue({
				color: '#27339d',
			});
		}
	}, [initialValues, form]);

	const handleSubmit = () => {
		form
			.validateFields()
			.then((values) => {
				const [configSecretKeys, restKeys] = separateKeys(checkedKeys);
				const payload = {
					name: values.role_name,
					description: values.description,
					color: values.color,
					permissions: restKeys,
					configs: configSecretKeys,
					restrictions: Array.isArray(restrictions) ? {} : restrictions,
				};
				onSubmit(payload);
			})
			.catch((info) => {
				message.error('Validate Failed:', info);
			});
	};

	const onHandleBadge = () => {
		const roleName = form.getFieldValue('role_name')?.toLowerCase();
		const role = roleStyles[roleName];

		if (role?.rolesImage) {
			setSelectedBadge(role.rolesImage);
		} else {
			const roleCharacterCount = totalCharacters(roleName);
			const badgeList = Object.keys(STATIC_ICONS.ADMIN_ROLE_IMAGES);
			const badge = badgeList[roleCharacterCount % badgeList.length];
			setSelectedBadge(STATIC_ICONS.ADMIN_ROLE_IMAGES[badge]);
		}
	};

	useEffect(() => {
		onHandleBadge();
		//eslint-disable-next-line
	}, []);

	const onHandleChange = (e) => {
		form.setFieldsValue({
			role_name: e.target.value.toLowerCase().replace(/\s+/g, ''),
		});
		onHandleBadge();
	};

	return (
		<Form form={form} layout="vertical" className="roles-detail-form-wrapper">
			<Form.Item
				name="role_name"
				label={<span className="font-weight-bold">Role Name</span>}
				rules={[
					{ required: true, message: 'Please input the role name!' },
					{ max: 50, message: 'Role name cannot exceed 50 characters!' },
					{
						pattern: /^(?!\s)(\S)*$/,
						message:
							'Role name cannot start with a space or contain whitespace!',
					},
				]}
			>
				<Input
					onChange={(e) => onHandleChange(e)}
					placeholder="Enter role name"
					disabled={!!initialValues}
				/>
			</Form.Item>

			<Form.Item
				name="description"
				label={<span className="font-weight-bold">Description</span>}
				rules={[
					{ required: true, message: 'Please input the role description!' },
					{ max: 255, message: 'Description cannot exceed 255 characters!' },
					{ whitespace: true, message: 'Please input the role name!' },
				]}
			>
				<Input.TextArea rows={3} placeholder="Enter role description" />
			</Form.Item>
			<Form.Item
				name="color"
				label={<span className="font-weight-bold">Role Color Code</span>}
			>
				<ColorPicker
					showText
					allowClear
					value={form.getFieldValue('color')}
					onChange={(value) => {
						form.setFieldsValue({ color: value });
					}}
				/>
			</Form.Item>
			<Form.Item
				name="Badge"
				label={<span className="font-weight-bold">Role Badge</span>}
			>
				<div className="role-badge-wrapper">
					<ReactSVG src={selectedBadge} className="role-badge" />
				</div>
			</Form.Item>
			<Divider orientation="left">
				<span className="font-weight-bold">Permissions</span>
			</Divider>

			<Collapse defaultActiveKey={['1']}>
				<Panel header="Permission Settings" key="1">
					<PermissionTabs
						checkedKeys={checkedKeys}
						setCheckedKeys={setCheckedKeys}
						treeData={treeData}
						permissionDescriptions={permissionDescriptions}
						restrictions={restrictions}
						setRestrictions={setRestrictions}
						coins={coins}
					/>
				</Panel>
			</Collapse>

			<Divider />

			<Form.Item>
				<div className="button-container">
					<Button onClick={onCancel} className="cancel-btn role-btn w-50">
						Cancel
					</Button>
					{isEditing && ['admin']?.includes(initialValues?.role_name) ? (
						<Tooltip
							title={
								<span>
									The permissions of the original admin can't be edited.{' '}
								</span>
							}
							placement="topLeft"
							className="role-btn w-50 green-btn disabled-btn d-flex align-items-center justify-content-center"
							getPopupContainer={(triggerNode) => triggerNode.parentNode}
						>
							Update Role
						</Tooltip>
					) : (
						<Button
							type="primary"
							onClick={handleSubmit}
							className="role-btn w-50 green-btn"
						>
							{isEditing ? 'Update Role' : 'Create Role'}
						</Button>
					)}
				</div>
			</Form.Item>
		</Form>
	);
};

const Warning2faPopup = ({
	currentRole,
	isDeleteWarning = false,
	setIsModalVisible,
}) => {
	return (
		<div className="warning-verification-popup-details">
			<div className="warning-message-wrapper">
				<ExclamationCircleOutlined />
				<span>
					To {isDeleteWarning ? 'delete' : currentRole ? 'update' : 'create'} a
					role, you need to enable 2FA (two-factor authentication) first.
				</span>
			</div>
			<span
				className="text-decoration-underline pointer"
				onClick={() => browserHistory.push('/security')}
			>
				Enable 2FA
			</span>
			<div className="d-flex justify-content-center mt-3">
				<Button
					className="w-50 green-btn no-border"
					type="primary"
					onClick={() => setIsModalVisible(false)}
				>
					Close
				</Button>
			</div>
		</div>
	);
};

const RoleManagement = ({
	userId,
	isModalVisible,
	setIsModalVisible,
	currentRole,
	setCurrentRole,
	isUpgrade,
	isColorDark,
	user,
	coins,
	setRolesList,
}) => {
	const [roles, setRoles] = useState([]);
	// eslint-disable-next-line
	const [loading, setLoading] = useState(false);
	const [treeData, setTreeData] = useState([]);
	const [otpDialogIsOpen, setOtpDialogIsOpen] = useState(false);
	const [payload, setPayload] = useState();
	const [isConfirmDelete, setIsConfirmDelete] = useState(false);
	const [selectedRole, setSelectedRole] = useState({});
	const [isPermissionDisplay, setIsPermissionDisplay] = useState({});
	const [permissionDescriptions, setPermissionDescriptions] = useState({});

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
				setPermissionDescriptions(response?.descriptions);
			})
			.catch((err) => {
				message.error('Error fetching roles:', err);
			});
		fetchRoles()
			.then((response) => {
				const transformedRoles = response.data.map((role) =>
					transformPermissions(role, KIT_CONFIG_KEYS, KIT_SECRETS_KEYS)
				);
				setRolesList(response?.data);
				setRoles(transformedRoles);
			})
			.catch((err) => {
				message.error('Error fetching roles:', err);
			});
		// eslint-disable-next-line
	}, []);

	const handleCreate = () => {
		setCurrentRole(null);
		setIsModalVisible(true);
	};

	const handleEdit = (role) => {
		setCurrentRole(role);
		setIsModalVisible(true);
	};

	const onHandleConfirmDelete = (role) => {
		setIsConfirmDelete(true);
		setSelectedRole(role);
	};

	const handleDelete = async () => {
		const roleId = selectedRole?.id;
		// try {
		setPayload({ action: 'delete', id: roleId });
		// 	await deleteRoles({ id: roleId, otp_code: '' });

		// 	fetchRoles()
		// 		.then((response) => {
		// 			const transformedRoles = response.data.map((role) =>
		// 				transformPermissions(role, KIT_CONFIG_KEYS, KIT_SECRETS_KEYS)
		// 			);

		// 			setRoles(transformedRoles);
		// 		})
		// 		.catch((err) => {
		// 			message.error('Error fetching roles:', err);
		// 		});
		// 	message.success('Role deleted successfully');
		// } catch (err) {
		// 	const _error =
		// 		err.data && err.data.message ? err.data.message : err.message;
		// 	if (_error.toLowerCase().indexOf('otp') > -1) {
		// 	} else {
		// 		message.error(_error || 'Failed to delete role');
		// 	}
		// } finally {
		// 	setLoading(false);
		// }
		setOtpDialogIsOpen(true);
		setIsConfirmDelete(false);
		// setSelectedRole({});
	};

	const handleSubmit = async (values) => {
		try {
			setLoading(true);
			if (!values?.otp) {
				setOtpDialogIsOpen(true);
			}
			if (currentRole) {
				setPayload({
					...values,
					id: currentRole.id,
					user_id: userId,
				});
				if (values?.otp) {
					await updateRoles({
						...values,
						id: currentRole.id,
						user_id: userId,
					});
					message.success('Role updated successfully');
				}
			} else {
				setPayload({
					...values,
					user_id: userId,
				});
				if (values?.otp) {
					await createRoles({
						...values,
						user_id: userId,
					});
					message.success('Role created successfully');
				}
			}
			if (values?.otp) {
				fetchRoles()
					.then((response) => {
						const transformedRoles = response.data.map((role) =>
							transformPermissions(role, KIT_CONFIG_KEYS, KIT_SECRETS_KEYS)
						);
						setRolesList(response?.data);
						setRoles(transformedRoles);
					})
					.catch((err) => {
						message.error('Error fetching roles:', err);
					});
			}
			setIsModalVisible(false);
		} catch (err) {
			const _error =
				err.data && err.data.message ? err.data.message : err.message;
			if (_error.toLowerCase().indexOf('otp') > -1) {
				setOtpDialogIsOpen(true);
			} else {
				message.error(_error || 'Failed to save role');
			}
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

	const onSubmitRoleOtp = async (values) => {
		try {
			if (payload.action === 'delete') {
				await deleteRoles({ ...payload, otp_code: values.otp_code });
				message.success('Role deleted successfully');
			} else if (currentRole) {
				await updateRoles({
					...payload,
					otp_code: values.otp_code,
				});
				message.success('Role updated successfully');
			} else {
				await createRoles({
					...payload,
					otp_code: values.otp_code,
				});
				message.success('Role created successfully');
			}

			fetchRoles()
				.then((response) => {
					const transformedRoles = response.data.map((role) =>
						transformPermissions(role, KIT_CONFIG_KEYS, KIT_SECRETS_KEYS)
					);
					setRolesList(response?.data);
					setRoles(transformedRoles);
				})
				.catch((err) => {
					message.error('Error fetching roles:', err);
				});
			setIsModalVisible(false);
			setOtpDialogIsOpen(false);
			setPayload();
		} catch (err) {
			const _error =
				err.data && err.data.message ? err.data.message : err.message;

			message.error(_error);
		}
	};

	const customRole = {
		role_name: 'Customize a Role',
		description: 'New Team Role',
	};

	const customizedrole = [
		...roles.sort((a, b) => {
			const roleOrder = Object.keys(roleStyles);
			const indexA = roleOrder.indexOf(a.role_name);
			const indexB = roleOrder.indexOf(b.role_name);

			if (indexA === -1 && indexB === -1) {
				return a.role_name.localeCompare(b.role_name);
			} else if (indexA === -1) {
				return 1;
			} else if (indexB === -1) {
				return -1;
			} else {
				return indexA - indexB;
			}
		}),
		customRole,
	];

	const onHandleDisplayPermission = (role) => {
		setIsPermissionDisplay((prev) => ({
			...prev,
			[role?.id]: !prev[role?.id],
		}));
	};

	return (
		<div className="roles-management-wrapper w-100">
			<Modal
				visible={isConfirmDelete}
				title={
					!user.otp_enabled && <span className="popup-title">Enable 2FA</span>
				}
				onCancel={() => setIsConfirmDelete(false)}
				footer={null}
				width={450}
				maskClosable={false}
				centered={true}
				closeIcon={<CloseOutlined />}
				className="confirm-roles-delete-popup"
				wrapClassName="operator-roles-detail-popup"
			>
				{user.otp_enabled ? (
					<div className="confirm-roles-delete-wrapper">
						<div className="d-flex">
							<ExclamationCircleOutlined className="warning-icon mt-1" />
							<p className="title ml-2">
								Are you sure you want to delete this role?
							</p>
						</div>
						<div className="button-container d-flex justify-content-between">
							<Button
								type="primary"
								className="w-50"
								onClick={() => setIsConfirmDelete(false)}
							>
								No
							</Button>
							<Button
								danger
								type="primary"
								className="w-50"
								onClick={handleDelete}
							>
								Yes, delete it
							</Button>
						</div>
					</div>
				) : (
					<Warning2faPopup
						currentRole={currentRole}
						setIsModalVisible={setIsConfirmDelete}
						isDeleteWarning={true}
					/>
				)}
			</Modal>
			{otpDialogIsOpen && (
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined />}
					visible={otpDialogIsOpen}
					footer={null}
					onCancel={() => {
						setOtpDialogIsOpen(false);
					}}
				>
					<OtpForm onSubmit={onSubmitRoleOtp} />
				</Modal>
			)}
			<div className="d-flex justify-content-between roles-management-title-wrapper">
				<Title level={2}>Role Management</Title>
				{/* {!isUpgrade && (
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={handleCreate}
						style={{ marginBottom: 16, backgroundColor: '#288501' }}
						className='create-btn'
					>
						Create New Role
					</Button>
				)} */}
			</div>
			{isUpgrade && (
				<div className="d-flex">
					<div className="d-flex align-items-center justify-content-between upgrade-section mt-2 mb-5">
						<div>
							<div className="font-weight-bold">Create New Roles</div>
							<div>Customize roles and create new ones for your exchange</div>
						</div>
						<div className="ml-5 button-wrapper">
							<a
								href="https://dash.hollaex.com/billing"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Button type="primary" className="w-100 create-btn">
									Upgrade Now
								</Button>
							</a>
						</div>
					</div>
				</div>
			)}
			<div className="operator-cards-container">
				{customizedrole.map((role, index) => {
					const cardWrapper =
						roleStyles[role?.role_name]?.cardWrapper ||
						roleStyles?.default?.cardWrapper;
					const rolesImage = roleStyles[role?.role_name]?.rolesImage;
					return (
						<Col key={index}>
							<div
								className={
									isColorDark(role?.color)
										? `operator-control-card-light ${cardWrapper || ''}`
										: !rolesImage
										? `operator-control-card-dark ${
												cardWrapper || ''
										  } justify-content-start`
										: `operator-control-card-dark ${cardWrapper || ''} `
								}
								style={{ backgroundColor: role?.color && role?.color }}
							>
								<div className="card-content">
									<div className="card-content-description">
										<p className="card-title">
											{role?.role_name?.toUpperCase()}
										</p>
										<p
											className={
												isPermissionDisplay[role?.id]
													? 'caps'
													: 'card-description caps'
											}
										>
											{role?.description}
										</p>
										{role?.role_name !== 'Customize a Role' &&
											role?.permissions?.length > 0 &&
											!isPermissionDisplay[role?.id] && (
												<p
													className="text-decoration-underline pointer permissions"
													onClick={() => onHandleDisplayPermission(role)}
												>
													VIEW MORE
												</p>
											)}
									</div>
									{role?.role_name !== 'Customize a Role' && (
										<ReactSVG
											src={
												rolesImage
													? rolesImage
													: onHandleBadge(role?.role_name?.toLowerCase())
											}
											className="role-icon-wrapper"
										/>
									)}
								</div>
								{isPermissionDisplay[role?.id] && (
									<div className="preview-permission-content">
										<p className="font-weight-bold my-2">PERMISSIONS PREVIEW</p>
										<ul className="permissions-list">
											{[...(role?.permissions || []), ...(role?.configs || [])]
												.slice(0, 4)
												.map((perm, i) => (
													<li key={i}>
														<strong>{formatPermissionType(perm)}:</strong>{' '}
														{formatPermissionName(perm)}
													</li>
												))}
											{(role?.permissions?.length || 0) +
												(role?.configs?.length || 0) >
												4 && (
												<li
													className="text-decoration-underline pointer"
													onClick={() => {
														handleEdit(role);
														onHandleDisplayPermission(role);
													}}
												>
													{`...view all ${
														role?.permissions?.length +
														(role?.configs?.length || 0) -
														4
													} permissions`}
												</li>
											)}
											{role?.role_name !== 'Customize a Role' &&
												role?.permissions?.length > 0 &&
												isPermissionDisplay[role?.id] && (
													<p
														className="text-decoration-underline pointer permissions mt-2"
														onClick={() => onHandleDisplayPermission(role)}
													>
														HIDE
													</p>
												)}
										</ul>
									</div>
								)}
								<div className="button-container">
									{role?.role_name === 'Customize a Role' ? (
										<span
											className="permission-btn pointer caps"
											onClick={handleCreate}
										>
											Create a Role
										</span>
									) : role?.role_name === 'admin' ? (
										<Tooltip
											title={
												<span>
													The permissions of the original admin can't be edited.{' '}
												</span>
											}
											placement="topLeft"
											className="permission-btn disabled-btn caps"
											getPopupContainer={(triggerNode) =>
												triggerNode.parentNode
											}
										>
											Edit Permission (
											{role?.permissions?.length + (role?.configs?.length || 0)}
											)
										</Tooltip>
									) : (
										<span
											className="permission-btn pointer caps"
											onClick={() => {
												handleEdit(role);
											}}
										>
											Edit Permission (
											{role?.permissions?.length + (role?.configs?.length || 0)}
											)
										</span>
									)}
									{!['admin', 'Customize a Role'].includes(role?.role_name) && (
										<span
											className="permission-btn delete-btn pointer caps"
											onClick={() => onHandleConfirmDelete(role)}
										>
											Delete
										</span>
									)}
								</div>
							</div>
						</Col>
					);
				})}
			</div>
			<Modal
				title={
					<span className="popup-title">
						{user.otp_enabled
							? currentRole
								? 'Edit Role'
								: 'Create New Role'
							: 'Enable 2FA'}
					</span>
				}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
				width={user.otp_enabled ? 550 : 400}
				destroyOnClose
				wrapClassName="operator-roles-detail-popup"
			>
				{user.otp_enabled ? (
					<RoleForm
						initialValues={currentRole}
						onSubmit={handleSubmit}
						onCancel={() => setIsModalVisible(false)}
						isEditing={!!currentRole}
						treeData={treeData}
						permissionDescriptions={permissionDescriptions}
						coins={coins}
					/>
				) : (
					<Warning2faPopup
						currentRole={currentRole}
						setIsModalVisible={setIsModalVisible}
					/>
				)}
			</Modal>
		</div>
	);
};

export default RoleManagement;
