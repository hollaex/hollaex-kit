import React, { Component } from 'react';
import { InputNumber, Button, Checkbox } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import Coins from '../Coins';
import { getTabParams } from '../AdminFinancials/Assets';

class PairParams extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			tabParams: getTabParams()
		};
	}

	getCoinData = (pair) => {
		return (
			this.props.coins.filter((coin) => {
				if (typeof coin === 'string') {
					return coin === pair;
				}
				return coin.symbol === pair;
			})[0] || ''
		);
	};

	handleBack = () => {
		const { isEdit, moveToStep, onClose, router } = this.props;
		if (isEdit) {
			onClose();
		} else if (this.state.tabParams.isOpenPairModal) {
			onClose();
			router.replace("/admin/trade?tab=0");
		} else {
			moveToStep('pair-init-selection');
		}
	};

	render() {
		const {
			formData = {},
			handleChange,
			moveToStep,
			handleNext,
			requestParams,
		} = this.props;
		const { isLoading } = this.state;
		let pairBase = this.getCoinData(formData.pair_base);
		let pair2 = this.getCoinData(formData.pair_2);

		return (
			<div>
				<div className="title">Market parameters</div>
				<div>
					Values have been preset based on the rough dollar value of the base
					asset.
				</div>
				<div>Click edit to change these trade values.</div>
				<div className="d-flex align-items-center coin-container">
					<div className="d-flex align-items-center">
						<Coins type={pairBase.symbol} small={true} color={pairBase.meta.color}/>
						<span className="coin-full-name">{pairBase.fullname}</span>
					</div>
					<CloseOutlined style={{ fontSize: '24px' }} />
					<div className="d-flex align-items-center">
						<Coins type={pair2.symbol} small={true} color={pair2.meta.color}/>
						<span className="coin-full-name">{pair2.fullname}</span>
					</div>
				</div>
				<div className="field-wrap last">
					<div className="sub-title">Price</div>
					<div className="description">
						<div>{`Rough price of ${formData.pair_base} in ${formData.pair_2}`}</div>
					</div>
					<div className="full-width d-flex align-items-center">
						<InputNumber
							name="estimated_price"
							onChange={(val) => handleChange(val, 'estimated_price')}
							value={formData.estimated_price}
						/>
						<Button
							type="primary"
							className="green-btn"
							onClick={requestParams}
							loading={isLoading}
						>
							Set
						</Button>
					</div>
				</div>
				<div className="edit-wrapper">
					<div className="sub-title">Min and max tradable</div>
					<Button
						type="primary"
						className="green-btn"
						onClick={() => moveToStep('edit-tradable')}
					>
						Edit
					</Button>
				</div>
				<div className="field-wrap">
					<div className="sub-title">Minimum Tradable Amount</div>
					<div className="description">
						<div>Minimum - amount that can be traded for this market.</div>
					</div>
					<div className="full-width">{formData.min_size}</div>
				</div>
				<div className="field-wrap">
					<div className="sub-title">Maximum Tradable Amount</div>
					<div className="description">
						<div>Maximum - amount that can be traded for this market.</div>
					</div>
					<div className="full-width">{formData.max_size}</div>
				</div>
				<div className="field-wrap">
					<div className="sub-title">Minimum Tradable Price</div>
					<div className="description">
						<div>
							Minimum - quoted trading price that can be traded for this market.
						</div>
					</div>
					<div className="full-width">{formData.min_price}</div>
				</div>
				<div className="field-wrap last">
					<div className="sub-title">Maximum Tradable Price</div>
					<div className="description">
						<div>
							Maximum - quoted trading price that can be traded for this market.
						</div>
					</div>
					<div className="full-width">{formData.max_price}</div>
				</div>
				<div className="edit-wrapper">
					<div className="sub-title">Tradable increment</div>
					<Button
						type="primary"
						className="green-btn"
						onClick={() => moveToStep('edit-increment')}
					>
						Edit
					</Button>
				</div>
				<div className="field-wrap">
					<div className="sub-title">Increment Amount</div>
					<div className="description">
						<div>
							The increment - amount allowed to be adjusted up and down in the
							order entry panel
						</div>
					</div>
					<div className="full-width">{formData.increment_size}</div>
				</div>
				<div className="field-wrap last">
					<div className="sub-title">Increment Price</div>
					<div className="description">
						<div>
							The increment - price allowed to be adjusted up and down in the
							order entry panel
						</div>
					</div>
					<div className="full-width">{formData.increment_price}</div>
				</div>
				<div className="edit-wrapper"></div>
				<div className="field-wrap last">
					<div className="sub-title">Make public</div>
					<div className="description">
						<div>
							Make this asset public so that others can see and add this asset
							to their platform.
						</div>
					</div>
					<div className="full-width">
						<Checkbox
							name="is_public"
							onChange={(e) => handleChange(e.target.checked, 'is_public')}
							checked={formData.is_public}
						>
							<div className="sub-title">Make public</div>
						</Checkbox>
					</div>
				</div>
				<div className="btn-wrapper">
					<Button
						type="primary"
						className="green-btn"
						onClick={this.handleBack}
					>
						Back
					</Button>
					<div className="separator"></div>
					<Button type="primary" className="green-btn" onClick={handleNext}>
						Next
					</Button>
				</div>
			</div>
		);
	}
}

export default PairParams;
