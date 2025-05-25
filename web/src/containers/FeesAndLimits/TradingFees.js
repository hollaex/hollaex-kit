import React from 'react';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { browserHistory } from 'react-router';
import { Select, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { isMobile } from 'react-device-detect';
import { Image, IconTitle, EditWrapper } from 'components';
import { quicktradePairSelector } from 'containers/QuickTrade/components/utils';
import withConfig from 'components/ConfigProvider/withConfig';
import STRINGS from 'config/localizedStrings';
import FeesBlock from './FeesBlock';

const TradingFees = ({
	coins,
	config_level,
	pairs,
	selectedLevel,
	setSelectedLevel,
	options,
	icons: ICONS,
	search,
	setSearch,
	user,
	quicktradePairs,
	scrollToTop,
}) => {
	const accountData = config_level[selectedLevel] || {};
	const description =
		accountData.description ||
		(STRINGS[`SUMMARY.LEVEL_${selectedLevel}_TXT`]
			? STRINGS[`SUMMARY.LEVEL_${selectedLevel}_TXT`]
			: STRINGS['SUMMARY.LEVEL_TXT_DEFAULT']);

	const icon = ICONS[`LEVEL_ACCOUNT_ICON_${selectedLevel}`]
		? ICONS[`LEVEL_ACCOUNT_ICON_${selectedLevel}`]
		: ICONS['LEVEL_ACCOUNT_ICON_4'];

	return (
		<div>
			<div className="settings-form-wrapper">
				<div className="settings-form apps-form wallet-container">
					<div
						className={classnames('d-flex', 'justify-content-between', 'pt-3', {
							'flex-direction-column': isMobile,
						})}
					>
						<div className={classnames({ 'mb-4': isMobile })}>
							<div className="d-flex mr-4">
								<div>
									<Image
										iconId={
											ICONS[`LEVEL_ACCOUNT_ICON_${selectedLevel}`]
												? `LEVEL_ACCOUNT_ICON_${selectedLevel}`
												: 'LEVEL_ACCOUNT_ICON_4'
										}
										icon={icon}
										wrapperClassName="trader-wrapper-icon"
									/>
								</div>
								<div>
									<div>
										<Select
											defaultValue={selectedLevel?.toString()}
											value={selectedLevel?.toString()}
											style={{ width: '20rem' }}
											className="coin-select custom-select-input-style elevated"
											dropdownClassName="custom-select-style"
											onChange={setSelectedLevel}
											options={options}
										/>
									</div>
									<div className="secondary-text pt-2 px-1">
										<EditWrapper
											stringId="SUMMARY.LEVEL_TXT_DEFAULT"
											renderWrapper={(children) => (
												<div className="mb-2">{children}</div>
											)}
										>
											{description}
										</EditWrapper>
									</div>
								</div>
							</div>
							{user.discount > 0 && (
								<>
									<div className="d-flex">
										<div>
											<ReactSVG
												src={ICONS['GREEN_CHECK']}
												className="currency_ball-wrapper s mr-2"
											/>
										</div>
										<div>
											{STRINGS['FEE_REDUCTION']}: {user.discount}%
										</div>
									</div>
									<div
										className="blue-link pointer text-uppercase mt-2"
										onClick={() => browserHistory.push('/referral')}
									>
										<EditWrapper stringId="REFERRAL_LINK.GO_TO_REFERRAL">
											{STRINGS['REFERRAL_LINK.GO_TO_REFERRAL']}
										</EditWrapper>
									</div>
								</>
							)}
						</div>
						<div className="w-100 pl-3">
							<div
								className={classnames('d-flex', 'justify-content-between', {
									'align-center': !isMobile,
									'flex-direction-column align-items-start': isMobile,
								})}
							>
								<div>
									<IconTitle
										stringId="FEES_AND_LIMITS.TABS.TRADING_FEES.TABLE.TITLE"
										text={
											STRINGS['FEES_AND_LIMITS.TABS.TRADING_FEES.TABLE.TITLE']
										}
										textType="title bold text-align-left"
										iconPath={ICONS['FEES_OPTION_ICON']}
										className="fees-limits-title market-trading-fees-title"
										iconId="FEES_OPTION_ICON"
									/>
									<div className="py-4">
										<div>
											<EditWrapper stringId="FEES_AND_LIMITS.TABS.TRADING_FEES.TABLE.SUBTITLE">
												{
													STRINGS[
														'FEES_AND_LIMITS.TABS.TRADING_FEES.TABLE.SUBTITLE'
													]
												}
											</EditWrapper>
										</div>
									</div>
								</div>
								<div>
									<Input
										allowClear
										prefix={<SearchOutlined className="secondary-text" />}
										placeholder={STRINGS['FEES_AND_LIMITS.SEARCH_PLACEHOLDER']}
										value={search}
										onChange={({ target: { value } }) => setSearch(value)}
										style={{
											width: 200,
										}}
										bordered={false}
										className="kit-divider"
									/>
								</div>
							</div>
							<FeesBlock
								coins={coins}
								level={selectedLevel}
								pairs={pairs}
								discount={0}
								tiers={config_level}
								search={search}
								quicktradePairs={quicktradePairs}
								scrollToTop={scrollToTop}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	const setQuickTradePairs = (inputArray) => {
		const transformedData = {};

		inputArray.forEach((item, index) => {
			const [pair_base, pair_2] = item.symbol.split('-');
			transformedData[item.symbol] = {
				id: index,
				name: item.symbol,
				pair_base: pair_base,
				pair_2: pair_2,
				active: item.active,
				code: item.symbol,
				pair_base_display: pair_base.toUpperCase(),
				pair_2_display: pair_2.toUpperCase(),
				display_name: item.display_name,
				icon_id: item.icon_id,
			};
		});

		return transformedData;
	};
	return {
		coins: state.app.coins,
		pairs: setQuickTradePairs(state.app.quicktrade),
		quicktradePairs: quicktradePairSelector(state),
		config_level: state.app.config_level,
		options: Object.entries(state.app.config_level).map(([key, { name }]) => ({
			value: key,
			label: name,
		})),
		user: state.user || {},
	};
};

export default connect(mapStateToProps)(withConfig(TradingFees));
