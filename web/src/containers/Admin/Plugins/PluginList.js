import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Input } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { STATIC_ICONS } from 'config/icons';
import _debounce from 'lodash/debounce';

const PluginList = ({
	removePluginName,
	handleOpenPlugin,
	pluginData,
	getPlugins,
}) => {
	const [isSearchTerm, setIsSearchTerm] = useState(false);
	useEffect(() => {
		return () => {
			searchPlugin({});
		};
		// eslint-disable-next-line
	}, []);

	const searchPlugin = _debounce(getPlugins, 800);
	const handleSearch = (e) => {
		let params = {};
		if (e.target.value) {
			params.search = e.target.value;
			setIsSearchTerm(true);
		}
		setIsSearchTerm(!!e.target.value);
		searchPlugin(params);
	};
	const renderList = () => {
		return pluginData.map((item, index) => {
			return (
				<div
					key={index}
					className={
						item.name === removePluginName
							? 'plugin-list-item removing-item d-flex align-items-center mt-3'
							: 'plugin-list-item d-flex align-items-center mt-3'
					}
					onClick={() => handleOpenPlugin(item)}
				>
					<div className="d-flex justify-content-center">
						<div>
							<img
								src={
									item.icon ? item.icon : STATIC_ICONS.DEFAULT_PLUGIN_THUMBNAIL
								}
								alt={`plugin-${index}`}
								className="plugin-list-icon"
							/>
						</div>
						<div className="description-content">
							<div className="plugin-list-title">{item.name}</div>
							<div className="plugin-list-bio">{item.bio}</div>
							{item.enabled ? (
								<div className="plugin-list-type">
									<CheckOutlined /> <p>Currently installed</p>
								</div>
							) : (
								<div className="plugin-list-font">
									{item.payment_type === 'free' || item.price === 0
										? 'Free'
										: `$ ${item.price}`}
								</div>
							)}
						</div>
					</div>
				</div>
			);
		});
	};

	return (
		<div className="plugin-app-stroe-wrapper">
			<div className="w-100 mt-4">
				<div className="d-flex justify-content-between">
					<div className="d-flex">
						<div>
							<img
								src={STATIC_ICONS.HOLLAEX_EXCHANGE_STORE_PLUGIN_APPS}
								alt="Plugin"
								className="plugin-icon"
							/>
						</div>
						<div className="pl-4">
							<div className="sub-title-font">EXCHANGE STORE</div>
							<div className="plugin-title">Explore powerful plugin apps</div>
							<div className="sub-title-font">
								Efficiently boost your exchange's functionality and user
								experience.
							</div>
						</div>
					</div>
					<div>
						<Link href="https://docs.hollaex.com/plugins/develop-plugins" target="blank">
							<span className="pr-2 link-text">PLUGIN DEVELOPMENT DOC</span>
							<img
								src={STATIC_ICONS.OPEN_HOLLAEX_DOC_APP_CREATION}
								alt="open-hollaex-doc-app-creation-link"
								className="pb-3"
							/>
						</Link>
					</div>
				</div>
			</div>
			<div className="p-4">
				<div>Top exchange plugin apps</div>
				<div className="d-flex search-plugin-input align-items-baseline mt-3">
					Search:{' '}
					<Input placeholder="Search..." onChange={(e) => handleSearch(e)} />
				</div>
				<div>
					{pluginData.length ? (
						<div className="plugin-list-wrapper">{renderList()}</div>
					) : (
						<div className="installed-plugin">
							{isSearchTerm ? (
								<>Can't find any plugin apps by that search term.</>
							) : (
								<>No plugin apps found</>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default PluginList;
