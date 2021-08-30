import React from 'react';
import { Input, Button } from 'antd';

const CoinLimitedFields = ({ coinFormData = {}, handleChange, handleNext }) => {
	return (
		<div className="coin-limit-wrap">
			<div className="title">Create new asset</div>
			<div className="field-wrap">
				<div className="sub-title">Asset Name</div>
				<div className="description">
					<div>Enter the full name for this asset (example 'Bitcoin')</div>
				</div>
				<Input
					name="fullname"
					placeholder="Name asset"
					onChange={handleChange}
					value={coinFormData.fullname}
				/>
			</div>
			<div className="field-wrap last">
				<div className="sub-title">Asset Symbol</div>
				<div className="description">
					<div>Enter the shorthand symbol for this asset (example 'BTC')</div>
				</div>
				<Input
					name="symbol"
					placeholder="Trading symbol"
					onChange={handleChange}
					value={coinFormData.symbol}
				/>
			</div>
			<div className="btn-wrapper">
				<Button type="primary" className="green-btn" onClick={handleNext}>
					Next
				</Button>
			</div>
		</div>
	);
};

export default CoinLimitedFields;
