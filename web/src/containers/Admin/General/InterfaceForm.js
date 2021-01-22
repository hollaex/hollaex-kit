import React, { useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import { Button, Radio } from 'antd';

import { STATIC_ICONS } from 'config/icons';

const InterfaceForm = ({ initialValues = {}, handleSaveInterface }) => {
	const [type, setType] = useState('full');
	useEffect(() => {
		if (initialValues.type) {
			setType(initialValues.type);
		}
	}, [initialValues]);
	const handleChange = (event) => {
		if (event.target.value) {
			setType(event.target.value);
		}
	};
	return (
		<div className="general-wrapper mb-4">
			<div className="sub-title">Trading Interface</div>
			<div className="description">
				Select the trading interface that will be available on your exchange.
				All interfaces includes a crypto wallet.
			</div>
			<div className="radio-btn-wrapper">
				<Radio.Group onChange={handleChange} value={type}>
					<Radio value="full">
						Full interface
						<div className="d-flex justify-content-between">
							<div className="small-text">(Pro & quick trade with wallet)</div>
							<div className="box">
								<div className="interface_container">
									<div className="sell">
										<span className="label">SELL</span>
									</div>
									<div className="buy">
										<span className="label">BUY</span>
									</div>
								</div>
							</div>
							<div>
								<ReactSVG
									src={STATIC_ICONS.CANDLES_LOGO}
									className="candle-icon"
								/>
							</div>
						</div>
					</Radio>
					<Radio value="pro-trade">
						Pro trade only
						<div className="small-text">
							(Chart, orderbook, limit orders with wallet)
						</div>
						<ReactSVG src={STATIC_ICONS.CANDLES_LOGO} className="candle-icon" />
					</Radio>
					<Radio value="quick-trade">
						Quick trade only
						<div className="d-flex justify-content-between">
							<div className="small-text">
								(Simple buy/sell interface with wallet)
							</div>
							<div className="box interface">
								<div className="interface_container">
									<div className="sell">
										<span className="label">SELL</span>
									</div>
									<div className="buy">
										<span className="label">BUY</span>
									</div>
								</div>
							</div>
						</div>
					</Radio>
					<Radio value="wallet">
						Wallet only
						<div className="d-flex justify-content-between">
							<div className="small-text">(No trading. Only crypto wallet)</div>
							<div className="box interface">
								<ReactSVG
									src={STATIC_ICONS.WALLET_BTC_ICON}
									className="wallet-icon"
								/>
							</div>
						</div>
					</Radio>
				</Radio.Group>
			</div>
			<div>
				<Button type="primary" onClick={() => handleSaveInterface(type)}>
					Save
				</Button>
			</div>
		</div>
	);
};

export default InterfaceForm;
