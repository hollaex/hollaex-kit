import React, { useEffect, useState } from 'react';
import math from 'mathjs';
import { connect } from 'react-redux';
import { Button, EditWrapper, Dialog } from 'components';
import renderFields from 'components/Form/factoryFields';
import { reset, stopSubmit, reduxForm, formValueSelector } from 'redux-form';
import {
	required,
	minValue,
	maxValue,
	normalizeBTC,
} from 'components/Form/validations';
import { getDecimals } from 'utils/utils';
import { DEFAULT_COIN_DATA } from 'config/constants';
import { toFixed } from 'utils/currency';

import { STEPS } from './Form';
import PendingDeposit from './PendingDeposit';
import ReviewModalContent from './ReviewModalContent';

import { withRouter } from 'react-router';

import STRINGS from 'config/localizedStrings';
import { depositFiat } from 'actions/walletActions';

const FORM_NAME = 'DepositForm';
const selector = formValueSelector(FORM_NAME);

const generateFormValues = (symbol, coins = {}, step, verification_level) => {
	const { min, max, increment_unit, meta } = coins[symbol] || DEFAULT_COIN_DATA;

	const fee =
		meta && meta[`deposit_fee_${verification_level}`]
			? meta[`deposit_fee_${verification_level}`].value
			: 0;
	const limit =
		meta && meta[`deposit_limit_${verification_level}`]
			? meta[`deposit_limit_${verification_level}`].value
			: 0;

	const MIN = math.max(fee, min);
	const MAX = limit && math.larger(limit, 0) ? math.min(limit, max) : max;

	const amountValidate = [required];
	if (MIN) {
		amountValidate.push(
			minValue(min, STRINGS['DEPOSIT_AMOUNT_MIN_VALIDATION'])
		);
	}
	if (MAX) {
		amountValidate.push(
			maxValue(MAX, STRINGS['DEPOSIT_AMOUNT_MAX_VALIDATION'])
		);
	}

	const fields = {};

	if (step === STEPS.TRANSACTION_ID) {
		fields.transactionId = {
			type: 'string',
			stringId: 'TRANSACTION_ID_LABEL',
			label: STRINGS['TRANSACTION_ID_LABEL'],
			placeholder: STRINGS['TRANSACTION_ID_LABEL'],
			validate: [required],
			fullWidth: true,
			ishorizontalfield: true,
			strings: STRINGS,
		};
	}

	fields.amount = {
		type: 'number',
		stringId:
			'AMOUNT_LABEL,DEPOSIT_AMOUNT_MIN_VALIDATION,DEPOSIT_AMOUNT_MAX_VALIDATION',
		label: STRINGS['AMOUNT_LABEL'],
		placeholder: STRINGS['AMOUNT_LABEL'],
		min: MIN,
		max: MAX,
		step: increment_unit,
		validate: amountValidate,
		normalize: normalizeBTC,
		fullWidth: true,
		ishorizontalfield: true,
		strings: STRINGS,
		disabled: step === STEPS.TRANSACTION_ID,
		parse: (value = '') => {
			let decimal = getDecimals(increment_unit);
			let decValue = toFixed(value);
			let valueDecimal = getDecimals(decValue);

			let result = value;
			if (decimal < valueDecimal) {
				result = decValue
					.toString()
					.substring(0, decValue.toString().length - (valueDecimal - decimal));
			}
			return result;
		},
	};

	if (step === STEPS.TRANSACTION_ID) {
		fields.fee = {
			type: 'number',
			stringId: 'FEE_LABEL',
			label: STRINGS['FEE_LABEL'],
			placeholder: STRINGS['FEE_LABEL'],
			fullWidth: true,
			ishorizontalfield: true,
			strings: STRINGS,
			disabled: true,
		};
	}

	return fields;
};

export const generateInitialValues = (verification_level, coins, currency) => {
	const initialValues = {};

	const { meta } = coins[currency];
	const deposit_fee = meta[`deposit_fee_${verification_level}`]
		? meta[`deposit_fee_${verification_level}`].value
		: 0;

	initialValues.fee = deposit_fee;

	return initialValues;
};

