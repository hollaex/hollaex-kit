import React, { Fragment } from 'react';
import { Checkbox, InputNumber, Button } from 'antd';

const AssetParams = ({
	editParams = false,
	coinFormData = {},
	handleCheckChange,
	handleChangeNumber,
	handleScreenChange,
	handleNext,
	handleMetaChange,
}) => {

	const handleMoveNext = () => {
		if (!coinFormData.id) {
			handleNext();
		} else if (editParams) {
			handleScreenChange('update_confirm');
		} else {
			handleScreenChange('edit_withdrawal_fees');
		}
	};

	return (
		<Fragment>
			<div className="title">Asset parameters</div>
			<div className="assets-wrapper">
				{/* <div className="field-wrap">
                    <Checkbox
                        name="active"
                        onChange={handleCheckChange}
                        checked={coinFormData.active}
                    >
                        <div className="sub-title">Make Coin Active</div>
                        <div className="description">Activate this coin on your exchange immediately after setup</div>
                    </Checkbox>
                </div> */}
				<div className="field-wrap">
					<Checkbox
						name="allow_deposit"
						onChange={handleCheckChange}
						checked={coinFormData.allow_deposit}
					>
						<div className="sub-title">Allow Deposits</div>
						<div className="description">
							<div>Allow deposit for this coin once the exchange launches.</div>
							<div>
								Amount is dependents on user level and what you set later on.
							</div>
						</div>
					</Checkbox>
				</div>
				<div className="field-wrap">
					<Checkbox
						name="allow_withdrawal"
						onChange={handleCheckChange}
						checked={coinFormData.allow_withdrawal}
					>
						<div className="sub-title">Allow Withdrawal</div>
						<div className="description">
							<div>
								Allow withdrawal for this coin once the exchange launches.
							</div>
							<div>
								Amount is dependents on user level and what you set later on.
							</div>
						</div>
					</Checkbox>
				</div>
				{/* {!coinFormData.withdrawal_fees
					?
					<div className="field-wrap">
						<div className="sub-title">Fee for withdrawal</div>
						<div className="description">
							<div>
								Enter the fee amount for when this coin is withdraw from your
								exchange
							</div>
						</div>
						<InputNumber
							name="withdrawal_fee"
							onChange={(val) => handleChangeNumber(val, 'withdrawal_fee')}
							value={coinFormData.withdrawal_fee}
						/>
					</div>
					: null
				} */}
				<div className="field-wrap">
					<div className="sub-title">Minimum Withdrawal Amount</div>
					<div className="description">
						<div>
							Sell the minimum amount allowed to be withdrawn for this coins
						</div>
					</div>
					<InputNumber
						name="min"
						onChange={(val) => handleChangeNumber(val, 'min')}
						value={coinFormData.min}
					/>
				</div>
				<div className="field-wrap">
					<div className="sub-title">Maximum Withdrawal Amount</div>
					<div className="description">
						<div>
							Sell the maximum amount allowed to be withdrawn for this coins
						</div>
					</div>
					<InputNumber
						name="max"
						onChange={(val) => handleChangeNumber(val, 'max')}
						value={coinFormData.max}
					/>
				</div>
				<div className='field-wrap last'>
					<div className="sub-title">Increment Amount</div>
					<div className="description">
						<div>
							Sell the increment amount that can be adjusted up and down for
							this coins
						</div>
					</div>
					<InputNumber
						name="increment_unit"
						onChange={(val) => handleChangeNumber(val, 'increment_unit')}
						value={coinFormData.increment_unit}
					/>
				</div>
				{/* {editParams ? (
					<div className="field-wrap last">
						<div className="sub-title">Decimal points (max 18):</div>
						<InputNumber
							name="decimal_points"
							onChange={(val) => handleMetaChange(val, 'decimal_points')}
							value={coinFormData.meta.decimal_points}
						/>
					</div>
				) : null} */}
				<div className="btn-wrapper">
					<Button
						type="primary"
						className="green-btn"
						onClick={() => {
							if (editParams) {
								handleScreenChange('edit-params');
							} else {
								handleScreenChange('step8')
							}
						}}
					>
						Back
					</Button>
					<div className="separator"></div>
					{editParams
						?
						<Button type="primary" className="green-btn" onClick={handleMoveNext}>
							Next
						</Button>
						:
						<Button type="primary" className="green-btn" onClick={handleMoveNext}>
							Confirm
						</Button>
					}
				</div>
			</div>
		</Fragment>
	);
};

export default AssetParams;
