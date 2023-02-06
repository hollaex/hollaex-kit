// import React, { Component } from 'react';
// import { Input, Spin } from 'antd';
// import _debounce from 'lodash/debounce';
// import { connect } from 'react-redux';
// import { CheckCircleFilled, StarFilled } from '@ant-design/icons';
// import { STATIC_ICONS } from 'config/icons';

// // import './index.css';

// class PluginList extends Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			mobileToggle: false,
// 			isLoading: false,
// 			is_active: false,
// 		};
// 	}

// 	searchPlugin = _debounce(this.props.getPlugins, 800);

// 	handleSearch = (e) => {
// 		this.searchPlugin({ search: e.target.value });
// 	};

// 	handleActivate = (e) => {
// 		e.preventDefault();
// 		e.stopPropagation();
// 		const url = 'https://dash.bitholla.com/plugin';
// 		const link = document.createElement('a');
// 		link.setAttribute('target', '_blank');
// 		link.href = url;
// 		document.body.appendChild(link);
// 		link.click();
// 	};

// 	renderList = () => {
// 		const { pluginData, handleOpenPlugin } = this.props;
// 		if (this.state.isLoading) {
// 			return (
// 				<div className="loading-container d-flex align-items-center justify-content-center">
// 					<Spin />
// 				</div>
// 			);
// 		}
// 		return pluginData.map((item, index) => {
// 			return (
// 				<div
// 					key={index}
// 					className="plugin-list-item d-flex align-items-center justify-content-between"
// 					onClick={() => handleOpenPlugin(item)}
// 				>
// 					<div className="d-flex align-items-center">
// 						<div>
// 							<img
// 								src={
// 									item.icon ? item.icon : STATIC_ICONS.DEFAULT_PLUGIN_THUMBNAIL
// 								}
// 								alt={`plugin-${index}`}
// 								className="plugin-list-icon"
// 							/>
// 						</div>
// 						<div>
// 							<div className="d-flex">
// 								<div className="plugin-list-title">{item.name}</div>
// 								{item.version ? (
// 									<div className="plugin-list-author plugin-author-align">
// 										v{item.version}
// 									</div>
// 								) : null}
// 							</div>
// 							<div className="plugin-list-author">{`By ${item.author}`}</div>
// 							<div className="plugin-list-bio">{item.bio}</div>
// 						</div>
// 					</div>
// 					{item.premium && !item.enabled ? (
// 						<div>
// 							<div className="add-btn" onClick={this.handleActivate}>
// 								Activate
// 							</div>
// 							<div className="premium-plugin">
// 								<StarFilled /> Premium Plugin
// 							</div>
// 						</div>
// 					) : item.enabled ? (
// 						<div className="install-icon-content">
// 							<CheckCircleFilled className="check-icon-verified" />
// 						</div>
// 					) : (
// 						<div className="add-btn">Add</div>
// 					)}
// 				</div>
// 			);
// 		});
// 	};

// 	render() {
// 		return (
// 			<div className="plugin-list-container">
// 				<div className="d-flex align-items-center">
// 					<div>
// 						<img
// 							src={STATIC_ICONS.PLUGIN_IMAGE}
// 							alt="Plugin"
// 							className="plugin-icon"
// 						/>
// 					</div>
// 					<div>
// 						<div className="small-font">TEAM PICKS</div>
// 						<div className="plugin-title">Explore hand-picked plugins</div>
// 						<div>
// 							Run your exchange super smooth with exchange plugins. Applications
// 							that save big on development time.
// 						</div>
// 					</div>
// 				</div>
// 				<div className="ml-4">
// 					<div className="card-container d-flex align-items-center justify-content-between">
// 						{this.props.pluginCards.map((card, index) => {
// 							return (
// 								<div
// 									key={index}
// 									className="plugin-card"
// 									style={{ backgroundImage: `url(${card.logo})` }}
// 									onClick={() => this.props.handleOpenPlugin(card)}
// 								/>
// 							);
// 						})}
// 					</div>
// 					<div>
// 						<div className="plugin-header d-flex align-items-center justify-content-between">
// 							<div className="plugin-title">Explore</div>
// 							<div className="search-plugin-input">
// 								<Input placeholder="Search..." onChange={this.handleSearch} />
// 							</div>
// 						</div>
// 						<div className="plugin-list">{this.renderList()}</div>
// 					</div>
// 				</div>
// 			</div>
// 		);
// 	}
// }

// const mapStateToProps = (state) => ({
// 	exchange: state.exchange && state.exchange.length ? state.exchange[0] : {},
// });

// export default connect(mapStateToProps)(PluginList);

import React from 'react';
import { Link } from 'react-router';
import { Input } from 'antd';
import { STATIC_ICONS } from 'config/icons';

const PluginList = ({
	onChangeNextType,
	handleSearch = () => {},
	myPlugins,
	removePluginName,
	handleOpenPlugin,
	pluginData,
}) => {
	const renderList = () => {
		return myPlugins.map((item, index) => {
			// const networkPlugin =
			//     pluginData.filter((data) => data.name === item.name)[0] || {};
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
							<div className="d-flex">
								<div className="plugin-list-title">{item.name}</div>
								{item.version ? (
									<div className="plugin-list-author plugin-author-align">
										v{item.version}
									</div>
								) : null}
							</div>
							<div className="plugin-list-author">{`By ${item.author}`}</div>
							<div className="plugin-list-bio">{item.bio}</div>
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
							<div className="small-font">EXCHANGE STORE</div>
							<div className="plugin-title">Explore powerful plugin apps</div>
							<div>
								Efficiently boost your exchange's functionality and user
								experience.
							</div>
						</div>
					</div>
					<div>
						APP CREATION DOC
						<Link
							href=" https://docs.hollaex.com"
							target="blank"
							className="pl-2"
						>
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
					Search: <Input placeholder="Search..." onChange={handleSearch} />
				</div>
				<div>
					<div className="plugin-list-wrapper">{renderList()}</div>
				</div>
			</div>
		</div>
	);
};

export default PluginList;
