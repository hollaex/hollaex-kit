import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Select } from 'antd';

import withConfig from 'components/ConfigProvider/withConfig';
import Markets from './Markets';
import { MarketsSelector } from 'containers/Trade/utils';
import { EditWrapper, IconTitle } from 'components';
import STRINGS from 'config/localizedStrings';

const DigitalAssets = (props) => {
	const {
		user,
		coins,
		balance,
		oraclePrices,
		pairs,
		activeTheme,
		router,
		pair,
		markets,
		icons: ICONS,
	} = props;
	const [options, setOptions] = useState([
		{ value: STRINGS['ALL'], label: STRINGS['ALL'] },
	]);
	const [selectedSource, setSelectedSource] = useState('');

	useEffect(() => {
		getSearchResult();
		handleOptions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleBack = () => {
		router.goBack();
	};

	const handleOptions = () => {
		const optionData = [];
		const nonDublicateCoins = [];
		markets.forEach((market) => {
			const pair_2_symbol = market?.pairTwo?.symbol;
			if (!nonDublicateCoins.includes(pair_2_symbol)) {
				nonDublicateCoins.push(pair_2_symbol);
				optionData.push({
					value: pair_2_symbol,
					label: pair_2_symbol,
				});
			}
		});
		setOptions([...options, ...optionData]);
	};

	const getSearchResult = () => {
		const result = {};
		Object.entries(coins).map(([key, obj]) => {
			const hasCoinBalance = !!balance[`${key}_balance`];
			if (hasCoinBalance) {
				result[key] = { ...obj, oraclePrice: oraclePrices[key] };
			}
			return key;
		});
		return { ...result };
	};

	return (
		<div className="digital-market-wrapper">
			<div className="market-wrapper">
				<div className="header-container">
					<div className="d-flex">
						<IconTitle
							className="digital-assets-icon"
							stringId="DIGITAL_ASSETS_TITLE"
							text={STRINGS['DIGITAL_ASSETS.DIGITAL_ASSETS_TITLE']}
							iconPath={ICONS['ASSET_INFO_COIN']}
							iconId="ASSET_INFO_COIN"
							textType="title"
						/>
					</div>
					<div className="link-content" onClick={handleBack}>
						<EditWrapper stringId="DIGITAL_ASSETS.GO_BACK">
							&lt; {STRINGS['DIGITAL_ASSETS.GO_BACK']}
						</EditWrapper>
					</div>
				</div>
				<div className="d-flex justify-content-between mb-3">
					<div>
						<div className="gray-text">
							<EditWrapper stringId="DIGITAL_ASSETS.ASSETS_INFO">
								{STRINGS['DIGITAL_ASSETS.ASSETS_INFO']}
							</EditWrapper>
						</div>
						<div className="gray-text">
							<EditWrapper stringId="DIGITAL_ASSETS.ASSETS_INFO_DETAIL">
								{STRINGS['DIGITAL_ASSETS.ASSETS_INFO_DETAIL']}
							</EditWrapper>
						</div>
					</div>
					<div className="link-container">
						<Link className="link-1" to={`/quick-trade/${pair}`}>
							<EditWrapper stringId="DIGITAL_ASSETS.QUICK_TRADE">
								{STRINGS['DIGITAL_ASSETS.QUICK_TRADE']}
							</EditWrapper>
						</Link>
						<Link className="link-2" to="/markets">
							<EditWrapper stringId="DIGITAL_ASSETS.MARKETS">
								{STRINGS['DIGITAL_ASSETS.MARKETS']}
							</EditWrapper>
						</Link>
						<Link className="link-3" to="/wallet">
							<EditWrapper stringId="DIGITAL_ASSETS.WALLET">
								{STRINGS['DIGITAL_ASSETS.WALLET']}
							</EditWrapper>
						</Link>
					</div>
				</div>
				<div className="dropdown-container">
					<div className="gray-text">Price source:</div>
					<Select
						defaultValue={options[0]?.value}
						style={{ width: '20rem' }}
						className="coin-select custom-select-input-style elevated"
						dropdownClassName="custom-select-style"
						placeholder=""
						onChange={setSelectedSource}
						options={options}
					/>
				</div>
				<Markets
					user={user}
					coins={coins}
					pairs={pairs}
					activeTheme={activeTheme}
					router={router}
					isFilterDisplay={true}
					isAsset={true}
					selectedSource={selectedSource}
				/>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		pair: state.app.pair,
		pairs: state.app.pairs,
		coins: state.app.coins,
		user: state.user || {},
		activeTheme: state.app.theme,
		balance: state.user.balance,
		oraclePrices: state.asset.oraclePrices,
		tickers: state.app.tickers,
		markets: MarketsSelector(state),
	};
};

export default connect(mapStateToProps)(withConfig(DigitalAssets));
