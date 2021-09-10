import React, { Fragment } from 'react';
import { Radio, Button } from 'antd';

import Coins from '../Coins';

const radioStyle = {
	display: 'flex',
	alignItems: 'center',
	height: '30px',
	lineHeight: '1.2',
	padding: '24px 0',
	margin: 0,
	paddingLeft: '1px',
	whiteSpace: 'normal',
	letterSpacing: '-0.15px',
};

const Step4 = ({
	coinFormData = {},
	handleSelectChange,
	handleNext,
	handleScreenChange,
}) => {
	return (
		<Fragment>
			<div className="title">Create or add a new coin</div>
			<div className="preview-coin-container">
				<div className="left-content">
					<div className="no-icon">
						<Coins md small color="#ffffff" type={'?'} />
					</div>
				</div>
				<div className="right-content">
					<div className="sub-title">General setup for new asset</div>
					<div className="sub-title">Select the network:</div>
					<Radio.Group
						name="network"
						value={coinFormData.network}
						onChange={(e) => {
							handleSelectChange(e.target.value, 'network');
						}}
					>
						<Radio style={radioStyle} value={'eth'}>
							Ethereum
						</Radio>
						<Radio style={radioStyle} value={'trx'}>
							Tron
						</Radio>
						<Radio style={radioStyle} value={'bnb'}>
							BSC (Binance Smart Chain)
						</Radio>
						<Radio style={radioStyle} value={'other'}>
							other
						</Radio>
					</Radio.Group>
				</div>
			</div>
			<div className="btn-wrapper">
				<Button
					type="primary"
					className="green-btn"
					onClick={() => handleScreenChange('step3')}
				>
					Back
				</Button>
				<div className="separator"></div>
				<Button
					type="primary"
					className="green-btn"
					disabled={!coinFormData.network}
					onClick={handleNext}
				>
					Next
				</Button>
			</div>
		</Fragment>
	);
};

export default Step4;
