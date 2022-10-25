import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
	Image,
	NoVerifiedAccount,
	Button,
	EditWrapper,
	Tab,
	SmartTarget,
	UnderConstruction,
} from 'components';
import { generateDynamicTarget } from 'utils/id';
import { ExclamationCircleFilled } from '@ant-design/icons';
import withConfig from 'components/ConfigProvider/withConfig';
import STRINGS from 'config/localizedStrings';

import { generateInitialValues } from './DepositForm';
import math from 'mathjs';
import classnames from 'classnames';
import { DEFAULT_COIN_DATA } from 'config/constants';
import DepositForm from './DepositForm';
import {
	getFiatDepositFee,
	getFiatDepositLimit,
} from 'containers/Deposit/Fiat/utils';
import { generateDynamicStringKey, generateDynamicIconKey } from 'utils/id';

export const STEPS = {
	HOME: 'HOME',
	TRANSACTION_ID: 'TRANSACTION_ID',
};

const Form = ({
	icons: ICONS,
	titleSection,
	currency,
	user: {
		bank_account: all_accounts = [],
		verification_level,
		id_data = {},
	} = {},
	router,
	coins,
	onramp = {},
}) => {
	const [activeTab, setActiveTab] = useState();
	const [tabs, setTabs] = useState({});
	const [activeStep, setActiveStep] = useState(STEPS.HOME);
	const [initialValues, setInitialValues] = useState({});

	useEffect(() => {
		setTabs(getTabs());
		setInitialValues(
			generateInitialValues(verification_level, coins, currency)
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getTabs = () => {
		const tabs = {};
		Object.entries(onramp).forEach(([key, { type }]) => {
			const iconId = generateDynamicIconKey(
				'ultimate_fiat',
				key,
				'tab'
			)('title');
			const stringId = generateDynamicStringKey(
				'ultimate_fiat',
				key,
				'tab'
			)('title');
			const defaultText = key.replace(/_/g, ' ');

			tabs[key] = {
				icon: ICONS[iconId] || ICONS['VERIFICATION_BANK_NEW'],
				iconId,
				stringId,
				title: STRINGS[stringId] || defaultText,
				type,
			};
		});

		return tabs;
	};

	const is_verified = id_data.status === 3;

	const renderSmartTarget = (name) => {
		const id = generateDynamicTarget(name, 'ultimate_fiat', 'onramp');
		return (
			<SmartTarget id={id} currency={currency}>
				<UnderConstruction />
			</SmartTarget>
		);
	};

	const renderBankSteps = () => {
		switch (activeStep) {
			case STEPS.HOME:
				return renderBankHomeContent();
			case STEPS.TRANSACTION_ID:
				return renderBankTransactionId();
			default:
				return 'No Step';
		}
	};

	const renderContent = () => {
		const { type } = tabs[activeTab] || {};
		const { data } = onramp[activeTab] || {};
		switch (type) {
			case 'manual': {
				return (
					<Fragment>
						{renderBankSteps()}
						<div className="mt-4 pt-4">
							<DepositForm
								method={activeTab}
								currency={currency}
								step={activeStep}
								setStep={setActiveStep}
								initialValues={initialValues}
							/>
						</div>
					</Fragment>
				);
			}
			case 'plugin': {
				return (
					<Fragment>
						{renderBankSteps()}
						{renderSmartTarget(data)}
					</Fragment>
				);
			}
			default: {
				return <Fragment>{renderBankSteps()}</Fragment>;
			}
		}
	};

	const renderBankHomeContent = () => {
		const { type } = tabs[activeTab] || {};
		const isManual = type === 'manual';
		const { rate: fee } = getFiatDepositFee(currency);
		const limit = getFiatDepositLimit();

		const { min, max, display_name } = coins[currency] || DEFAULT_COIN_DATA;

		const MIN = math.max(fee, min);
		const MAX = limit && math.larger(limit, 0) ? math.min(limit, max) : max;

		return (
			<Fragment>
				{renderTabs()}

				{isManual && (
					<Fragment>
						<div className="py-2">
							<EditWrapper stringId="DEPOSIT_HOME_NOTE">
								{STRINGS['DEPOSIT_HOME_NOTE']}
							</EditWrapper>
						</div>

						<div className="py-3">
							<div className="d-flex justify-content-start">
								<div className="bold">
									<EditWrapper stringId="MIN_DEPOSIT">
										{STRINGS['MIN_DEPOSIT']}
									</EditWrapper>
								</div>
								<div className="pl-4">
									{STRINGS.formatString(
										STRINGS['AMOUNT_FORMAT'],
										MIN,
										display_name
									)}
								</div>
							</div>
							<div className="d-flex justify-content-start">
								<div className="bold">
									<EditWrapper stringId="MAX_DEPOSIT">
										{STRINGS['MAX_DEPOSIT']}
									</EditWrapper>
								</div>
								<div className="pl-4">
									{STRINGS.formatString(
										STRINGS['AMOUNT_FORMAT'],
										MAX,
										display_name
									)}
								</div>
							</div>
							<div className="d-flex justify-content-start">
								<div className="bold">
									<EditWrapper stringId="FEE_LABEL">
										{STRINGS['FEE_LABEL']}
									</EditWrapper>
								</div>
								<div className="pl-4">
									{STRINGS.formatString(
										STRINGS['AMOUNT_FORMAT'],
										fee,
										display_name
									)}
								</div>
							</div>
						</div>
					</Fragment>
				)}
			</Fragment>
		);
	};

	const renderBankTransactionId = () => {
		const { meta: { depositOptions = {} } = { depositOptions: {} } } = coins[
			currency
		];

		return (
			<div>
				<div className="py-2">
					<EditWrapper stringId="DEPOSIT_BANK_TEXT">
						{STRINGS['DEPOSIT_BANK_TEXT']}
					</EditWrapper>
				</div>

				<div className="py-1 dop_preview">
					{Object.entries(depositOptions).map(([_, bankData]) => {
						return Object.entries(bankData).map(([fieldKey, FieldData]) => {
							const filedName = fieldKey.replace(/_/g, ' ');
							return (
								<div className="d-flex justify-content-start">
									<div className="bold pl-3 cap-first">
										{STRINGS[fieldKey] ? STRINGS[fieldKey] : filedName}
										<EditWrapper stringId={fieldKey} />
									</div>
									<div className="pl-4">{FieldData.value || '-'}</div>
								</div>
							);
						});
					})}
				</div>

				<div className="py-2">
					<EditWrapper stringId="DEPOSIT_TXID_NOTE">
						{STRINGS['DEPOSIT_TXID_NOTE']}
					</EditWrapper>
				</div>

				<div className="d-flex align-items-baseline field_warning_wrapper">
					<ExclamationCircleFilled className="field_warning_icon" />
					<div className="field_warning_text">
						<EditWrapper stringId="DEPOSIT_FEE_NOTE">
							{STRINGS['DEPOSIT_FEE_NOTE']}
						</EditWrapper>
					</div>
				</div>
			</div>
		);
	};

	const renderTabs = () => {
		return (
			<div
				className={classnames(
					'custom-tab-wrapper d-flex flex-wrap flex-row justify-content-start'
				)}
			>
				{Object.entries(tabs).map(([key, data]) => {
					const tabProps = {
						key: `tab_item-${key}`,
						className: classnames('tab_item', 'f-1', {
							'tab_item-active': key === activeTab,
							pointer: setActiveTab,
						}),
					};
					if (setActiveTab) {
						tabProps.onClick = () => setActiveTab(key);
					}

					return (
						<div {...tabProps}>
							<Tab {...data} />
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<div className="withdraw-form-wrapper">
			<div className="withdraw-form">
				<Image
					icon={ICONS[`${currency.toUpperCase()}_ICON`]}
					wrapperClassName="form_currency-ball"
				/>
				{titleSection}
				{(!is_verified) && (
					<NoVerifiedAccount type="deposit" />
				)}
				{is_verified && (
					<Fragment>{renderContent()}</Fragment>
				)}
			</div>
			{(!is_verified) && (
				<div className="btn-wrapper">
					<Button
						label="Proceed"
						onClick={() => router.push('/verification?banks')}
						className="mb-3"
					/>
				</div>
			)}
		</div>
	);
};

const mapStateToProps = (store, ownProps) => ({
	user: store.user,
	coins: store.app.coins,
	onramp: store.app.onramp[ownProps.currency],
});

export default connect(mapStateToProps)(withRouter(withConfig(Form)));
