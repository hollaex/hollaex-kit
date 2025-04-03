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
import { fetchRoles, createRoles, updateRoles, deleteRoles } from './action';

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
	return Object.entries(routes).map(([key, value]) => {
		const path = parentPath ? `${parentPath}.${key}` : key;
		if (
			typeof value === 'object' &&
			!value.get &&
			!value.post &&
			!value.put &&
			!value.delete
		) {
			return {
				title: key.replace(/-/g, ' '),
				key: `route:${path}`,
				children: convertRoutesToTree(value, path),
			};
		} else {
			return {
				title: key.replace(/-/g, ' '),
				key: `route:${path}`,
				children: Object.entries(value)
					.filter(([method]) =>
						['get', 'post', 'put', 'delete'].includes(method)
					)
					.map(([method]) => ({
						title: method.toUpperCase(),
						key: `route:${path}.${method}`,
						isLeaf: true,
					})),
			};
		}
	});
};

const routes = {
	exchange: {
		get: '/admin/exchange:get',
		post: '/admin/exchange:post',
		put: '/admin/exchange:put',
		delete: '/admin/exchange:delete',
	},
	tier: {
		get: '/admin/tier:get',
		post: '/admin/tier:post',
		put: '/admin/tier:put',
		delete: '/admin/tier:delete',
	},
	'check-transaction': {
		get: '/admin/check-transaction:get',
		post: '/admin/check-transaction:post',
		put: '/admin/check-transaction:put',
		delete: '/admin/check-transaction:delete',
	},
	'send-email-test': {
		get: '/admin/send-email-test:get',
		post: '/admin/send-email-test:post',
		put: '/admin/send-email-test:put',
		delete: '/admin/send-email-test:delete',
	},
	fees: {
		get: '/admin/fees:get',
		post: '/admin/fees:post',
		put: '/admin/fees:put',
		delete: '/admin/fees:delete',
		settle: {
			get: '/admin/fees/settle:get',
			post: '/admin/fees/settle:post',
			put: '/admin/fees/settle:put',
			delete: '/admin/fees/settle:delete',
		},
	},
	signup: {
		get: '/admin/signup:get',
		post: '/admin/signup:post',
		put: '/admin/signup:put',
		delete: '/admin/signup:delete',
	},
	'complete-setup': {
		get: '/admin/complete-setup:get',
		post: '/admin/complete-setup:post',
		put: '/admin/complete-setup:put',
		delete: '/admin/complete-setup:delete',
	},
	'network-credentials': {
		get: '/admin/network-credentials:get',
		post: '/admin/network-credentials:post',
		put: '/admin/network-credentials:put',
		delete: '/admin/network-credentials:delete',
	},
	kit: {
		get: '/admin/kit:get',
		post: '/admin/kit:post',
		put: '/admin/kit:put',
		delete: '/admin/kit:delete',
		'user-meta': {
			get: '/admin/kit/user-meta:get',
			post: '/admin/kit/user-meta:post',
			put: '/admin/kit/user-meta:put',
			delete: '/admin/kit/user-meta:delete',
		},
	},
	email: {
		get: '/admin/email:get',
		post: '/admin/email:post',
		put: '/admin/email:put',
		delete: '/admin/email:delete',
		types: {
			get: '/admin/email/types:get',
			post: '/admin/email/types:post',
			put: '/admin/email/types:put',
			delete: '/admin/email/types:delete',
		},
	},
	operators: {
		get: '/admin/operators:get',
		post: '/admin/operators:post',
		put: '/admin/operators:put',
		delete: '/admin/operators:delete',
	},
	operator: {
		invite: {
			get: '/admin/operator/invite:get',
			post: '/admin/operator/invite:post',
			put: '/admin/operator/invite:put',
			delete: '/admin/operator/invite:delete',
		},
	},
	upload: {
		get: '/admin/upload:get',
		post: '/admin/upload:post',
		put: '/admin/upload:put',
		delete: '/admin/upload:delete',
	},
	pair: {
		get: '/admin/pair:get',
		post: '/admin/pair:post',
		put: '/admin/pair:put',
		delete: '/admin/pair:delete',
		fees: {
			get: '/admin/pair/fees:get',
			post: '/admin/pair/fees:post',
			put: '/admin/pair/fees:put',
			delete: '/admin/pair/fees:delete',
		},
	},
	pairs: {
		get: '/admin/pairs:get',
		post: '/admin/pairs:post',
		put: '/admin/pairs:put',
		delete: '/admin/pairs:delete',
		network: {
			get: '/admin/pairs/network:get',
			post: '/admin/pairs/network:post',
			put: '/admin/pairs/network:put',
			delete: '/admin/pairs/network:delete',
		},
	},
	coin: {
		get: '/admin/coin:get',
		post: '/admin/coin:post',
		put: '/admin/coin:put',
		delete: '/admin/coin:delete',
	},
	coins: {
		get: '/admin/coins:get',
		post: '/admin/coins:post',
		put: '/admin/coins:put',
		delete: '/admin/coins:delete',
		network: {
			get: '/admin/coins/network:get',
			post: '/admin/coins/network:post',
			put: '/admin/coins/network:put',
			delete: '/admin/coins/network:delete',
		},
	},
	users: {
		get: '/admin/users:get',
		post: '/admin/users:post',
		put: '/admin/users:put',
		delete: '/admin/users:delete',
	},
	user: {
		get: '/admin/user:get',
		post: '/admin/user:post',
		put: '/admin/user:put',
		delete: '/admin/user:delete',
		role: {
			get: '/admin/user/role:get',
			post: '/admin/user/role:post',
			put: '/admin/user/role:put',
			delete: '/admin/user/role:delete',
		},
		meta: {
			get: '/admin/user/meta:get',
			post: '/admin/user/meta:post',
			put: '/admin/user/meta:put',
			delete: '/admin/user/meta:delete',
		},
		discount: {
			get: '/admin/user/discount:get',
			post: '/admin/user/discount:post',
			put: '/admin/user/discount:put',
			delete: '/admin/user/discount:delete',
		},
		note: {
			get: '/admin/user/note:get',
			post: '/admin/user/note:post',
			put: '/admin/user/note:put',
			delete: '/admin/user/note:delete',
		},
		balance: {
			get: '/admin/user/balance:get',
			post: '/admin/user/balance:post',
			put: '/admin/user/balance:put',
			delete: '/admin/user/balance:delete',
		},
		bank: {
			get: '/admin/user/bank:get',
			post: '/admin/user/bank:post',
			put: '/admin/user/bank:put',
			delete: '/admin/user/bank:delete',
		},
		restore: {
			get: '/admin/user/restore:get',
			post: '/admin/user/restore:post',
			put: '/admin/user/restore:put',
			delete: '/admin/user/restore:delete',
		},
		email: {
			get: '/admin/user/email:get',
			post: '/admin/user/email:post',
			put: '/admin/user/email:put',
			delete: '/admin/user/email:delete',
		},
		'balance-history': {
			get: '/admin/user/balance-history:get',
			post: '/admin/user/balance-history:post',
			put: '/admin/user/balance-history:put',
			delete: '/admin/user/balance-history:delete',
		},
		activate: {
			get: '/admin/user/activate:get',
			post: '/admin/user/activate:post',
			put: '/admin/user/activate:put',
			delete: '/admin/user/activate:delete',
		},
		affiliation: {
			get: '/admin/user/affiliation:get',
			post: '/admin/user/affiliation:post',
			put: '/admin/user/affiliation:put',
			delete: '/admin/user/affiliation:delete',
		},
		referer: {
			get: '/admin/user/referer:get',
			post: '/admin/user/referer:post',
			put: '/admin/user/referer:put',
			delete: '/admin/user/referer:delete',
		},
		wallet: {
			get: '/admin/user/wallet:get',
			post: '/admin/user/wallet:post',
			put: '/admin/user/wallet:put',
			delete: '/admin/user/wallet:delete',
		},
		'disable-withdrawal': {
			get: '/admin/user/disable-withdrawal:get',
			post: '/admin/user/disable-withdrawal:post',
			put: '/admin/user/disable-withdrawal:put',
			delete: '/admin/user/disable-withdrawal:delete',
		},
		sessions: {
			get: '/admin/user/sessions:get',
			post: '/admin/user/sessions:post',
			put: '/admin/user/sessions:put',
			delete: '/admin/user/sessions:delete',
		},
		'revoke-session': {
			get: '/admin/user/revoke-session:get',
			post: '/admin/user/revoke-session:post',
			put: '/admin/user/revoke-session:put',
			delete: '/admin/user/revoke-session:delete',
		},
		'trading-volume': {
			get: '/admin/user/trading-volume:get',
			post: '/admin/user/trading-volume:post',
			put: '/admin/user/trading-volume:put',
			delete: '/admin/user/trading-volume:delete',
		},
		referral: {
			code: {
				get: '/admin/user/referral/code:get',
				post: '/admin/user/referral/code:post',
				put: '/admin/user/referral/code:put',
				delete: '/admin/user/referral/code:delete',
			},
		},
		'payment-details': {
			get: '/admin/user/payment-details:get',
			post: '/admin/user/payment-details:post',
			put: '/admin/user/payment-details:put',
			delete: '/admin/user/payment-details:delete',
		},
	},
	bank: {
		verify: {
			get: '/admin/bank/verify:get',
			post: '/admin/bank/verify:post',
			put: '/admin/bank/verify:put',
			delete: '/admin/bank/verify:delete',
		},
		revoke: {
			get: '/admin/bank/revoke:get',
			post: '/admin/bank/revoke:post',
			put: '/admin/bank/revoke:put',
			delete: '/admin/bank/revoke:delete',
		},
	},
	logins: {
		get: '/admin/logins:get',
		post: '/admin/logins:post',
		put: '/admin/logins:put',
		delete: '/admin/logins:delete',
	},
	audits: {
		get: '/admin/audits:get',
		post: '/admin/audits:post',
		put: '/admin/audits:put',
		delete: '/admin/audits:delete',
	},
	orders: {
		get: '/admin/orders:get',
		post: '/admin/orders:post',
		put: '/admin/orders:put',
		delete: '/admin/orders:delete',
	},
	order: {
		get: '/admin/order:get',
		post: '/admin/order:post',
		put: '/admin/order:put',
		delete: '/admin/order:delete',
	},
	trades: {
		get: '/admin/trades:get',
		post: '/admin/trades:post',
		put: '/admin/trades:put',
		delete: '/admin/trades:delete',
	},
	balance: {
		get: '/admin/balance:get',
		post: '/admin/balance:post',
		put: '/admin/balance:put',
		delete: '/admin/balance:delete',
	},
	'upgrade-user': {
		get: '/admin/upgrade-user:get',
		post: '/admin/upgrade-user:post',
		put: '/admin/upgrade-user:put',
		delete: '/admin/upgrade-user:delete',
	},
	'verify-email': {
		get: '/admin/verify-email:get',
		post: '/admin/verify-email:post',
		put: '/admin/verify-email:put',
		delete: '/admin/verify-email:delete',
	},
	'deactivate-otp': {
		get: '/admin/deactivate-otp:get',
		post: '/admin/deactivate-otp:post',
		put: '/admin/deactivate-otp:put',
		delete: '/admin/deactivate-otp:delete',
	},
	'flag-user': {
		get: '/admin/flag-user:get',
		post: '/admin/flag-user:post',
		put: '/admin/flag-user:put',
		delete: '/admin/flag-user:delete',
	},
	deposits: {
		get: '/admin/deposits:get',
		post: '/admin/deposits:post',
		put: '/admin/deposits:put',
		delete: '/admin/deposits:delete',
	},
	withdrawals: {
		get: '/admin/withdrawals:get',
		post: '/admin/withdrawals:post',
		put: '/admin/withdrawals:put',
		delete: '/admin/withdrawals:delete',
	},
	transfer: {
		get: '/admin/transfer:get',
		post: '/admin/transfer:post',
		put: '/admin/transfer:put',
		delete: '/admin/transfer:delete',
	},
	mint: {
		get: '/admin/mint:get',
		post: '/admin/mint:post',
		put: '/admin/mint:put',
		delete: '/admin/mint:delete',
	},
	burn: {
		get: '/admin/burn:get',
		post: '/admin/burn:post',
		put: '/admin/burn:put',
		delete: '/admin/burn:delete',
	},
	'dash-token': {
		get: '/admin/dash-token:get',
		post: '/admin/dash-token:post',
		put: '/admin/dash-token:put',
		delete: '/admin/dash-token:delete',
	},
	'send-email': {
		get: '/admin/send-email:get',
		post: '/admin/send-email:post',
		put: '/admin/send-email:put',
		delete: '/admin/send-email:delete',
		raw: {
			get: '/admin/send-email/raw:get',
			post: '/admin/send-email/raw:post',
			put: '/admin/send-email/raw:put',
			delete: '/admin/send-email/raw:delete',
		},
	},
	quicktrade: {
		config: {
			get: '/admin/quicktrade/config:get',
			post: '/admin/quicktrade/config:post',
			put: '/admin/quicktrade/config:put',
			delete: '/admin/quicktrade/config:delete',
		},
	},
	transaction: {
		limit: {
			get: '/admin/transaction/limit:get',
			post: '/admin/transaction/limit:post',
			put: '/admin/transaction/limit:put',
			delete: '/admin/transaction/limit:delete',
		},
	},
	balances: {
		get: '/admin/balances:get',
		post: '/admin/balances:post',
		put: '/admin/balances:put',
		delete: '/admin/balances:delete',
	},
	stakes: {
		get: '/admin/stakes:get',
		post: '/admin/stakes:post',
		put: '/admin/stakes:put',
		delete: '/admin/stakes:delete',
	},
	stake: {
		get: '/admin/stake:get',
		post: '/admin/stake:post',
		put: '/admin/stake:put',
		delete: '/admin/stake:delete',
		'slash-estimate': {
			get: '/admin/stake/slash-estimate:get',
			post: '/admin/stake/slash-estimate:post',
			put: '/admin/stake/slash-estimate:put',
			delete: '/admin/stake/slash-estimate:delete',
		},
		analytics: {
			get: '/admin/stake/analytics:get',
			post: '/admin/stake/analytics:post',
			put: '/admin/stake/analytics:put',
			delete: '/admin/stake/analytics:delete',
		},
	},
	stakers: {
		get: '/admin/stakers:get',
		post: '/admin/stakers:post',
		put: '/admin/stakers:put',
		delete: '/admin/stakers:delete',
	},
	p2p: {
		dispute: {
			get: '/admin/p2p/dispute:get',
			post: '/admin/p2p/dispute:post',
			put: '/admin/p2p/dispute:put',
			delete: '/admin/p2p/dispute:delete',
		},
	},
	trade: {
		get: '/admin/trade:get',
		post: '/admin/trade:post',
		put: '/admin/trade:put',
		delete: '/admin/trade:delete',
	},
	withdrawal: {
		get: '/admin/withdrawal:get',
		post: '/admin/withdrawal:post',
		put: '/admin/withdrawal:put',
		delete: '/admin/withdrawal:delete',
	},
	announcements: {
		get: '/admin/announcements:get',
		post: '/admin/announcements:post',
		put: '/admin/announcements:put',
		delete: '/admin/announcements:delete',
	},
};

const sortedObj = Object.keys(routes)
	.sort()
	.reduce((acc, key) => {
		acc[key] = routes[key];
		return acc;
	}, {});

const treeData = convertRoutesToTree(sortedObj);

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

const PermissionTabs = ({ checkedKeys, setCheckedKeys }) => {
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

const RoleForm = ({ initialValues, onSubmit, onCancel, isEditing }) => {
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

	useEffect(() => {
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
				/>
			</Modal>
		</div>
	);
};

export default RoleManagement;
