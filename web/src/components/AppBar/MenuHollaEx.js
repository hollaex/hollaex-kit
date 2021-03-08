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

const BuyCryptoMenu = (
	<Menu theme="dark">
		<Menu.Item>
			<CaretRightOutlined /> Bank Deposit
			<br />
			<span className={'menu-sub-text'}>SWIFT Bank Transfer </span>
		</Menu.Item>
		<Menu.Item>
			<CaretRightOutlined /> Credit/Debit Card
			<br />
			<span className={'menu-sub-text'}>Visa & Master card </span>
		</Menu.Item>
		<Menu.Item>
			<CaretRightOutlined /> P2P Trading
			<br />
			<span className={'menu-sub-text'}>bank Transfer and 100+ options </span>
		</Menu.Item>
		<Menu.Item>
			<CaretRightOutlined /> Third-party Payment
			<br />
			<span className={'menu-sub-text'}>Paxos </span>
		</Menu.Item>
	</Menu>
);

const TradeMenu = (
	<Menu theme="dark">
		<Menu.Item>
			<CaretRightOutlined /> Convert
			<br />
			<span className={'menu-sub-text'}>The Easiest way to Trade </span>
		</Menu.Item>
		<Menu.Item>
			<CaretRightOutlined /> Classic
			<br />
			<span className={'menu-sub-text'}>Simple and Easy to use interface </span>
		</Menu.Item>
		<Menu.Item>
			<CaretRightOutlined /> Advance
			<br />
			<span className={'menu-sub-text'}>Full access to all Trading</span>
		</Menu.Item>
	</Menu>
);

const derivativesMenu = (
	<Menu theme="dark">
		<Menu.Item>
			<CaretRightOutlined /> USD - M Futures
			<br />
			<span className={'menu-sub-text'}>The Easiest way to Trade </span>
		</Menu.Item>
		<Menu.Item>
			<CaretRightOutlined /> Classic
			<br />
			<span className={'menu-sub-text'}>Simple and Easy to use interface </span>
		</Menu.Item>
		<Menu.Item>
			<CaretRightOutlined /> Advance
			<br />
			<span className={'menu-sub-text'}>Full access to all Trading</span>
		</Menu.Item>
	</Menu>
);

export const MenuHollaEx = ({ size }) => {
	return (
		<>
			<Space size={size}>
				<a href={'/'} className={'rb-menu gold'}>
					<strong>HollaEx</strong>
				</a>
				<Dropdown overlay={OtherLinks}>
					<a
						className="ant-dropdown-link rb-menu"
						onClick={(e) => e.preventDefault()}
					>
						<WindowsOutlined style={{ fontSize: '20px' }} />
					</a>
				</Dropdown>
				<Dropdown overlay={BuyCryptoMenu}>
					<a
						className="ant-dropdown-link rb-menu"
						onClick={(e) => e.preventDefault()}
					>
						Buy Crypto <CaretDownOutlined />
					</a>
				</Dropdown>

				<a className="rb-menu" onClick={(e) => e.preventDefault()}>
					Market
				</a>

				<Dropdown overlay={TradeMenu}>
					<a
						className="ant-dropdown-link rb-menu"
						onClick={(e) => e.preventDefault()}
					>
						Trade <CaretDownOutlined />
					</a>
				</Dropdown>

				<Dropdown overlay={derivativesMenu}>
					<a
						className="ant-dropdown-link rb-menu"
						onClick={(e) => e.preventDefault()}
					>
						Derivatives <CaretDownOutlined />
					</a>
				</Dropdown>
				<Dropdown overlay={derivativesMenu}>
					<a
						className="ant-dropdown-link rb-menu"
						onClick={(e) => e.preventDefault()}
					>
						Finance <CaretDownOutlined />
					</a>
				</Dropdown>
			</Space>
		</>
	);
};
