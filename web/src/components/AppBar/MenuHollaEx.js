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

const OtherLinks = (
	<Menu theme="dark">
		<Menu.Item>
			<div>
				<div className={'ico-container'}>
					<CodeSandboxOutlined className={'otherLinkIcon'} />
				</div>
				<div className={'OL-text-container'}>
					Exchange
					<br />
					<div className={'menu-sub-text'}>
						Blockchain and crypto asset exchange
					</div>
				</div>
				&nbsp;
			</div>
		</Menu.Item>
		<Menu.Item>
			<div>
				<div className={'ico-container'}>
					<ScheduleOutlined className={'otherLinkIcon'} />
				</div>
				<div className={'OL-text-container'}>
					Academy
					<br />
					<div className={'menu-sub-text'}>Blockchain and crypto education</div>
				</div>
				&nbsp;
			</div>
		</Menu.Item>
		<Menu.Item>
			<div>
				<div className={'ico-container'}>
					<DollarCircleOutlined className={'otherLinkIcon'} />
				</div>
				<div className={'OL-text-container'}>
					Broker
					<br />
					<div className={'menu-sub-text'}>Trading terminal solutions</div>
				</div>
				&nbsp;
			</div>
		</Menu.Item>
		<Menu.Item>
			<div>
				<div className={'ico-container'}>
					<HeatMapOutlined className={'otherLinkIcon'} />
				</div>
				<div className={'OL-text-container'}>
					Charity
					<br />
					<div className={'menu-sub-text'}>Blockchain charity foundation</div>
				</div>
				&nbsp;
			</div>
		</Menu.Item>

		<Menu.Item>
			<div>
				<div className={'ico-container'}>
					<AntCloudOutlined className={'otherLinkIcon'} />
				</div>
				<div className={'OL-text-container'}>
					Cloud
					<br />
					<div className={'menu-sub-text'}>Enterprise exchange solutions</div>
				</div>
				&nbsp;
			</div>
		</Menu.Item>

		<Menu.Item>
			<div>
				<div className={'ico-container'}>
					<RadarChartOutlined className={'otherLinkIcon'} />
				</div>
				<div className={'OL-text-container'}>
					DEX
					<br />
					<div className={'menu-sub-text'}>
						Fast and secure decentralized digital asset exchange
					</div>
				</div>
				&nbsp;
			</div>
		</Menu.Item>

		<Menu.Item>
			<div>
				<div className={'ico-container'}>
					<FilterOutlined className={'otherLinkIcon'} />
				</div>
				<div className={'OL-text-container'}>
					Labs
					<br />
					<div className={'menu-sub-text'}>
						Incubator for top blockchain project
					</div>
				</div>
				&nbsp;
			</div>
		</Menu.Item>

		<Menu.Item>
			<div>
				<div className={'ico-container'}>
					<RocketOutlined className={'otherLinkIcon'} />
				</div>
				<div className={'OL-text-container'}>
					Launchpad
					<br />
					<div className={'menu-sub-text'}>Token Launch Platform</div>
				</div>
				&nbsp;
			</div>
		</Menu.Item>

		<Menu.Item>
			<div>
				<div className={'ico-container'}>
					<BulbOutlined className={'otherLinkIcon'} />
				</div>
				<div className={'OL-text-container'}>
					Research
					<br />
					<div className={'menu-sub-text'}>
						Institutional-grade analysis and report
					</div>
				</div>
				&nbsp;
			</div>
		</Menu.Item>
	</Menu>
);

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
