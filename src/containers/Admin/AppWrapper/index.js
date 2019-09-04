import React from 'react';
import { Link } from 'react-router';

import { Layout, Menu, Icon, Row, Col } from 'antd';
import { PATHS } from '../paths';
import {
	removeToken,
	isSupport,
	isSupervisor,
	isAdmin,
	isKYC
} from '../../../utils';
import './index.css';

import MobileDetect from 'mobile-detect';
import MobileSider from './mobileSider';

const md = new MobileDetect(window.navigator.userAgent);

const { Content, Sider } = Layout;

const renderMenuItem = ({ path, label, ...rest }, index) => (
	<Menu.Item key={index}>
		<Link to={path} className="no-link">
			{label}
		</Link>
	</Menu.Item>
);

const AppWrapper = ({ children, history }) => {
	const logout = () => {
		removeToken();
		history.replace('/login');
	};
	const isSupportUser = isSupport();
	const isSupervisorUser = isSupervisor();
	const isAdminUser = isAdmin();

	if (md.phone()) {
		return (
			<Layout>
				<Row>
					<Col span={8}>
						<MobileSider menuItem={renderMenuItem} logout={logout} />
					</Col>

					{/*<Sider style={{width: 100}}>*/}
					{/*<Menu theme="dark" mode="vertical" style={{ lineHeight: '64px' }} className="m-top">*/}
					{/*{PATHS.filter(*/}
					{/*({ hideIfSupport }) => !isSupportUser || !hideIfSupport*/}
					{/*).map(renderMenuItem)}*/}
					{/*<Menu.Item key="logout">*/}
					{/*<div onClick={logout}>*/}
					{/*<Icon type="logout" />LOGOUT*/}
					{/*</div>*/}
					{/*</Menu.Item>*/}
					{/*</Menu>*/}
					{/*</Sider>*/}

					<Col span={16}>
						<Layout>
							<Content style={{ marginLeft: 50, marginTop: 0 }}>
								<div className="content-wrapper">{children}</div>
							</Content>
						</Layout>
					</Col>
				</Row>
			</Layout>
		);
	} else {
		return (
			<Layout>
				<Sider>
					<Menu
						theme="dark"
						mode="vertical"
						style={{ lineHeight: '64px' }}
						className="m-top"
					>
						{PATHS.filter(
							({ hideIfSupport, hideIfSupervisor, hideIfKYC }) =>
								isAdminUser ||
								(isSupportUser && !hideIfSupport) ||
								(isSupervisorUser && !hideIfSupervisor) ||
								(isKYC() && !hideIfKYC)
						).map(renderMenuItem)}
						<Menu.Item>
							<Link to="/">
								<Icon type="home" />
								Go To HEX-WEB
							</Link>
						</Menu.Item>
						<Menu.Item key="logout">
							<div onClick={logout}>
								<Icon type="logout" />
								LOGOUT
							</div>
						</Menu.Item>
					</Menu>
				</Sider>
				<Layout>
					<Content>
						<div className="content-wrapper">{children}</div>
					</Content>
				</Layout>
			</Layout>
		);
	}
};

export default AppWrapper;
