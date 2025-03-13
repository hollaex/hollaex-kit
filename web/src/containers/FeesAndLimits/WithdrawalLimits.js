import React from 'react';
import { connect } from 'react-redux';
import { Select, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { isMobile } from 'react-device-detect';
import { Image, IconTitle, EditWrapper } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';
import STRINGS from 'config/localizedStrings';
import LimitsBlock from './LimitsBlock';

const WithdrawalLimits = ({
	config_level,
	pairs,
	coins,
	transaction_limits,
	selectedLevel,
	setSelectedLevel,
	options,
	icons: ICONS,
	search,
	setSearch,
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
						</div>
						<div>
							<div>
								<IconTitle
									stringId="FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_2.TITLE"
									text={
										STRINGS[
											'FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_2.TITLE'
										]
									}
									textType="title bold text-align-left"
									iconPath={ICONS['FEES_AND_LIMITS_WITHDRAWAL_LIMITS']}
									className="fees-limits-title"
								/>
								<div className="d-flex justify-content-between">
									<div className="py-4">
										<div>
											<EditWrapper stringId="FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_2.SUBTITLE">
												{
													STRINGS[
														'FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_2.SUBTITLE'
													]
												}
											</EditWrapper>
										</div>
									</div>
									<div>
										<Input
											allowClear
											prefix={<SearchOutlined className="secondary-text" />}
											placeholder={
												STRINGS['FEES_AND_LIMITS.SEARCH_PLACEHOLDER']
											}
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
								<div className="wallet-assets_block">
									<LimitsBlock
										coins={coins}
										level={selectedLevel}
										title={''}
										tiers={config_level}
										transaction_limits={transaction_limits}
										type={'individual'}
										search={search}
									/>
								</div>
							</div>
							<div>
								<IconTitle
									stringId="FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_3.TITLE"
									text={
										STRINGS[
											'FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_3.TITLE'
										]
									}
									textType="title bold text-align-left"
									iconPath={ICONS['FEES_AND_LIMITS_WITHDRAWAL_LIMITS']}
									className="fees-limits-title"
								/>
								<div className="py-4">
									<div>
										<EditWrapper stringId="FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_3.SUBTITLE">
											{
												STRINGS[
													'FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_3.SUBTITLE'
												]
											}
										</EditWrapper>
									</div>
								</div>
								<div className="wallet-assets_block">
									<LimitsBlock
										coins={coins}
										level={selectedLevel}
										title={''}
										tiers={config_level}
										transaction_limits={transaction_limits}
										type={'default'}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		coins: state.app.coins,
		transaction_limits: state.app.transaction_limits,
		pairs: state.app.pairs,
		config_level: state.app.config_level,
		options: Object.entries(state.app.config_level).map(([key, { name }]) => ({
			value: key,
			label: name,
		})),
	};
};

export default connect(mapStateToProps)(withConfig(WithdrawalLimits));
