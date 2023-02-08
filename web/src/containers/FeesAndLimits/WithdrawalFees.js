import React from 'react';
import { connect } from 'react-redux';
import { Select } from 'antd';
import classnames from 'classnames';
import { isMobile } from 'react-device-detect';
import { Image, IconTitle, EditWrapper } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';
import STRINGS from 'config/localizedStrings';
import DepositAndWithdrawalFees from './DepositAndWithdrawalFees';

const WithdrawalFees = ({
	config_level,
	coins,
	pairs,
	selectedLevel,
	setSelectedLevel,
	options,
	icons: ICONS,
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
						<div className="w-100 pl-3">
							<IconTitle
								stringId="FEES_AND_LIMITS.TABS.WITHDRAWAL_FEES.TABLE.TITLE"
								text={
									STRINGS['FEES_AND_LIMITS.TABS.WITHDRAWAL_FEES.TABLE.TITLE']
								}
								textType="title bold"
								iconPath={ICONS['FEES_AND_LIMITS_WITHDRAWAL_FEES']}
							/>
							<div className="py-4">
								<div>
									<EditWrapper stringId="FEES_AND_LIMITS.TABS.WITHDRAWAL_FEES.TABLE.SUBTITLE">
										{
											STRINGS[
												'FEES_AND_LIMITS.TABS.WITHDRAWAL_FEES.TABLE.SUBTITLE'
											]
										}
									</EditWrapper>
								</div>
							</div>
							<DepositAndWithdrawalFees coins={coins} level={selectedLevel} />
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
		pairs: state.app.pairs,
		config_level: state.app.config_level,
		options: Object.entries(state.app.config_level).map(([key, { name }]) => ({
			value: key,
			label: name,
		})),
	};
};

export default connect(mapStateToProps)(withConfig(WithdrawalFees));
