import React from 'react';
import { connect } from 'react-redux';
import { Select } from 'antd';
import { Image, IconTitle, EditWrapper } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';
import STRINGS from 'config/localizedStrings';
import LimitsBlock from './LimitsBlock';
import UnderConstruction from 'components/Wallet/UnderConstruction';

const WithdrawalLimits = ({
	config_level,
	pairs,
	coins,
	selectedLevel,
	setSelectedLevel,
	options,
	icons: ICONS,
	uc = true,
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
					{uc ? (
						<UnderConstruction />
					) : (
						<div className="d-flex justify-content-between pt-3">
							<div>
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
												defaultValue={selectedLevel}
												value={selectedLevel}
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
								<IconTitle
									stringId="FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_1.TITLE"
									text={
										STRINGS[
											'FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_1.TITLE'
										]
									}
									textType="title bold"
									iconPath={ICONS['FEES_AND_LIMITS_WITHDRAWAL_LIMITS']}
								/>
								<div className="py-4">
									<div>
										<EditWrapper stringId="FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_1.SUBTITLE">
											{
												STRINGS[
													'FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_1.SUBTITLE'
												]
											}
										</EditWrapper>
									</div>
								</div>
								<div className="wallet-assets_block"></div>
							</div>
							<div>
								<IconTitle
									stringId="FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_2.TITLE"
									text={
										STRINGS[
											'FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TABLE_2.TITLE'
										]
									}
									textType="title bold"
									iconPath={ICONS['FEES_AND_LIMITS_WITHDRAWAL_LIMITS']}
								/>
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
								<div className="wallet-assets_block">
									<LimitsBlock
										coins={coins}
										level={selectedLevel}
										title={''}
										tiers={config_level}
									/>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		coins: state.app.coins,
		pairs: state.app.pairs,
		config_level: state.app.config_level,
		options: Object.entries(state.app.config_level).map(([key, { name }]) => ({
			value: key,
			label: name,
		})),
	};
};

export default connect(mapStateToProps)(withConfig(WithdrawalLimits));
