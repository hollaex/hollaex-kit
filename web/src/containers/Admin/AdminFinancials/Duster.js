import React, { Fragment, useState, useEffect } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ReactSVG } from 'react-svg';
import { Select, Switch, Modal, Button, message } from 'antd';

import { updateConstants } from 'containers/Admin/General/action';
import { setConfig } from 'actions/appActions';
import { STATIC_ICONS } from 'config/icons';
import { handleFiatUpgrade as handleDustUpgrade } from 'utils/utils';

const Duster = ({
	info,
	coins,
	setConfig,
	dust = { quote: 'xht' },
	nativeCurrency,
}) => {
	const [openConfirmation, setOpenConfirmation] = useState();
	const [isCustom, setIsCustom] = useState(false);
	const [custom, setCustom] = useState();
	const [submitting, setSubmitting] = useState(false);
	const isDustUpgrade = handleDustUpgrade(info);

	const toggleCustomSwitch = () => setIsCustom((prevState) => !prevState);

	const handleConfirm = () => {
		setSubmitting(true);
		updateConstants({ kit: { dust: { quote: isCustom ? custom : 'xht' } } })
			.then((res) => {
				setConfig(res.kit);
				setOpenConfirmation(false);
				message.success('Updated successfully');
				setSubmitting(false);
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				setOpenConfirmation(false);
				message.error(error);
				setSubmitting(false);
			});
	};

	useEffect(() => {
		if (dust.quote === 'xht') {
			setIsCustom(false);

			if (!custom) {
				if (nativeCurrency && nativeCurrency !== 'xht') {
					setCustom(nativeCurrency);
				} else {
					const firstCoin = Object.entries(coins)[0][0];
					setCustom(firstCoin);
				}
			}
		} else {
			setIsCustom(true);
			setCustom(dust.quote);
		}
	}, [dust, coins, custom, nativeCurrency]);

	return (
		<div className="app_container-content">
			<div>
				<div className="d-flex align-items-center justify-content-between">
					<div className="d-flex align-items-center">
						<ReactSVG
							src={STATIC_ICONS['DUST_CONVERTER']}
							className="admin-wallet-icon"
						/>
						<div className="title">Wallet dust converter</div>
					</div>
				</div>
				<div className="description-width">
					Set what your users will convert their small crypto balances to.
				</div>
			</div>

			<Fragment>
				{isDustUpgrade && (
					<div className="d-flex">
						<div className="d-flex align-items-center justify-content-between upgrade-section mt-2 mb-5">
							<div>
								<div className="font-weight-bold">Custom dust converter</div>
								<div>Change the converter to your custom asset</div>
							</div>
							<div className="ml-5 button-wrapper">
								<a
									href="https://dash.bitholla.com/billing"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Button type="primary" className="w-100">
										Upgrade Now
									</Button>
								</a>
							</div>
						</div>
					</div>
				)}
			</Fragment>

			<div className="admin-chat-feature-wrapper pt-4">
				<div className={classnames({ 'disabled-area': isDustUpgrade })}>
					<div className="switch-wrapper m-1">
						<div className="d-flex">
							<span
								className={
									!isCustom ? 'switch-label' : 'switch-label label-inactive'
								}
							>
								HollaEx Token (XHT)
							</span>
							<Switch
								checked={isCustom}
								onClick={toggleCustomSwitch}
								className="mx-2"
							/>
							<span
								className={
									isCustom ? 'switch-label' : 'switch-label label-inactive'
								}
							>
								<div>
									<div>Custom</div>
									<Select
										onChange={setCustom}
										size="small"
										value={custom}
										className="mb-2"
										style={{ width: '15rem' }}
										disabled={!isCustom}
									>
										{Object.entries(coins)
											.filter(([key]) => key?.toUpperCase() !== 'XHT')
											.map(([key, { fullname }]) => (
												<Select.Option value={key} key={key}>
													<div className="ml-1">{`${fullname} (${key?.toUpperCase()})`}</div>
												</Select.Option>
											))}
									</Select>
								</div>
							</span>
						</div>
					</div>

					<Button
						type="primary"
						onClick={() => setOpenConfirmation(true)}
						disabled={isDustUpgrade || (isCustom && !custom)}
						size="large"
						className="green-btn minimal-btn my-3"
					>
						Save
					</Button>
				</div>
			</div>

			<Modal
				visible={openConfirmation}
				footer={null}
				closable={false}
				onCancel={() => setOpenConfirmation(false)}
			>
				<div className="apply-confirm-container">
					<div className="dust-cofirmation_title">Change dust conversion</div>
					<div className="pt-3 pb-5">
						The asset you want the duster to convert to will be changed. Please
						check the details are correct below.
					</div>
					<div className="dust-cofirmation-details p-4">
						<div className="dust-cofirmation-details_title px-2">
							Check & Confirm
						</div>
						<div>
							<span className="bold">Convert assets to:</span>{' '}
							{isCustom
								? `${coins?.[custom]?.fullname} (${custom?.toUpperCase()})`
								: `${coins?.['xht']?.fullname} (XHT)`}
						</div>
					</div>
					<div className="btn-wrapper">
						<Button
							type="primary"
							className="apply-btn"
							onClick={() => setOpenConfirmation(false)}
						>
							Back
						</Button>
						<div className="separator"></div>
						<Button
							type="primary"
							className="apply-btn"
							onClick={handleConfirm}
							loading={submitting}
						>
							Confirm
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

const mapStateToProps = (state) => ({
	info: state.app.constants.info,
	coins: state.app.coins,
	dust: state.app.constants.dust,
	nativeCurrency: state.app.constants.native_currency,
});

const mapDispatchToProps = (dispatch) => ({
	setConfig: bindActionCreators(setConfig, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Duster);
