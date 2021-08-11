import React from 'react';
import classnames from 'classnames';

import './index.css';

export const COIN_FULL_NAME = {
	btc: 'Bitcoin',
	bch: 'Bitcoin Cash',
	bsv: 'Bitcoin Satoshi Vision',
	hex: 'HollaEx',
	xht: 'HollaEx',
	usdt: 'USD Tether',
	bnb: 'BNB',
	leo: 'UNUS SED',
	mkr: 'Maker',
	usdc: 'USD Coin',
	bat: 'BAT',
	xmr: 'Monero',
	dai: 'DAI',
	xrp: 'Ripple',
	eos: 'EOS',
	ltc: 'Litecoin',
	xlm: 'Stellar',
	ada: 'Cardano',
	trx: 'Tron',
	neo: 'NEO',
	nem: 'NEM',
	eth: 'Ethereum',
	etc: 'Ethereum Classic',
	dash: 'Dash',
	miota: 'IOTA',
	zrx: 'ZRX',
	tusd: 'True USD',
	xaut: 'Gold Tether',
};

const Coins = ({
	type,
	small,
	xs,
	md,
	color,
	large,
	nohover = false,
	fullname = '',
	onClick,
}) => {
	const coinStyle = {};
	let wrapClass = 'coin-wrap';
	if (xs) {
		wrapClass += ' xs';
	}
	if (md) {
		wrapClass += ' md';
	}
	if (nohover) {
		wrapClass += ' large-no-hover';
	} else if (large) {
		wrapClass += ' large';
	}
	if (color) {
		coinStyle.border = `1.5px solid ${color}`;
	}
	if (type === 'hex') {
		type = 'xht';
	}
	return (
		<div className={classnames('coins-wrapper', wrapClass)} onClick={onClick}>
			<div className={`coin-ico ${type}`} style={coinStyle}>
				{!type ? <div className="type-space"></div> : type.toUpperCase()}
				{large ? <p>{fullname || COIN_FULL_NAME[type]}</p> : null}
			</div>
			{small ? null : <div className="coin-name">{fullname}</div>}
		</div>
	);
};

Coins.defaultProps = {
	type: 'btc',
	onClick: () => {},
};

export default Coins;
