import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Select } from 'antd';

import { unique } from 'utils/data';
import withConfig from 'components/ConfigProvider/withConfig';
import Markets from './components/AssetsWrapper';
import { MarketsSelector } from './components/utils';
import { EditWrapper, IconTitle } from 'components';
import STRINGS from 'config/localizedStrings';

const DigitalAssets = ({
	router,
	pair,
	markets,
	icons: ICONS,
	showQuickTrade,
}) => {
	const DEFAULT_OPTIONS = [{ value: 'all', label: STRINGS['ALL'] }];
	const [options, setOptions] = useState(DEFAULT_OPTIONS);
	const [selectedSource, setSelectedSource] = useState('');

	useEffect(() => {
		handleOptions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleOptions = () => {
		const options = unique(
			markets.map(({ pairTwo: { symbol } }) => symbol)
		).map((symbol) => ({ value: symbol, label: symbol }));
		setOptions([...DEFAULT_OPTIONS, ...options]);
	};

	return (
		<div className="digital-market-wrapper">
			<div className="market-wrapper">
				<div className="header-container">
					<div className="d-flex">
						<IconTitle
							className="digital-assets-icon"
							stringId="DIGITAL_ASSETS.DIGITAL_ASSETS_TITLE"
							text={STRINGS['DIGITAL_ASSETS.DIGITAL_ASSETS_TITLE']}
							iconPath={ICONS['ASSET_INFO_COIN']}
							iconId="ASSET_INFO_COIN"
							textType="title"
						/>
					</div>
					<div className="link-content" onClick={router.goBack}>
						<EditWrapper stringId="DIGITAL_ASSETS.GO_BACK">
							&lt; {STRINGS['DIGITAL_ASSETS.GO_BACK']}
						</EditWrapper>
					</div>
				</div>
				<div className="d-flex justify-content-between mb-3">
					<div>
						<div className="secondary-text">
							<EditWrapper stringId="DIGITAL_ASSETS.ASSETS_INFO">
								{STRINGS['DIGITAL_ASSETS.ASSETS_INFO']}
							</EditWrapper>
						</div>
						<div className="secondary-text">
							<EditWrapper stringId="DIGITAL_ASSETS.ASSETS_INFO_DETAIL">
								{STRINGS['DIGITAL_ASSETS.ASSETS_INFO_DETAIL']}
							</EditWrapper>
						</div>
					</div>
					<div className="link-container">
						{showQuickTrade && (
							<Link className="link-1" to={`/quick-trade/${pair}`}>
								<EditWrapper stringId="DIGITAL_ASSETS.QUICK_TRADE">
									{STRINGS['DIGITAL_ASSETS.QUICK_TRADE']}
								</EditWrapper>
							</Link>
						)}
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
				<div className="mb-4">
					<div className="secondary-text">
						<EditWrapper stringId="DIGITAL_ASSETS.PRICE_SOURCE">
							{STRINGS['DIGITAL_ASSETS.PRICE_SOURCE']}:
						</EditWrapper>
					</div>
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
				<Markets selectedSource={selectedSource} />
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		pair: state.app.pair,
		markets: MarketsSelector(state),
    showQuickTrade: state.app.constants.features.quick_trade,
	};
};

export default connect(mapStateToProps)(withConfig(DigitalAssets));
