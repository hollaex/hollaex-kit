import React from 'react';
import { Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';

import { CurrencyBall } from '../../../components';

const CheckAndConfirm = ({
	tierName = '',
	coinSymbol = '',
	handleScreenUpdate,
	constants = {},
	handleConfirm,
	isNativeCoin = false,
	isUseNativeCoin = false,
}) => {
	const { native_currency } = constants;

	const currentNative =
		!isNativeCoin && isUseNativeCoin ? native_currency : coinSymbol;
	const currentCoin =
		isNativeCoin && !isUseNativeCoin ? native_currency : coinSymbol;

	const renderShortInfo = (isNativeCoin, isUseNativeCoin) => {
		if (!isNativeCoin && isUseNativeCoin) {
			return (
				<div className="mt-3">
					{tierName} ({coinSymbol.toUpperCase()}) limits will now be valued in{' '}
					{coinSymbol.toUpperCase()}. Limits for this asset will now be treated
					separately from other assets.
				</div>
			);
		} else if (isNativeCoin && !isUseNativeCoin) {
			return (
				<div className="mt-3">
					{tierName} ({coinSymbol.toUpperCase()}) limits will now be valued in{' '}
					{native_currency.toUpperCase()}. Limits for this asset will be
					calculated together with other assets valued in{' '}
					{native_currency.toUpperCase()}.
				</div>
			);
		}
	};
	return (
		<div className="change-Limit-wrapper">
			<h3>Check & confirm</h3>
			<div className="mb-3">
				Check the changes below for {tierName} ({coinSymbol.toUpperCase()}) are
				correct and confirm.
			</div>
			<div className="d-flex align-items-center mt-5 mb-5 p-relative">
				<div className="mr-1">
					<CurrencyBall symbol={currentNative} name={currentNative} size="l" />
				</div>
				<div className="arrow-border">Limits will be valued in</div>
				<RightOutlined />
				<div className="ml-1">
					<CurrencyBall symbol={currentCoin} name={currentCoin} size="l" />
				</div>
			</div>
			{renderShortInfo(isNativeCoin, isUseNativeCoin)}
			<div className="mt-3">
				Are you sure you want to change the limit value type from{' '}
				<span className="bold">{currentNative?.toUpperCase()}</span> to{' '}
				<span className="bold">{currentCoin.toUpperCase()}</span>?
			</div>
			<div className="button-wrapper mt-4">
				<Button
					type="primary"
					className="green-btn"
					onClick={() => handleScreenUpdate('change-limits')}
				>
					Back
				</Button>
				<Button
					type="primary"
					className="green-btn"
					onClick={() => handleConfirm('edit-limits')}
				>
					Confirm
				</Button>
			</div>
		</div>
	);
};
export default CheckAndConfirm;
