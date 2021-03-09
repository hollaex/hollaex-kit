import React from 'react';
import { Dropdown, Menu, Space } from 'antd';
import {
	AntCloudOutlined,
	BulbOutlined,
	CaretDownOutlined,
	CaretRightOutlined,
	CodeSandboxOutlined,
	DollarCircleOutlined,
	FilterOutlined,
	HeatMapOutlined,
	RadarChartOutlined,
	RocketOutlined,
	ScheduleOutlined,
	WindowsOutlined,
} from '@ant-design/icons';

const menus = [
	{
		name: 'HollaEx',
		bold: true,
		icon: null,
		child: false,
		url: '/',
	},
	{
		name: '',
		icon: <WindowsOutlined style={{ fontSize: '20px' }} />,
		child: true,
		url: '/',
		children: [
			{
				name: 'Exchange',
				icon: <CodeSandboxOutlined className={'otherLinkIcon'} />,
				description: 'Blockchain and crypto asset exchange',
				url: '/',
			},
			{
				name: 'Academy',
				icon: <ScheduleOutlined className={'otherLinkIcon'} />,
				description: 'Blockchain and crypto education',
				url: '/',
			},
			{
				name: 'Broker',
				icon: <DollarCircleOutlined className={'otherLinkIcon'} />,
				description: 'Trading terminal solutions',
				url: '/',
			},
			{
				name: 'Charity',
				icon: <HeatMapOutlined className={'otherLinkIcon'} />,
				description: 'Blockchain charity foundation',
				url: '/',
			},
			{
				name: 'Cloud',
				icon: <HeatMapOutlined className={'otherLinkIcon'} />,
				description: 'Enterprise exchange solutions',
				url: '/',
			},
			{
				name: 'DEX',
				icon: <HeatMapOutlined className={'otherLinkIcon'} />,
				description: 'Fast and secure decentralized digital asset exchange',
				url: '/',
			},
			{
				name: 'Labs',
				icon: <HeatMapOutlined className={'otherLinkIcon'} />,
				description: 'Incubator for top blockchain project',
				url: '/',
			},
			{
				name: 'Launchpad',
				icon: <HeatMapOutlined className={'otherLinkIcon'} />,
				description: 'Token Launch Platform',
				url: '/',
			},
			{
				name: 'Launchpad',
				icon: <HeatMapOutlined className={'otherLinkIcon'} />,
				description: 'Token Launch Platform',
				url: '/',
			},
			{
				name: 'Research',
				icon: <HeatMapOutlined className={'otherLinkIcon'} />,
				description: 'Institutional-grade analysis and report',
				url: '/',
			},
		],
	},
	{
		name: 'Buy Crypto',
		icon: <CaretDownOutlined />,
		child: true,
		url: '/',
		children: [
			{
				name: ' Bank Deposit',
				icon: <CaretRightOutlined />,
				description: 'SWIFT Bank Transfer ',
				url: '/',
			},
			{
				name: 'Credit/Debit Card',
				icon: <CaretRightOutlined />,
				description: 'Visa & Master card',
				url: '/',
			},
			{
				name: 'P2P Trading',
				icon: <CaretRightOutlined />,
				description: 'bank Transfer and 100+ options',
				url: '/',
			},
			{
				name: 'Third-party Payment',
				icon: <CaretRightOutlined />,
				description: 'Paxos',
				url: '/',
			},
		],
	},
	{
		name: 'Market',
		bold: false,
		icon: '',
		child: false,
		url: '/',
	},
	{
		name: 'Trade',
		icon: <CaretDownOutlined />,
		child: true,
		url: '/',
		children: [
			{
				name: ' Convert',
				icon: <CaretRightOutlined />,
				description: 'The Easiest way to Trade ',
				url: '/',
			},
			{
				name: ' Classic',
				icon: <CaretRightOutlined />,
				description: 'Simple and Easy to use interface',
				url: '/',
			},
			{
				name: ' Advance',
				icon: <CaretRightOutlined />,
				description: 'Full access to all Trading',
				url: '/',
			},
		],
	},
	{
		name: 'Derivatives',
		icon: <CaretDownOutlined />,
		child: true,
		url: '/',
		children: [
			{
				name: ' USD - M Futures',
				icon: <CaretRightOutlined />,
				description: 'The Easiest way to Trade',
				url: '/',
			},
			{
				name: ' Classic',
				icon: <CaretRightOutlined />,
				description: 'Simple and Easy to use interface',
				url: '/',
			},
			{
				name: ' Advance',
				icon: <CaretRightOutlined />,
				description: 'Full access to all Trading',
				url: '/',
			},
		],
	},
	{
		name: 'Finance',
		icon: <CaretDownOutlined />,
		child: true,
		url: '/',
		children: [
			{
				name: ' USD - M Futures',
				icon: <CaretRightOutlined />,
				description: 'The Easiest way to Trade',
				url: '/',
			},
			{
				name: ' Classic',
				icon: <CaretRightOutlined />,
				description: 'Simple and Easy to use interface',
				url: '/',
			},
			{
				name: ' Advance',
				icon: <CaretRightOutlined />,
				description: 'Full access to all Trading',
				url: '/',
			},
		],
	},
];

export const MenuHollaEx = ({ size }) => {
	const menuList = () => {
		return menus.map((menu) => {
			if (!menu.child) {
				if (menu.bold) {
					return (
						<a href={menu.url} className={'rb-menu gold'}>
							{' '}
							<strong>{menu.name}</strong>{' '}
						</a>
					);
				} else {
					return (
						<a href={menu.url} className={'rb-menu gold'}>
							{' '}
							{menu.name}
						</a>
					);
				}
			} else {
				const subMenus = menu.children.map((dropdown) => {
					return (
						<Menu.Item>
							{dropdown.icon} {dropdown.name}
							<br />
							<span className={'menu-sub-text'}>{dropdown.description} </span>
						</Menu.Item>
					);
				});

				const singleMenu = <Menu theme="dark">{subMenus}</Menu>;

				return (
					<Dropdown overlay={singleMenu}>
						<a
							className="ant-dropdown-link rb-menu"
							onClick={(e) => e.preventDefault()}
						>
							{menu.name} {menu.icon}
						</a>
					</Dropdown>
				);
			}
		});
	};

	return (
		<>
			<Space size={size}>{menuList()}</Space>
		</>
	);
};
