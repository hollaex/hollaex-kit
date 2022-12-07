import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Checkbox } from 'antd';
import mathjs from 'mathjs';
import {
	HeaderSection,
	EditWrapper,
	IconTitle,
	Image,
	Button,
	Dialog,
} from 'components';
import { openContactForm } from 'actions/appActions';
import { getPrices as getOraclePrices } from 'actions/assetActions';
import {
	calculateOraclePrice,
	formatCurrencyByIncrementalUnit,
} from 'utils/currency';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import {
	BASE_CURRENCY,
	DEFAULT_COIN_DATA,
	CURRENCY_PRICE_FORMAT,
} from 'config/constants';
import DustConfirmation from './components/DustConfirmation';
import DustSuccess from './components/DustSuccess';

const DUST_DEFINITION = {
	quote: 'usdt',
	criterion: 1,
};

const CONVERSION_TO = 'xht';

const DustSection = ({
	goToWallet,
	icons: ICONS,
	coins,
	balances,
	pricesInNative,
}) => {
	const [dustAssets, setDustAssets] = useState([]);
	const [estimatedDust, setEstimatedDust] = useState(0);
	const [prices, setPrices] = useState({});
	const [selectedAssets, setSelectedAssets] = useState([]);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);

	const getPrices = useCallback(async () => {
		try {
			const result = await getOraclePrices({
				coins,
				quote: DUST_DEFINITION.quote,
			});
			setPrices(result);
		} catch (err) {
			console.error(err);
		}
	}, [coins]);

	const calculateDustAssets = () => {
		const dust = {};
		let dustValue = 0;
		Object.entries(coins).forEach(([key, coin = {}]) => {
			const { [`${key}_available`]: balance } = balances;
			const { [key]: price } = prices;
			const { [key]: nativePrice } = pricesInNative;
			const calculatedValue = calculateOraclePrice(balance, price);
			if (
				mathjs.smallerEq(calculatedValue, DUST_DEFINITION.criterion) &&
				mathjs.larger(calculatedValue, 0)
			) {
				dust[key] = { ...coin, balance, calculatedValue };
				dustValue = mathjs.add(dustValue, nativePrice);
			}
		});

		const sortedDustArray = Object.entries(
			dust
		).sort(
			([, { calculatedValue: value_a }], [, { calculatedValue: value_b }]) =>
				value_a < value_b ? 1 : -1
		);
		setDustAssets(sortedDustArray);
		setEstimatedDust(dustValue);
		setSelectedAssets(
			selectedAssets.filter((key) => Object.keys(dust).includes(key))
		);
	};

	useEffect(() => {
		getPrices();
	}, [getPrices]);

	useEffect(() => {
		calculateDustAssets();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [prices, balances, coins]);

	const toggleAsset = (key) => {
		if (selectedAssets.includes(key)) {
			setSelectedAssets((assets) => assets.filter((asset) => asset !== key));
		} else {
			setSelectedAssets((assets) => [...assets, key]);
		}
	};

	const { increment_unit, display_name } =
		coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;

	const { fullname: destination_fullname } =
		coins[CONVERSION_TO] || DEFAULT_COIN_DATA;

	const totalAssets = STRINGS.formatString(
		CURRENCY_PRICE_FORMAT,
		display_name,
		formatCurrencyByIncrementalUnit(estimatedDust, increment_unit)
	);

	const handleConfirm = () => {
		window.alert('confirmed');
	};

	return (
		<div>
			<HeaderSection
				title={STRINGS['DUST.TITLE']}
				openContactForm={openContactForm}
			>
				<div className="header-content">
					<EditWrapper
						stringId="DUST.BACK_TO_WALLET,DUST.BACK"
						renderWrapper={(children) => <div>{children}</div>}
					>
						{STRINGS.formatString(
							STRINGS['DUST.BACK_PLACEHOLDER'],
							<span
								className="blue-link underline-text pointer px-1"
								onClick={goToWallet}
							>
								{STRINGS['DUST.BACK']}
							</span>,
							STRINGS['DUST.BACK_TO_WALLET']
						)}
					</EditWrapper>
				</div>
			</HeaderSection>
			<div className="settings-form-wrapper">
				<div className="settings-form wallet-assets_block">
					<div className="d-flex align-start justify-content-between">
						<div>
							<IconTitle
								stringId="DUST.SECTION.TITLE"
								text={STRINGS['DUST.SECTION.TITLE']}
								textType="title"
								iconPath={ICONS['DUST_TITLE']}
							/>
							<div className="py-4">
								<div>
									<EditWrapper stringId="DUST.SECTION.TEXT_1">
										{STRINGS.formatString(
											STRINGS['DUST.SECTION.TEXT_1'],
											DUST_DEFINITION.criterion,
											<span className="caps">{DUST_DEFINITION.quote}</span>
										)}
									</EditWrapper>
								</div>
								<div>
									<EditWrapper stringId="DUST.SECTION.TEXT_2">
										{STRINGS.formatString(
											STRINGS['DUST.SECTION.TEXT_2'],
											<span className="caps">{CONVERSION_TO}</span>,
											destination_fullname
										)}
									</EditWrapper>
								</div>
							</div>
						</div>
						<div>
							<div>
								<Image
									iconId="DUST_TITLE"
									icon={ICONS['DUST_TITLE']}
									// wrapperClassName="currency-ball"
									// imageWrapperClassName="currency-ball-image-wrapper"
								/>
							</div>
							<EditWrapper stringId="DUST.ESTIMATED_TOTAL">
								<div className="dust-estimated-balance">
									{BASE_CURRENCY && (
										<div>
											<div className="bold">
												{STRINGS['DUST.ESTIMATED_TOTAL']}
											</div>
											<div className="caps">{totalAssets}</div>
										</div>
									)}
								</div>
							</EditWrapper>
						</div>
					</div>

					<table className="wallet-assets_block-table">
						<thead>
							<tr className="table-bottom-border">
								<td />
								<td />
								<td />
								<td />
							</tr>
						</thead>
						<tbody>
							{dustAssets.map(
								([key, { fullname, balance, icon_id } = DEFAULT_COIN_DATA]) => {
									return (
										<tr key={key} className="table-bottom-border">
											<td>
												<Checkbox
													checked={selectedAssets.includes(key)}
													onChange={() => toggleAsset(key)}
												/>
											</td>
											<td className="table-icon td-fit" />
											<td className="td-name td-fit">
												<div className="d-flex align-items-center">
													<Image
														iconId={icon_id}
														icon={ICONS[icon_id]}
														wrapperClassName="currency-ball"
														imageWrapperClassName="currency-ball-image-wrapper"
													/>
													<div>{fullname}</div>
												</div>
											</td>
											<td className="caps td-amount">{`${balance} ${key}`}</td>
										</tr>
									);
								}
							)}
						</tbody>
					</table>
				</div>
				<div className="d-flex align-center justify-content-center">
					<div>
						<EditWrapper stringId="DUST.CONVERT_ALL" />
						<Button
							className="caps"
							// disabled={!selectedAssets.length}
							disabled={true}
							label={STRINGS['DUST.CONVERT_ALL']}
							onClick={() => setShowConfirmation(true)}
						/>
					</div>
				</div>
			</div>

			<Dialog
				isOpen={showConfirmation || showSuccess}
				label="dust-modal"
				onCloseDialog={() => {
					setShowConfirmation(false);
					setShowSuccess(false);
				}}
			>
				{showConfirmation && (
					<DustConfirmation
						dustAssets={dustAssets}
						selectedAssets={selectedAssets}
						onConfirm={handleConfirm}
						onBack={() => setShowConfirmation(false)}
						definition={DUST_DEFINITION}
						conversion={CONVERSION_TO}
					/>
				)}
				{showSuccess && <DustSuccess onBack={() => setShowSuccess(false)} />}
			</Dialog>
		</div>
	);
};

const mapStateToProps = (state) => ({
	coins: state.app.coins,
	balances: state.user.balance,
	pricesInNative: state.asset.oraclePrices,
});

const mapDispatchToProps = (dispatch) => ({
	openContactForm: bindActionCreators(openContactForm, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(DustSection));
