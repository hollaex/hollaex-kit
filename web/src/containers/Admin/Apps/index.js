import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { STATIC_ICONS } from 'config/icons';
import { Table, Breadcrumb, Button } from 'antd';
import { appsSelector } from './utils';
import { SmartTarget } from 'components';
import { generateDynamicTarget } from 'utils/id';

import './index.css';

const { Item } = Breadcrumb;

const generateHeaders = (configure, viewApp) => {
	return [
		{
			title: 'App name',
			key: 'name',
			dataIndex: 'name',
		},
		{
			title: 'Description',
			key: 'description',
			dataIndex: 'description',
		},
		{
			title: 'Config',
			key: '',
			dataIndex: '',
			render: (_, { name }, key) => (
				<td key={`${key}-${name}-configure`}>
					<span
						className="underline-text pointer no-wrap"
						onClick={() => configure(name)}
					>
						Config
					</span>
				</td>
			),
		},
		{
			title: 'App details',
			key: '',
			dataIndex: '',
			render: (_, { name }, key) => (
				<td key={`${key}-${name}-view`}>
					<span
						className="underline-text pointer no-wrap"
						onClick={() => viewApp(name)}
					>
						View App
					</span>
				</td>
			),
		},
	];
};

const Index = ({ router, apps }) => {
	const [app, setApp] = useState();
	const [id, setId] = useState();

	const back = () => setApp();
	const configure = (app) => router.push(`/admin/plugins?plugin=${app}`);
	const goToPlugins = () => router.push('/admin/plugins');

	useEffect(() => {
		setId(generateDynamicTarget(app, 'app', 'admin'));
	}, [app]);

	return (
		<div className="app_container-content admin-user-container admin-user-content apps-list-container">
			{app ? (
				<Fragment>
					<Breadcrumb>
						<Item>
							<span onClick={back}>Apps</span>
						</Item>
						<Item>{app}</Item>
					</Breadcrumb>
					<SmartTarget id={id} onBack={back} />
				</Fragment>
			) : (
				<Fragment>
					<div className="d-flex align-items-center">
						<div>
							<ReactSVG
								src={STATIC_ICONS.APPS_FEATURE_ICON}
								className="apps-icon"
							/>
						</div>
						<div className="apps-text">
							<div className="apps-title">Active apps</div>
							<div>
								<span>
									Below is a list of exchange applications that were activated
									from the{' '}
								</span>
								<span className="anchor" onClick={goToPlugins}>
									plugins page.
								</span>
								<span>
									{' '}
									These apps are active and visible to your users and provide
									extra functionality.
								</span>
							</div>
						</div>
					</div>

					<div className="pt-3 pb-5 text-align-right">
						<Button type="primary" className="green-btn" onClick={goToPlugins}>
							Add plugin app
						</Button>
					</div>

					<Table
						className="blue-admin-table"
						dataSource={apps}
						columns={generateHeaders(configure, setApp)}
						pagination={false}
					/>
				</Fragment>
			)}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		apps: appsSelector(state),
	};
};

export default connect(mapStateToProps)(Index);
