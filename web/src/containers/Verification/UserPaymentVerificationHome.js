import React from 'react';
import { connect } from 'react-redux';
import { EditWrapper, Button, PanelInformationRow, Image } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { generateDynamicStringKey } from 'utils/id';

export const HIDDEN_KEYS = ['id', 'status', 'type'];

const UserPaymentVerificationHome = ({
	user,
	setActivePageContent,
	handleBack,
	icons: ICONS,
	user_payments = {},
}) => {
	const { bank_account } = user;

	const resolvePaymentTypeKey = (type) => {
		// Prefer explicit type when it is a string (e.g. "Interac").
		if (!type || typeof type !== 'string') {
			return '';
		}
		// Prefer exact match (config keys are case-sensitive), then fallback to case-insensitive match.
		if (Object.prototype.hasOwnProperty.call(user_payments, type)) {
			return type;
		}
		const normalized = type.trim().toLowerCase();
		const found = Object.keys(user_payments).find(
			(k) => typeof k === 'string' && k.trim().toLowerCase() === normalized
		);
		return found || type;
	};

	const inferPaymentTypeKeyFromAccount = (account = {}) => {
		// If `type` isn't available on the stored bank account record, infer the payment method
		// by matching the account's keys against each user_payments schema.
		const accountKeys = Object.keys(account).filter(
			(k) => !HIDDEN_KEYS.includes(k)
		);
		if (!accountKeys.length) {
			return '';
		}

		let bestKey = '';
		let bestScore = 0;

		Object.entries(user_payments || {}).forEach(([paymentKey, paymentDef]) => {
			const schemaFields = Array.isArray(paymentDef?.data)
				? paymentDef.data
				: [];
			const schemaKeys = schemaFields.map(({ key }) => key).filter(Boolean);
			if (!schemaKeys.length) {
				return;
			}
			const overlap = schemaKeys.filter((k) => accountKeys.includes(k)).length;
			if (overlap > bestScore) {
				bestScore = overlap;
				bestKey = paymentKey;
			}
		});

		return bestScore > 0 ? bestKey : '';
	};

	const renderList = () => {
		const List = bank_account
			.filter(({ status }) => status !== 0)
			.map((account, index) => {
				const { type } = account;
				const paymentTypeKey =
					resolvePaymentTypeKey(type) ||
					inferPaymentTypeKeyFromAccount(account);
				const schema = paymentTypeKey ? user_payments?.[paymentTypeKey] : null;
				const schemaFields = Array.isArray(schema?.data) ? schema.data : [];
				const schemaFieldKeys = schemaFields
					.map(({ key }) => key)
					.filter(Boolean);

				const generateId = generateDynamicStringKey(
					'ULTIMATE_FIAT',
					paymentTypeKey || type || 'bank'
				);

				const accountFieldKeys = Object.keys(account).filter(
					(k) => !HIDDEN_KEYS.includes(k)
				);

				// If we have a schema and a type, show fields in the schema order first.
				const orderedKeys = paymentTypeKey
					? [
							...schemaFieldKeys.filter((k) => accountFieldKeys.includes(k)),
							...accountFieldKeys.filter((k) => !schemaFieldKeys.includes(k)),
					  ]
					: accountFieldKeys;

				return (
					<div key={index} className="d-flex my-4">
						{account.status === 1 && (
							<div className="d-flex align-items-center mr-3">
								<Image
									iconId="PENDING_TIMER"
									icon={ICONS['PENDING_TIMER']}
									wrapperClassName="account-pending-icon"
								/>
							</div>
						)}
						<div className="w-100">
							{orderedKeys.map((data, index) => {
								const stringId = generateId(data);
								const defaultText = data.replace(/_/g, ' ');
								const schemaLabel = schemaFields.find((f) => f.key === data)
									?.label;
								return (
									<PanelInformationRow
										key={index}
										stringId={stringId}
										label={schemaLabel || STRINGS[stringId] || defaultText}
										information={account[data]}
										className="title-font"
										disable
									/>
								);
							})}
						</div>
					</div>
				);
			});
		return List;
	};

	if (
		!bank_account.length ||
		bank_account.length ===
			bank_account.filter((data) => data.status === 0).length
	) {
		return (
			<div className="btn-wrapper">
				<div className="holla-verification-button">
					<EditWrapper stringId="USER_VERIFICATION.START_PAYMENT_VERIFICATION" />
					<Button
						label={STRINGS['USER_VERIFICATION.START_PAYMENT_VERIFICATION']}
						onClick={() => setActivePageContent('user_payments')}
					/>
				</div>
			</div>
		);
	} else {
		return (
			<div>
				<EditWrapper
					stringId="USER_VERIFICATION.PAYMENT_VERIFICATION_HELP_TEXT,USER_VERIFICATION.DOCUMENT_SUBMISSION"
					renderWrapper={(children) => (
						<div className="font-weight-bold text-lowercase">{children}</div>
					)}
				>
					{STRINGS.formatString(
						STRINGS['USER_VERIFICATION.PAYMENT_VERIFICATION_HELP_TEXT'],
						<span
							className="verification_link pointer"
							onClick={(e) => handleBack('kyc', e)}
						>
							{STRINGS['USER_VERIFICATION.DOCUMENT_SUBMISSION']}
						</span>
					)}
				</EditWrapper>
				{renderList()}
				<div>
					<EditWrapper stringId="USER_VERIFICATION.ADD_ANOTHER_PAYMENT_METHOD" />
					<Button
						label={STRINGS['USER_VERIFICATION.ADD_ANOTHER_PAYMENT_METHOD']}
						onClick={() => setActivePageContent('user_payments')}
					/>
				</div>
			</div>
		);
	}
};

const mapStateToProps = ({ app: { user_payments = {} } }) => ({
	user_payments,
});

export default connect(mapStateToProps)(
	withConfig(UserPaymentVerificationHome)
);
