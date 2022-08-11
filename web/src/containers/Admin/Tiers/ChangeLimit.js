import React, { useState } from 'react';
import { Button, Switch } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import { CurrencyBall } from '../../../components';

const ChangeLimit = ({
	tierName = '',
	coinSymbol = '',
	handleScreenUpdate,
	isNativeCoin,
	setIsNativeCoin,
	constants = {},
	allCoins = [],
	formData = {},
	setFormData = () => {},
	isUseNativeCoin,
}) => {
	const [isSwitchChanged, setIsSwitchChanged] = useState(false);
	const { native_currency } = constants;

	const handleSwitch = () => {
		let temp = {};
		Object.keys(formData).forEach((item) => {
			temp = {
				...temp,
				[item]: {
					...formData[item],
					native_currency_limit: !isNativeCoin,
				},
			};
		});
		setFormData(temp);
		setIsNativeCoin(!isNativeCoin);
		setIsSwitchChanged(true);
	};

	const getCoinFullname = () => {
		let coinFullname = '';
		allCoins.forEach((item) => {
			if (native_currency && native_currency === item?.symbol) {
				coinFullname = item?.fullname;
			}
		});
		return coinFullname;
	};
	const renderShortInfo = (isNativeCoin, isUseNativeCoin) => {
		if (!isNativeCoin && isUseNativeCoin) {
			return (
				<div className="d-flex align-items-center mb-4 mt-4">
					<InfoCircleOutlined style={{ fontSize: '40px' }} />
					<div className="ml-3">
						Once changed, the limit amounts for this asset will be treated
						independently from other assets limits valued in the native asset or
						other limit value types.
					</div>
				</div>
			);
		} else if (isNativeCoin && !isUseNativeCoin) {
			return (
				<div className="d-flex align-items-center mb-4 mt-4">
					<InfoCircleOutlined style={{ fontSize: '40px' }} />
					<div className="ml-3">
						Once changed, the limit amounts will be valued together with all
						other assets using the native asset.
					</div>
				</div>
			);
		} else {
			return null;
		}
	};

	return (
		<div className="change-Limit-wrapper">
			<h3>Change limit value type</h3>
			{(!isUseNativeCoin && !isSwitchChanged) ||
			(!isUseNativeCoin && isSwitchChanged) ? (
				<div>
					Change {tierName} ({coinSymbol.toUpperCase()}) limits value type from{' '}
					{tierName} ({coinSymbol?.toUpperCase()}) to the default native asset{' '}
					{getCoinFullname()} ({native_currency?.toUpperCase()}).
				</div>
			) : (
				((isUseNativeCoin && !isSwitchChanged) ||
					(isUseNativeCoin && isSwitchChanged)) && (
					<div>
						Change {tierName} ({coinSymbol.toUpperCase()}) limits value type
						from the default native asset {getCoinFullname()} (
						{native_currency?.toUpperCase()}) to {tierName} (
						{coinSymbol?.toUpperCase()}).
					</div>
				)
			)}
			<div className="d-flex align-items-center mt-5 mb-5">
				<span
					className={
						!isNativeCoin
							? 'mr-2 d-flex align-items-center flex-column disabled'
							: 'mr-2 d-flex align-items-center flex-column'
					}
				>
					<CurrencyBall
						symbol={native_currency}
						name={native_currency}
						size={isNativeCoin ? 'l' : 'm'}
					/>
					<span className="small-txt">(Native asset)</span>
				</span>
				<Switch checked={!isNativeCoin} onChange={handleSwitch} />
				<span className={isNativeCoin ? 'ml-2 disabled' : 'ml-2'}>
					<CurrencyBall
						symbol={coinSymbol}
						name={coinSymbol}
						size={isNativeCoin ? 'm' : 'l'}
					/>
				</span>
			</div>
			{renderShortInfo(isNativeCoin, isUseNativeCoin)}
			<div className="button-wrapper mt-4">
				<Button
					type="primary"
					className="green-btn"
					onClick={() => handleScreenUpdate('edit-limits')}
				>
					Back
				</Button>
				<Button
					type="primary"
					className="green-btn"
					onClick={() => handleScreenUpdate('check-confirm')}
					disabled={
						(isNativeCoin && isUseNativeCoin) ||
						(!isNativeCoin && !isUseNativeCoin)
					}
				>
					Proceed
				</Button>
			</div>
		</div>
	);
};
export default ChangeLimit;
