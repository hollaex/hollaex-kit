import React from 'react';
import { InputNumber, Button } from 'antd';

export const EditTradable = ({ formData, handleChange, moveToStep }) => {
	return (
		<div>
			<div className="title">Market parameters</div>
			<div className="field-wrap">
				<div className="sub-title">Minimum Tradable Amount</div>
				<div className="description">
					<div>Minimum - amount that can be traded for this market.</div>
				</div>
				<div className="full-width">
					<InputNumber
						name="max"
						onChange={(val) => handleChange(val, 'min_size')}
						value={formData.min_size}
					/>
				</div>
			</div>
			<div className="field-wrap">
				<div className="sub-title">Maximum Tradable Amount</div>
				<div className="description">
					<div>Maximum - amount that can be traded for this market.</div>
				</div>
				<div className="full-width">
					<InputNumber
						name="max"
						onChange={(val) => handleChange(val, 'max_size')}
						value={formData.max_size}
					/>
				</div>
			</div>
			<div className="field-wrap">
				<div className="sub-title">Minimum Tradable Price</div>
				<div className="description">
					<div>
						Minimum - quoted trading price that can be traded for this market.
					</div>
				</div>
				<div className="full-width">
					<InputNumber
						name="max"
						onChange={(val) => handleChange(val, 'min_price')}
						value={formData.min_price}
					/>
				</div>
			</div>
			<div className="field-wrap last">
				<div className="sub-title">Maximum Tradable Price</div>
				<div className="description">
					<div>
						Maximum - quoted trading price that can be traded for this market.
					</div>
				</div>
				<div className="full-width">
					<InputNumber
						name="max"
						onChange={(val) => handleChange(val, 'max_price')}
						value={formData.max_price}
					/>
				</div>
			</div>
			<div className="btn-wrapper">
				<Button
					type="primary"
					className="green-btn"
					onClick={() => moveToStep('step2')}
				>
					Next
				</Button>
			</div>
		</div>
	);
};

export const EditIncrement = ({ formData, handleChange, moveToStep }) => {
	return (
		<div>
			<div className="title">Market parameters</div>
			<div className="field-wrap">
				<div className="sub-title">Increment Amount</div>
				<div className="description">
					<div>
						The increment - amount allowed to be adjusted up and down in the
						order entry panel
					</div>
				</div>
				<div className="full-width">
					<InputNumber
						name="max"
						onChange={(val) => handleChange(val, 'increment_size')}
						value={formData.increment_size}
					/>
				</div>
			</div>
			<div className="field-wrap last">
				<div className="sub-title">Increment Price</div>
				<div className="description">
					<div>
						The increment - price allowed to be adjusted up and down in the
						order entry panel
					</div>
				</div>
				<div className="full-width">
					<InputNumber
						name="max"
						onChange={(val) => handleChange(val, 'increment_price')}
						value={formData.increment_price}
					/>
				</div>
			</div>
			<div className="btn-wrapper">
				<Button
					type="primary"
					className="green-btn"
					onClick={() => moveToStep('step2')}
				>
					Next
				</Button>
			</div>
		</div>
	);
};
