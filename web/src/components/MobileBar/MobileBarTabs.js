import React, { Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { MobileBarWrapper } from '.';
import { CaretDownOutlined } from '@ant-design/icons';
import Image from 'components/Image';
import { openMarketSelector } from 'actions/appActions';

const renderMobileTab = ({
	title,
	key,
	className = '',
	active = false,
	notifications = '',
	onClick,
}) => {
	return (
		<div
			key={key}
			className={classnames(
				'mobile-bar-tab f-1 d-flex justify-content-center align-items-center',
				className,
				{ active }
			)}
			onClick={onClick}
		>
			<div className="bartab-text-wrapper">
				{title}
				{notifications && (
					<div className="bartab-notification">{notifications}</div>
				)}
			</div>
		</div>
	);
};

const MobileBarTabs = ({
	showMarketSelector,
	tabs,
	activeTab,
	setActiveTab,
	renderTab = renderMobileTab,
	pair,
	icons: ICONS,
	openMarketSelector,
	pairs,
}) => {
	const { icon_id, display_name } = pairs[pair] || {};

	return (
		<Fragment>
			<MobileBarWrapper className="d-flex justify-content-between">
				{tabs.map((tab, index) => {
					const tabProps = {
						key: `tab_item-${index}`,
						active: index === activeTab,
						...tab,
					};
					if (setActiveTab) {
						tabProps.onClick = () => setActiveTab(index);
					}
					return renderTab(tabProps);
				})}
			</MobileBarWrapper>
			{showMarketSelector && (
				<div
					className={classnames(
						'app_bar-pair-content',
						'd-flex',
						'px-2',
						'justify-content-between',
						'mobile-market-selector-trigger'
					)}
				>
					<div
						className="d-flex align-items-center ml-2"
						onClick={openMarketSelector}
					>
						{display_name && (
							<Image
								icon={ICONS[icon_id]}
								wrapperClassName="mobile-tab_market-indicator pt-3"
							/>
						)}
						<span className="pt-2 trade-tab__market-selector pr-2">
							{display_name}
						</span>
						<CaretDownOutlined style={{ fontSize: '14px' }} />
					</div>
				</div>
			)}
		</Fragment>
	);
};

MobileBarWrapper.defaultProps = {
	tabs: [],
};

const mapStateToProps = (state) => ({
	pairs: state.app.pairs,
});

const mapDispatchToProps = (dispatch) => ({
	openMarketSelector: bindActionCreators(openMarketSelector, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MobileBarTabs);
