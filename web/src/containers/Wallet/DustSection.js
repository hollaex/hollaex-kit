import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Checkbox } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
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
import { DEFAULT_COIN_DATA, CURRENCY_PRICE_FORMAT } from 'config/constants';
import DustConfirmation from './components/DustConfirmation';
import DustSuccess from './components/DustSuccess';
import { convertDust, getEstimatedDust } from 'actions/walletActions';

const DUST_DEFINITION = {
	quote: 'usdt',
	criterion: 1,
};

const DustSection = ({
	goToWallet,
	icons: ICONS,
	coins,
	balances,
	dust: { quote = 'xht' } = { quote: 'xht' },
	pricesInNative,
}) => {
	const [dustAssets, setDustAssets] = useState([]);
	const [initialized, setInitialized] = useState(false);
	const [estimatedDust, setEstimatedDust] = useState(0);
	const [
		pricesInDustDefinitionQuote,
		setPricesInDustDefinitionQuote,
	] = useState({});
	const [pricesInDustQuote, setPricesInDustQuote] = useState({});
	const [selectedAssets, setSelectedAssets] = useState([]);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [loadingEstimations, setLoadingEstimations] = useState(false);
	const [estimationData, setEstimationData] = useState([]);
	const [loadingResult, setLoadingResult] = useState(false);
	const [result, setResult] = useState();
	const [error, setError] = useState();

	const getPrices = useCallback(async () => {
		try {
			const response = await Promise.all([
				getOraclePrices({
					coins,
					quote: DUST_DEFINITION.quote,
				}),
				getOraclePrices({
					coins,
					quote: quote,
				}),
			]);
			setPricesInDustDefinitionQuote(response[0]);
			setPricesInDustQuote(response[1]);
			setInitialized(true);
		} catch (err) {
			console.error(err);
			setInitialized(true);
		}
	}, [coins, quote]);

	const calculateDustAssets = () => {
		const dust = {};
		let dustValue = 0;
		Object.entries(coins).forEach(([key, coin = {}]) => {
			const { [`${key}_available`]: balance } = balances;
			const { [key]: price = 0 } = pricesInDustDefinitionQuote;
			const { [key]: conversionPrice = 0 } = pricesInDustQuote;
			const calculatedValue = calculateOraclePrice(balance, price);
			const convertedValue = calculateOraclePrice(balance, conversionPrice);
			if (
				mathjs.smallerEq(calculatedValue, DUST_DEFINITION.criterion) &&
				mathjs.larger(convertedValue, 0)
			) {
				dust[key] = { ...coin, balance, calculatedValue, convertedValue };
				dustValue = mathjs.add(dustValue, convertedValue);
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
	}, [getPrices, pricesInNative]);

	useEffect(() => {
		calculateDustAssets();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pricesInDustQuote, pricesInDustDefinitionQuote, balances, coins]);

	const toggleAsset = (key) => {
		if (selectedAssets.includes(key)) {
			setSelectedAssets((assets) => assets.filter((asset) => asset !== key));
		} else {
			setSelectedAssets((assets) => [...assets, key]);
		}
	};

	const { fullname: destination_fullname, increment_unit, display_name } =
		coins[quote] || DEFAULT_COIN_DATA;

	const totalAssets = STRINGS.formatString(
		CURRENCY_PRICE_FORMAT,
		display_name,
		formatCurrencyByIncrementalUnit(estimatedDust, increment_unit)
	);

	const handleConvert = () => {
		setLoadingEstimations(true);
		getEstimatedDust(selectedAssets)
			.then(({ data = [] }) => {
				setEstimationData(data);
				setShowConfirmation(true);
			})
			.catch((err) => {
				const _error =
					err.response && err.response.data
						? err.response.data.message
						: err.message;
				setEstimationData([]);
				setError(_error);
				setTimeout(setError, 4000);
			})
			.finally(() => {
				setLoadingEstimations(false);
			});
	};

	const handleConfirm = () => {
		setLoadingResult(true);
		convertDust(selectedAssets)
			.then(({ data = [] }) => {
				const convertedAssets = data.filter(({ error }) => !error);
				const failedAssets = data.filter(({ error }) => error);

				if (!convertedAssets.length) {
					setResult();
					setShowConfirmation(false);
					setShowSuccess(false);
					setError(failedAssets);
					setTimeout(setError, 4000);
				} else {
					let total = 0;
					convertedAssets.forEach(({ size = 0, price = 0 }) => {
						total = mathjs.add(total, calculateOraclePrice(size, price));
					});
					setResult({ total, error: failedAssets });
					setShowConfirmation(false);
					setShowSuccess(true);
				}
			})
			.catch((err) => {
				const _error =
					err.response && err.response.data
						? err.response.data.message
						: err.message;
				setResult();
				setShowConfirmation(false);
				setShowSuccess(false);
				setError(_error);
				setTimeout(setError, 4000);
			})
			.finally(() => {
				setLoadingResult(false);
			});
	};

	const renderError = () => {
		if (Array.isArray(error)) {
			return (
				<Fragment>
					{error.map(({ symbol, error: message }) => (
						<div key={symbol} className="warning_text">
							<span className="caps">{symbol}</span>
							<span className="px-2">{message}</span>
						</div>
					))}
				</Fragment>
			);
		} else {
			return <div className="warning_text">{error}</div>;
		}
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
								textType="title bold"
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
											<span className="caps">{quote}</span>,
											destination_fullname
										)}
									</EditWrapper>
								</div>
							</div>
						</div>
						<div>
							<div className="d-flex justify-content-end">
								<Image
									iconId="DUST_TITLE"
									icon={ICONS['DUST_TITLE']}
									wrapperClassName="dust-image-title-wrapper"
									imageWrapperClassName="dust-image-title-wrapper"
								/>
							</div>
							<EditWrapper stringId="DUST.ESTIMATED_TOTAL">
								<div className="dust-estimated-balance">
									{quote && (
										<div>
											<div className="bold">
												{STRINGS['DUST.ESTIMATED_TOTAL']}
											</div>
											<div className="caps">
												{initialized ? totalAssets : <LoadingOutlined />}
											</div>
										</div>
									)}
								</div>
							</EditWrapper>
						</div>
					</div>

					{initialized ? (
						<Fragment>
							{dustAssets.length ? (
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
											([
												key,
												{ fullname, balance, icon_id } = DEFAULT_COIN_DATA,
											]) => {
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
							) : (
								<div className="d-flex align-center justify-content-center py-5">
									<EditWrapper stringId="DUST.NO_DUST">
										{STRINGS['DUST.NO_DUST']}
									</EditWrapper>
								</div>
							)}
						</Fragment>
					) : (
						<div className="d-flex align-center justify-content-center py-5">
							<LoadingOutlined className="font-title" />
						</div>
					)}

					{error && renderError()}
				</div>
				<div className="d-flex align-center justify-content-center my-4">
					<div>
						<EditWrapper stringId="DUST.CONVERT_ALL" />
						<Button
							className="caps dust-convert-button"
							disabled={!selectedAssets.length || loadingEstimations}
							label={STRINGS['DUST.CONVERT_ALL']}
							onClick={handleConvert}
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
						onConfirm={handleConfirm}
						onBack={() => setShowConfirmation(false)}
						definition={DUST_DEFINITION}
						quote={quote}
						coins={coins}
						data={estimationData}
						loading={loadingResult}
					/>
				)}
				{showSuccess && (
					<DustSuccess
						onBack={() => setShowSuccess(false)}
						quote={quote}
						coins={coins}
						data={result}
					/>
				)}
			</Dialog>
		</div>
	);
};

const mapStateToProps = (state) => ({
	coins: state.app.coins,
	balances: state.user.balance,
	pricesInNative: state.asset.oraclePrices,
	dust: state.app.constants.dust,
});

const mapDispatchToProps = (dispatch) => ({
	openContactForm: bindActionCreators(openContactForm, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(DustSection));