const Deposit = ({
	currency,
	coins,
	pristine,
	submitting,
	valid,
	amount,
	transactionId,
	error,
	dispatch,
	onSubmitFail,
	user: { verification_level },
	step,
	setStep,
	router,
	fee,
}) => {
	const [fields, setFields] = useState({});
	const [dialogIsOpen, setDialogIsOpen] = useState(false);
	const [isPending, setIsPending] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setFields(generateFormValues(currency, coins, step, verification_level));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [step]);

	const onSubmitPaymentReq = (data) => {
		const { increment_unit } = coins[currency] || DEFAULT_COIN_DATA;
		const decimals = getDecimals(increment_unit);
		const values = {
			currency,
			amount: math.eval(math.round(data.amount, decimals)),
			transaction_id: data.transactionId,
			fee: math.eval(math.round(data.fee, decimals)),
		};

		return depositFiat(values);
	};

	const renderButtons = () => {
		switch (step) {
			case STEPS.HOME: {
				return (
					<div className="btn-wrapper">
						<div style={{ position: 'absolute', top: '60px' }}>
							<EditWrapper stringId="PROCEED" />
							<Button
								label={STRINGS['PROCEED']}
								onClick={() => setStep(STEPS.TRANSACTION_ID)}
								disabled={pristine || submitting || !valid}
								className="mb-3"
							/>
						</div>
					</div>
				);
			}
			case STEPS.TRANSACTION_ID: {
				return (
					<div style={{ position: 'absolute', top: '60px' }}>
						<div className="btn-wrapper">
							<div>
								<EditWrapper stringId="back" />
								<Button
									label={STRINGS['BACK']}
									onClick={() => setStep(STEPS.HOME)}
									className="mb-3"
								/>
							</div>
							<div className="separator" />
							<div>
								<EditWrapper stringId="PROCEED" />
								<Button
									label={STRINGS['PROCEED']}
									disabled={pristine || submitting || !valid}
									onClick={() => setDialogIsOpen(true)}
									className="mb-3"
								/>
							</div>
						</div>
					</div>
				);
			}
			default:
				return null;
		}
	};

	const onSubmitPayment = (data) => {
		setLoading(true);
		onSubmitPaymentReq(data)
			.then(() => {
				setIsPending(true);
			})
			.catch((err) => {
				setDialogIsOpen(false);
				setStep(STEPS.HOME);
				const error = {
					_error: err.response.data.message
						? err.response.data.message
						: err.message,
				};
				onSubmitFail(err.errors || err, dispatch);
				dispatch(stopSubmit(FORM_NAME, error));
				// throw new SubmissionError(error);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<div>
			{renderFields(fields)}
			{error && <div className="warning_text">{error}</div>}
			<div className="btn-wrapper" style={{ position: 'relative' }}>
				{renderButtons()}
			</div>
			<Dialog
				isOpen={dialogIsOpen}
				label="deposit-modal"
				onCloseDialog={() => setDialogIsOpen(false)}
				shouldCloseOnOverlayClick={false}
				showCloseText={false}
			>
				{isPending ? (
					<PendingDeposit onOkay={() => router.push('/transactions?tab=2')} />
				) : (
					<ReviewModalContent
						onBack={() => setDialogIsOpen(false)}
						onProceed={onSubmitPayment}
						amount={amount}
						fee={fee}
						transactionId={transactionId}
						currency={currency}
						loading={loading}
						coins={coins}
					/>
				)}
			</Dialog>
		</div>
	);
};

const DepositForm = reduxForm({
	form: FORM_NAME,
	enableReinitialize: true,
	onSubmitFail: (data, dispatch) => {
		setTimeout(() => dispatch(reset(FORM_NAME)), 4000);
	},
	onSubmitSuccess: (data, dispatch) => {
		dispatch(reset(FORM_NAME));
	},
})(Deposit);

const mapStateToProps = (state) => ({
	...selector(state, 'amount', 'transactionId', 'fee'),
	coins: state.app.coins,
	user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
	dispatch,
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(DepositForm));
