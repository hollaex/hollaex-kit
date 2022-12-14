import React, { useEffect } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import withConfig from 'components/ConfigProvider/withConfig';
import Markets from './Markets';
import { STATIC_ICONS } from 'config/icons';

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
	} = props;

	useEffect(() => {
		getSearchResult();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleBack = () => {
		router.goBack();
	};

	const getSearchResult = () => {
		const result = {};
		Object.keys(coins).map((key) => {
			const temp = coins[key];
			const hasCoinBalance = !!balance[`${key}_balance`];
			if (hasCoinBalance) {
				result[key] = { ...temp, oraclePrice: oraclePrices[key] };
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
						<img
							src={`${STATIC_ICONS.ASSET_INFO_COIN}`}
							alt="asset-info-coin"
						/>
						<div className="header-text">Digital assets</div>
					</div>
					<div className="link-content" onClick={() => handleBack()}>
						&lt; Go back
					</div>
				</div>
				<div className="d-flex justify-content-between mb-3">
					<div>
						<div className="gray-text">
							Below are available assets on the platform.
						</div>
						<div className="gray-text">
							You can click an asset on the list below to learn more.
						</div>
					</div>
					<div className="link-container">
						<Link className="link-1" to={`/quick-trade/${pair}`}>
							QUICK TRADE
						</Link>
						<Link className="link-2" to="/markets">
							MARKETS
						</Link>
						<Link className="link-3" to="/wallet">
							WALLET
						</Link>
					</div>
				</div>
				<Markets
					user={user}
					coins={coins}
					pairs={pairs}
					activeTheme={activeTheme}
					router={router}
					isFilterDisplay={true}
					isAsset={true}
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
	};
};

export default connect(mapStateToProps)(withConfig(DigitalAssets));
