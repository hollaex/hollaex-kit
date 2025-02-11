import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import { Link } from 'react-router';
import { isMobile } from 'react-device-detect';
import { CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { DEFAULT_URL } from 'config/constants';
import {
	MobileBarWrapper,
	EditWrapper,
	ButtonLink,
	Image,
	Dialog,
	Button,
} from 'components';
import { isLoggedIn } from 'utils/token';
import {
	getTickers,
	changeTheme,
	setLanguage,
	setDepositAndWithdraw,
	setSelectedAnnouncement,
	setIsActiveSelectedAnnouncement,
} from 'actions/appActions';
import { updateUserSettings, setUserData } from 'actions/userAction';
import { generateLanguageFormValues } from 'containers/UserSettings/LanguageForm';
import { LanguageDisplayPopup, renderAnnouncementMessage } from './Utils';
import { formatToFixed } from 'utils/currency';
import { marketPriceSelector } from 'containers/Trade/utils';
import { getFormattedDate } from 'utils/string';
import ThemeSwitcher from './ThemeSwitcher';
import withEdit from 'components/EditProvider/withEdit';
import withConfig from 'components/ConfigProvider/withConfig';
import STRINGS from 'config/localizedStrings';
import Connections from './Connections';
import AccountTab from './AccountTab';
import AnnouncementList from './AnnouncementList';

class AppBar extends Component {
	state = {
		securityPending: 0,
		verificationPending: 0,
		walletPending: 0,
		selected: '',
		isDisplayLanguagePopup: false,
		isTopbarAnnouncement: false,
		isPopupAnnouncement: false,
		selectedPopupAnnouncement: {},
		selectedTopbarAnnouncement: {},
	};

	componentDidMount() {
		const { getAnnouncementDetails } = this.props;
		if (this.props.user) {
			this.checkVerificationStatus(this.props.user, this.props.enabledPlugins);
			this.checkWalletStatus(this.props.user, this.props.coins);
		}
		this.props.getTickers();
		if (this.props.theme) {
			this.setSelectedTheme(this.props.theme);
		}
		this.setState({
			title: document?.title ? document?.title : '',
		});

		const filteredPopupAnnouncementDetails = getAnnouncementDetails
			?.filter((data) => data?.is_popup)
			?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

		const filteredTopbarAnnouncementDetails = getAnnouncementDetails
			?.filter((data) => data?.is_navbar)
			?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

		const popupAnnouncementDetail =
			filteredPopupAnnouncementDetails && filteredPopupAnnouncementDetails[0];

		const topbarAnnouncementDetail =
			filteredTopbarAnnouncementDetails && filteredTopbarAnnouncementDetails[0];

		const getPopupId = JSON.parse(localStorage.getItem('announcementPopup'));
		if (!getPopupId) {
			localStorage.setItem('announcementPopup', JSON.stringify([]));
		}
		const isPopup = getPopupId || [];

		const isDisplayPopup =
			popupAnnouncementDetail?.is_popup &&
			((!popupAnnouncementDetail.start_date &&
				!popupAnnouncementDetail.end_date) ||
				this.isTodayBetweenDates(
					popupAnnouncementDetail.start_date,
					popupAnnouncementDetail.end_date
				));

		const isDisplayTopbar =
			topbarAnnouncementDetail?.is_navbar &&
			((!topbarAnnouncementDetail.start_date &&
				!topbarAnnouncementDetail.end_date) ||
				this.isTodayBetweenDates(
					topbarAnnouncementDetail.start_date,
					topbarAnnouncementDetail.end_date
				));

		this.setState({
			selectedPopupAnnouncement: filteredPopupAnnouncementDetails[0],
			selectedTopbarAnnouncement: filteredTopbarAnnouncementDetails[0],
		});

		if (isLoggedIn()) {
			this.setState({
				isTopbarAnnouncement: isDisplayTopbar,
				isPopupAnnouncement:
					!isPopup.includes(filteredPopupAnnouncementDetails[0]?.id) &&
					isDisplayPopup,
			});
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (JSON.stringify(this.props.user) !== JSON.stringify(nextProps.user)) {
			this.checkVerificationStatus(nextProps.user, nextProps.enabledPlugins);
			this.checkWalletStatus(nextProps.user, nextProps.coins);
		}
	}

	isTodayBetweenDates = (startDate, endDate) => {
		const today = new Date();
		const start = new Date(startDate);
		const end = new Date(endDate);
		return today >= start && today <= end;
	};

	componentDidUpdate(prevProps) {
		const { pair, pairs, lastPrice, isProTrade, isQuickTrade } = this.props;
		const { increment_price } = pairs[pair] || { pair_base: '', pair_2: '' };
		const price = formatToFixed(lastPrice, increment_price);
		if (prevProps.theme !== this.props.theme) {
			this.setSelectedTheme(this.props.theme);
		}
		if (isProTrade) {
			document.title = `${price} | ${pair?.toUpperCase()} | HollaEx Pro`;
		} else if (isQuickTrade) {
			const pairData = pair.split('-');
			const firstAsset = pairData[0];
			const secondAsset = pairData[1];
			document.title = `${
				STRINGS['CONVERT']
			} ${firstAsset?.toUpperCase()} ${STRINGS[
				'TO'
			]?.toLowerCase()} ${secondAsset?.toUpperCase()} | HollaEx Pro`;
		} else {
			document.title = this.state.title;
		}
	}

	setSelectedTheme = (theme) => {
		const { themeOptions } = this.props;
		const selected = (
			themeOptions.find(({ value }) => value === theme) || themeOptions[0]
		).value;
		this.setState({ selected });
	};

	checkVerificationStatus = (user, enabledPlugins) => {
		let userData = user.userData || {};
		if (!Object.keys(userData).length && user.id) {
			userData = user;
		}
		const { phone_number, id_data = {}, bank_account = [] } = userData;
		let securityPending = 0;
		let verificationPending = 0;
		if (user.id) {
			if (!user.otp_enabled) {
				securityPending += 1;
			}

			if (
				(id_data.status === 0 || id_data.status === 2) &&
				enabledPlugins.includes('kyc')
			) {
				verificationPending += 1;
			}
			if (!phone_number && enabledPlugins.includes('sms')) {
				verificationPending += 1;
			}
			if (
				bank_account.filter((acc) => acc.status === 0 || acc.status === 2)
					.length === bank_account.length &&
				enabledPlugins.includes('bank')
			) {
				verificationPending += 1;
			}
			this.setState({ securityPending, verificationPending });
		}
	};

	checkWalletStatus = (user, coins) => {
		let walletPending = false;
		if (user.balance) {
			walletPending = true;
			Object.keys(coins).forEach((pair) => {
				if (user.balance[`${pair.toLowerCase()}_balance`] > 0) {
					walletPending = false;
				}
			});
		}
		this.setState({ walletPending: walletPending ? 1 : 0 });
	};

	handleTheme = (selected) => {
		const { isEditMode, themeOptions } = this.props;
		const params = new URLSearchParams(window.location.search);
		if (!isLoggedIn() || isEditMode) {
			this.props.changeTheme(selected);
			localStorage.setItem('theme', selected);
		} else {
			const { settings = { interface: {} } } = this.props.user;
			const settingsObj = { interface: { ...settings.interface } };
			const theme = (
				themeOptions.find(({ value }) => value === selected) || themeOptions[0]
			).value;
			settingsObj.interface.theme = theme;
			return updateUserSettings(settingsObj)
				.then(({ data }) => {
					this.props.setUserData(data);
					if (data.settings && data.settings.interface) {
						params.set('theme', data.settings.interface.theme);
						const currentUrl = window.location.href.split('?')[0];
						const newUrl = `${currentUrl}?${params.toString()}`;
						this.props.router.replace(newUrl);
						this.props.changeTheme(data.settings.interface.theme);
						localStorage.setItem('theme', data.settings.interface.theme);
					}
				})
				.catch((err) => {
					const error = { _error: err.message };
					if (err.response && err.response.data) {
						error._error = err.response.data.message;
					}
				});
		}
	};

	renderIcon = () => {
		const { icons: ICONS, isEditMode } = this.props;
		return (
			<div
				className={classnames(
					'app_bar-icon',
					'text-uppercase',
					'h-100',
					'ml-3'
				)}
			>
				<div className="d-flex h-100">
					<Link
						to={DEFAULT_URL}
						className={classnames({ 'disabled-link': isEditMode }, 'h-100')}
					>
						<Image
							iconId="EXCHANGE_LOGO"
							icon={ICONS['EXCHANGE_LOGO']}
							wrapperClassName="app_bar-icon-logo h-100"
						/>
					</Link>
					<EditWrapper iconId="EXCHANGE_LOGO" position={[-5, 5]} />
				</div>
			</div>
		);
	};

	goTo = (path) => () => {
		this.props.router.push(path);
	};

	onToggle = (theme) => {
		this.setSelectedTheme(theme);
		this.handleTheme(theme);
	};

	renderHomeIcon = () => {
		const { icons: ICONS } = this.props;
		return (
			<div className={classnames('app_bar-icon', 'text-uppercase', 'h-100')}>
				<div className="d-flex h-100">
					<div className="h-100">
						<Image
							iconId="EXCHANGE_LOGO"
							icon={ICONS['EXCHANGE_LOGO']}
							wrapperClassName="app_bar-icon-logo wide-logo h-100"
						/>
					</div>
					<EditWrapper iconId="EXCHANGE_LOGO" position={[-5, 5]} />
				</div>
			</div>
		);
	};

	renderButtonSection = () => {
		return (
			<div className="d-flex align-items-center buttons-section-header">
				<ButtonLink
					link={'/login'}
					type="button"
					label={STRINGS['LOGIN_TEXT']}
					className="main-section_button_invert home_header_button"
				/>
				<div style={{ width: '0.75rem' }} />
				<ButtonLink
					link={'/signup'}
					type="button"
					label={STRINGS['SIGNUP_TEXT']}
					className="main-section_button home_header_button"
				/>
			</div>
		);
	};

	renderAccountButton = () => {
		const { user } = this.props;
		return (
			<div className="pointer" onClick={this.goTo('/account')}>
				{user.email}
			</div>
		);
	};

	onHandleDeposit = () => {
		const { setDepositAndWithdraw, router } = this.props;
		setDepositAndWithdraw(true);
		router.push('/wallet/deposit');
	};

	onHandleClose = () => {
		this.setState({
			isDisplayLanguagePopup: false,
		});
	};

	onHandleOpenPopup = () => {
		this.setState({ isDisplayLanguagePopup: true });
	};

	onHandleRouteAnnouncement = (text) => {
		const {
			setSelectedAnnouncement,
			setIsActiveSelectedAnnouncement,
			router,
		} = this.props;
		const {
			selectedPopupAnnouncement,
			selectedTopbarAnnouncement,
		} = this.state;

		const storedAnnouncements =
			JSON.parse(localStorage.getItem('announcementPopup')) || [];

		if (text === 'topbar view more') {
			setSelectedAnnouncement(selectedTopbarAnnouncement);
			setIsActiveSelectedAnnouncement(true);
		}
		if (text === 'popup') {
			setSelectedAnnouncement(selectedPopupAnnouncement);
			setIsActiveSelectedAnnouncement(true);
			this.setState({
				isPopupAnnouncement: false,
			});

			if (!storedAnnouncements?.includes(selectedPopupAnnouncement?.id)) {
				storedAnnouncements.push(selectedPopupAnnouncement?.id);
				localStorage.setItem(
					'announcementPopup',
					JSON.stringify(storedAnnouncements)
				);
			}
		}
		if (text === 'topbar announcements') {
			setIsActiveSelectedAnnouncement(false);
		}
		router.push('/announcement');
	};

	renderAnnouncementPopup = () => {
		const { icons, constants } = this.props;
		const { selectedPopupAnnouncement } = this.state;

		const onHandleClose = () => {
			this.setState({
				isPopupAnnouncement: false,
			});
		};

		return (
			<Dialog
				isOpen={
					this.state.isPopupAnnouncement && constants?.features?.announcement
				}
				onCloseDialog={() => onHandleClose()}
				shouldCloseOnOverlayClick={false}
				className={
					isMobile
						? 'announcement-popup-wrapper announcement-popup-mobile-wrapper'
						: 'announcement-popup-wrapper'
				}
			>
				<div className="announcement-popup-container">
					<EditWrapper stringId="ANNOUNCEMENT_TAB.ANNOUNCEMENT_TITLE">
						<span className="announcement-title">
							{STRINGS['ANNOUNCEMENT_TAB.ANNOUNCEMENT_TITLE']?.toUpperCase()}
						</span>
					</EditWrapper>
					<div className="announcement-exchange-title">
						<Image
							icon={icons['ANNOUNCEMENT_ICON']}
							wrapperClassName="announcement-icon"
						/>
						<span className="text-white font-weight-bold exchange-update-title">
							{selectedPopupAnnouncement?.title}
						</span>
						<span className="announcement-date secondary-text">
							({getFormattedDate(selectedPopupAnnouncement?.created_at)})
						</span>
					</div>
					{renderAnnouncementMessage(selectedPopupAnnouncement?.message, 120)}
					<span
						className="blue-link text-decoration-underline pointer"
						onClick={() => {
							this.onHandleRouteAnnouncement('popup');
						}}
					>
						{STRINGS['CHAT.READ_MORE'].toUpperCase()}
					</span>
					<div className="d-flex button-container announcement-popup-buttons pt-4">
						<Button
							label={STRINGS['CLOSE_TEXT']?.toUpperCase()}
							className="back-btn mt-3"
							onClick={() => onHandleClose()}
						/>
						<Button
							label={STRINGS['VIEW']?.toUpperCase()}
							className="back-btn mt-3"
							onClick={() => this.onHandleRouteAnnouncement('popup')}
						/>
					</div>
				</div>
			</Dialog>
		);
	};

	renderAnnouncementTopbar = () => {
		const { icons } = this.props;
		const { selectedTopbarAnnouncement } = this.state;
		return (
			<div className="app_bar announcement-top-bar">
				<Image
					icon={icons['ANNOUNCEMENT_ICON']}
					wrapperClassName="h-100 announcement-icon"
				/>
				<span className="announcement-title">
					{selectedTopbarAnnouncement?.title}
				</span>
				{renderAnnouncementMessage(
					selectedTopbarAnnouncement?.message,
					isMobile ? 40 : 75
				)}
				<EditWrapper stringId="HOLLAEX_TOKEN.VIEW">
					<span
						className="view-more-btn blue-link text-decoration-underline"
						onClick={() => this.onHandleRouteAnnouncement('topbar view more')}
					>
						{STRINGS['REFERRAL_LINK.VIEW']}
					</span>
				</EditWrapper>
				<CloseCircleOutlined
					className="close-icon"
					onClick={() =>
						this.setState({
							isTopbarAnnouncement: false,
						})
					}
				/>
			</div>
		);
	};

	render() {
		const {
			user,
			constants: { valid_languages } = {},
			constants = {},
			children,
			activePath,
			onMenuChange,
			// menuItems,
			router,
			isHome,
			activeLanguage,
			changeLanguage,
			icons,
			themeOptions,
			selectable_native_currencies,
			setUserData,
			coins,
		} = this.props;
		const {
			securityPending,
			verificationPending,
			// walletPending,
			selected,
			isTopbarAnnouncement,
		} = this.state;
		const languageFormValue = generateLanguageFormValues(valid_languages)
			?.language?.options;
		return isHome ? (
			<div className="home_app_bar d-flex justify-content-between align-items-center">
				<div className="d-flex align-items-center justify-content-center h-100 ml-2">
					{this.renderHomeIcon()}
				</div>
				<div className="mr-2">
					{isLoggedIn()
						? this.renderAccountButton()
						: this.renderButtonSection()}
				</div>
			</div>
		) : isMobile ? (
			<div className="d-flex flex-column app-mobile-bar-wrapper">
				{isTopbarAnnouncement &&
					constants?.features?.announcement &&
					isLoggedIn() &&
					this.renderAnnouncementTopbar()}
				<MobileBarWrapper
					className={classnames(
						'd-flex',
						'app_bar-mobile',
						'align-items-center',
						'justify-content-center'
					)}
				>
					<Link to="/">
						<div
							style={{
								backgroundImage: `url(${constants.logo_image})`,
							}}
							className="homeicon-svg"
						/>
					</Link>
					{isLoggedIn() && this.renderAnnouncementPopup()}
				</MobileBarWrapper>
			</div>
		) : (
			<div>
				{isTopbarAnnouncement &&
					constants?.features?.announcement &&
					isLoggedIn() &&
					this.renderAnnouncementTopbar()}
				<div
					className={classnames('app_bar d-flex justify-content-between', {
						'no-borders': false,
					})}
				>
					<div className="d-flex align-items-center">
						<div
							id="home-nav-container"
							className="d-flex align-items-center justify-content-center h-100"
						>
							{this.renderIcon()}
						</div>

						<Fragment>{children}</Fragment>
					</div>
					{!isLoggedIn() && (
						<div id="trade-nav-container" className="mx-2">
							{languageFormValue
								?.filter(({ value }) => value === activeLanguage)
								?.map(({ value, icon, label }) => (
									<div
										className="language_option"
										onClick={() => this.onHandleOpenPopup()}
									>
										<Image
											icon={icon}
											alt={label}
											wrapperClassName="flag-icon mr-2"
										/>
										<span className="caps">
											{value}
											{user?.settings?.interface?.display_currency && (
												<span>
													{' '}
													/ {user?.settings?.interface?.display_currency}
												</span>
											)}
										</span>
									</div>
								))}
							{this.state?.isDisplayLanguagePopup && (
								<LanguageDisplayPopup
									selected={activeLanguage}
									valid_languages={valid_languages}
									changeLanguage={changeLanguage}
									isVisible={this.state?.isDisplayLanguagePopup}
									onHandleClose={this.onHandleClose}
									selectable_native_currencies={selectable_native_currencies}
									setUserData={setUserData}
									user={user}
									coins={coins}
								/>
							)}
							<ThemeSwitcher
								selected={selected}
								options={themeOptions}
								toggle={this.onToggle}
							/>
							<div
								className="login-container"
								onClick={() => router.push('/login')}
							>
								{STRINGS['LOGIN_TEXT'].toUpperCase()}
							</div>
						</div>
					)}
					{isLoggedIn() && (
						<div
							id="trade-nav-container"
							className="d-flex app-bar-account justify-content-end trade-navbar-wrapper"
						>
							{this.renderAnnouncementPopup()}
							<div
								className="app-bar-deposit-btn d-flex"
								onClick={this.onHandleDeposit}
							>
								<Image
									iconId={'DEPOSIT_TITLE'}
									icon={icons['DEPOSIT_TITLE']}
									wrapperClassName="form_currency-ball margin-aligner"
								/>
								<span className="ml-2">
									{STRINGS['ACCORDIAN.DEPOSIT_LABEL']}
								</span>
							</div>
							<div className="d-flex app_bar-quicktrade-container language-content">
								{languageFormValue
									?.filter(({ value }) => value === activeLanguage)
									?.map(({ value, icon, label }) => (
										<div
											key={value}
											className="language_option"
											onClick={() => this.onHandleOpenPopup()}
										>
											<Image
												icon={icon}
												alt={label}
												wrapperClassName="flag-icon mr-2"
											/>
											<span className="caps">
												{value}
												{user?.settings?.interface?.display_currency && (
													<span>
														/{user?.settings?.interface?.display_currency}
													</span>
												)}
											</span>
										</div>
									))}
								{this.state.isDisplayLanguagePopup && (
									<LanguageDisplayPopup
										selected={activeLanguage}
										valid_languages={valid_languages}
										changeLanguage={changeLanguage}
										isVisible={this.state.isDisplayLanguagePopup}
										onHandleClose={this.onHandleClose}
										selectable_native_currencies={selectable_native_currencies}
										setUserData={setUserData}
										user={user}
										coins={coins}
									/>
								)}
							</div>
							<div className="d-flex app_bar-quicktrade-container">
								<ThemeSwitcher
									selected={selected}
									options={themeOptions}
									toggle={this.onToggle}
								/>
							</div>
							{constants?.features?.announcement && (
								<AnnouncementList user={user.email} />
							)}
							{/* <MenuList
							menuItems={menuItems}
							securityPending={securityPending}
							verificationPending={verificationPending}
							walletPending={walletPending}
							user={user}
							activePath={activePath}
							onMenuChange={onMenuChange}
						/> */}
							<AccountTab
								user={user}
								securityPending={securityPending}
								verificationPending={verificationPending}
							/>
							<Connections />
							<div
								className={
									activePath === '/details'
										? 'active-menu app-bar-search-icon'
										: 'app-bar-search-icon'
								}
								onClick={() => onMenuChange('/details')}
							>
								<SearchOutlined />
							</div>
						</div>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		theme: state.app.theme,
		pair: state.app.pair,
		pairs: state.app.pairs,
		coins: state.app.coins,
		enabledPlugins: state.app.enabledPlugins,
		constants: state.app.constants,
		activeLanguage: state.app.language,
		selectable_native_currencies:
			state.app.constants.selectable_native_currencies,
		lastPrice: marketPriceSelector(state),
		isProTrade: state.app.isProTrade,
		isQuickTrade: state.app.isQuickTrade,
		getAnnouncementDetails: state.app.announcements,
	};
};

const mapDispatchToProps = (dispatch) => ({
	getTickers: bindActionCreators(getTickers, dispatch),
	changeTheme: bindActionCreators(changeTheme, dispatch),
	setUserData: bindActionCreators(setUserData, dispatch),
	changeLanguage: bindActionCreators(setLanguage, dispatch),
	setDepositAndWithdraw: bindActionCreators(setDepositAndWithdraw, dispatch),
	setSelectedAnnouncement: bindActionCreators(
		setSelectedAnnouncement,
		dispatch
	),
	setIsActiveSelectedAnnouncement: bindActionCreators(
		setIsActiveSelectedAnnouncement,
		dispatch
	),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withEdit(withConfig(AppBar)));
