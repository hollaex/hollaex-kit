import React, { Component } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { LogoutOutlined } from '@ant-design/icons';
import { Menu, Button } from 'antd';
import { PATHS } from '../index';

import { Layout } from 'antd/lib/index';

const { Sider } = Layout;

class MobileSider extends Component {
	state = {
		collapsed: false,
	};

	toggleCollapsed = () => {
		this.setState({
			collapsed: !this.state.collapsed,
		});
	};

	render() {
		return (
			<Sider style={{ width: 256 }}>
				<Button
					type="primary"
					onClick={this.toggleCollapsed}
					style={{ marginBottom: 16 }}
				>
					<LegacyIcon
						type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
					/>
				</Button>
				<Menu
					defaultSelectedKeys={['1']}
					mode="inline"
					theme="dark"
					inlineCollapsed={this.state.collapsed}
					style={{ lineHeight: '64px' }}
					className="m-top"
				>
					{PATHS.map(this.props.menuItem)}
					<Menu.Item key="logout">
						<div onClick={this.props.logout}>
							<LogoutOutlined />
							LOGOUT
						</div>
					</Menu.Item>
				</Menu>
			</Sider>
		);
	}
}

export default MobileSider;
