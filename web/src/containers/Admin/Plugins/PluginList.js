import React, { Component } from 'react';
import { Input, Spin } from 'antd';
import _debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import { CheckCircleFilled } from '@ant-design/icons';
import { STATIC_ICONS } from 'config/icons';

import './index.css';

class PluginList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mobileToggle: false,
			isLoading: false,
			page: 1,
			limit: 50,
		};
	}

	searchPlugin = _debounce(this.props.getPlugins, 800);

	handleSearch = (e) => {
		this.searchPlugin(1, 50, { search: e.target.value });
	};

	renderList = () => {
		const { pluginData, handleOpenPlugin } = this.props;
		if (this.state.isLoading) {
			return (
				<div className="loading-container d-flex align-items-center justify-content-center">
					<Spin />
				</div>
			);
		}
		return pluginData.map((item, index) => {
			return (
				<div
					key={index}
					className="plugin-list-item d-flex align-items-center justify-content-between"
					onClick={() => handleOpenPlugin(item)}
				>
					<div className="d-flex align-items-center">
						<div>
							<img
								src={
									item.icon ? item.icon : STATIC_ICONS.DEFAULT_PLUGIN_THUMBNAIL
								}
								alt={`plugin-${index}`}
								className="plugin-list-icon"
							/>
						</div>
						<div>
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
					{item.enabled ? (
						<div className="install-icon-content">
							<CheckCircleFilled className="check-icon-verified" />
						</div>
					) : (
						<div className="add-btn">Add</div>
					)}
				</div>
			);
		});
	};

	render() {
		return (
			<div className="plugin-list-container">
				<div className="d-flex align-items-center">
					<div>
						<img
							src={STATIC_ICONS.PLUGIN_IMAGE}
							alt="Plugin"
							className="plugin-icon"
						/>
					</div>
					<div>
						<div className="small-font">TEAM PICKS</div>
						<div className="plugin-title">Explore hand-picked plugins</div>
						<div>
							Run your exchange super smooth with exchange plugins. Applications
							that save big on development time.
						</div>
					</div>
				</div>
				<div className="ml-4">
					<div className="card-container d-flex align-items-center justify-content-between">
						{this.props.pluginCards.map((card, index) => {
							return (
								<div
									key={index}
									className="plugin-card"
									style={{ backgroundImage: `url(${card.logo})` }}
									onClick={() => this.props.handleOpenPlugin(card)}
								/>
							);
						})}
					</div>
					<div>
						<div className="plugin-header d-flex align-items-center justify-content-between">
							<div className="plugin-title">Explore</div>
							<div className="search-plugin-input">
								<Input placeholder="Search..." onChange={this.handleSearch} />
							</div>
						</div>
						<div className="plugin-list">{this.renderList()}</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	exchange: state.exchange && state.exchange.length ? state.exchange[0] : {},
});

export default connect(mapStateToProps)(PluginList);
