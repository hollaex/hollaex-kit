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

const Step5 = ({
	coinFormData = {},
	handleChange,
	handleNext,
	handleRevertAsset,
	handleScreenChange,
}) => {
	const handleBack = () => {
		handleRevertAsset();
		handleScreenChange('step4');
	};
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
					<div className="sub-title">Blockchain standard</div>
					<Radio.Group
						name="standard"
						value={coinFormData.standard}
						onChange={(e) => {
							handleChange(e.target.value, 'standard');
						}}
					>
						<Radio style={radioStyle} value={'erc-20'}>
							ERC-20
						</Radio>
						<Radio style={radioStyle} value={'other'}>
							other
						</Radio>
					</Radio.Group>
				</div>
			</div>
			<div className="btn-wrapper">
				<Button type="primary" className="green-btn" onClick={handleBack}>
					Back
				</Button>
				<div className="separator"></div>
				<Button
					type="primary"
					className="green-btn"
					disabled={!coinFormData.standard}
					onClick={handleNext}
				>
					Next
				</Button>
			</div>
		</Fragment>
	);
};

export default Step5;
