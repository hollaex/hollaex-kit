import React, { Component } from 'react';
import { Switch, Button, Modal, message, Spin, Input } from 'antd';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';

import FooterConfig from './FooterConfig';
import Description from './Description';
import InterfaceForm from './InterfaceForm';
import EmailVerificationForm from './EmailVerificationForm';
import DisableSignupsConfirmation from './DisableSignupsConfirmation';
import { EmailSettingsForm } from '../Settings/SettingsForm';
import { AdminHocForm } from '../../../components';
import Image from '../../../components/Image';
import withConfig from '../../../components/ConfigProvider/withConfig';
import { requestAdminData, setConfig } from '../../../actions/appActions';
import {
	upload,
	updateConstants,
	getEmailStrings,
	getEmailType,
} from './action';
import { getGeneralFields, publishJSON } from './utils';
import { publish } from 'actions/operatorActions';
import merge from 'lodash.merge';
import { clearFileInputById } from 'helpers/vanilla';
import { COUNTRIES_OPTIONS } from '../../../utils/countries';
import _get from 'lodash/get';

import './index.css';
import { handleFiatUpgrade, handleUpgrade } from 'utils/utils';
import { checkFileSize, fileSizeError } from 'utils/icon';
import PublishSection from './PublishSection';

const NameForm = AdminHocForm('NameForm');
const LanguageForm = AdminHocForm('LanguageForm');
const ThemeForm = AdminHocForm('ThemeForm');
const NativeCurrencyForm = AdminHocForm('NativeCurrencyForm');
const HelpDeskForm = AdminHocForm('HelpDeskForm');
const APIDocLinkForm = AdminHocForm('APIDocLinkForm');
const CaptchaForm = AdminHocForm('CaptchaForm');
const CountryForm = AdminHocForm('CountryForm');

class GeneralContent extends Component {
	constructor() {
		super();
		this.state = {
			constants: {},
			currentIcon: {},
			uploads: {},
			initialNameValues: {},
			initialLanguageValues: {},
			initialThemeValues: {},
			initialCountryValues: {},
			initialEmailValues: {},
			initialLinkValues: {},
			initialEmailVerificationValues: {},
			initialCaptchaValues: {},
			pendingPublishIcons: {},
			showDisableSignUpsConfirmation: false,
			isSignUpActive: true,
			loading: false,
			loadingButton: false,
			buttonSubmitting: false,
			isVisible: false,
			screen: '',
			selectedCountry: {},
			countryOptions: COUNTRIES_OPTIONS,
			removeCountryLabel: '',
			removeCountryValue: [],
			emailData: {},
			emailTypeData: [],
			currentPublishType: '',
			isDisableSave: false,
			isPublishDisable: false,
			updatedKey: '',
			isDisable: false,
			defaultEmailData: {},
		};
	}

	componentDidMount() {
		this.requestInitial();
		this.setState({ isDisable: true });
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			JSON.stringify(prevState.constants) !==
			JSON.stringify(this.state.constants)
		) {
			this.getSettingsValues();
		}
	}

	handleDisable = (isDisable) => {
		this.setState({ isDisable });
	};

	requestInitial = async () => {
		this.setState({ loading: true });
		requestAdminData()
			.then((res) => {
				this.setState({ constants: res.data, loading: false });
			})
			.catch((err) => {
				this.setState({ loading: false });
			});
		if (this.props.activeTab === 'email') {
			await this.requestEmailType();
			await this.requestEmail();
		}
	};

	requestEmail = (body) => {
		const { constants } = this.props;
		const { defaults = {} } = constants;
		let bodyParam = {
			language: defaults.language,
			type:
				this.state.emailTypeData && this.state.emailTypeData[0].toLowerCase(),
		};
		if (body) {
			bodyParam = {
				...bodyParam,
				...body,
			};
		}
		getEmailStrings(bodyParam)
			.then((response) => {
				if (response) {
					if (response?.title === 'Account Upgraded') {
						this.setState({
							defaultEmailData: {
								...response,
								language: bodyParam.language,
								type: bodyParam.type,
							},
							emailData: response,
						});
					} else {
						this.setState({ emailData: response });
					}
				}
			})
			.catch((error) => {
				console.log('error', error);
			});
	};

	requestEmailType = () => {
		return new Promise((resolve, reject) => {
			getEmailType()
				.then((response) => {
					if (response) {
						this.setState({ emailTypeData: response });
					}
					resolve(response);
				})
				.catch((error) => {
					reject(error);
				});
		});
	};

	getSettingsValues = () => {
		let initialNameValues = { ...this.state.initialNameValues };
		let initialLanguageValues = { ...this.state.initialLanguageValues };
		let initialThemeValues = { ...this.state.initialThemeValues };
		let initialCountryValues = { ...this.state.initialCountryValues };
		let initialEmailVerificationValues = {
			...this.state.initialEmailVerificationValues,
		};
		let initialCaptchaValues = { ...this.state.initialCaptchaValues };
		const { kit = {}, secrets = { smtp: {}, captcha: {}, emails: {} } } =
			this.state.constants || {};
		const {
			api_name,
			defaults = {},
			links = {},
			new_user_is_activated: isSignUpActive,
			email_verification_required,
			captcha = {},
		} = kit;
		initialNameValues = { ...initialNameValues, api_name };
		initialLanguageValues = {
			...initialLanguageValues,
			language: defaults.language,
		};
		initialThemeValues = { ...initialThemeValues, theme: defaults.theme };
		initialCountryValues = {
			...initialCountryValues,
			country: !defaults.country
				? COUNTRIES_OPTIONS[0].value
				: defaults.country,
		};
		initialEmailVerificationValues = {
			...initialEmailVerificationValues,
			email_verification_required,
		};

		initialCaptchaValues = {
			...initialCaptchaValues,
			...captcha,
			...secrets.captcha,
		};

		const { configuration = {} } = this.state.initialEmailValues || {};
		const initialEmailValues = {
			configuration: { ...configuration, ...secrets.emails, ...secrets.smtp },
			distribution: { ...secrets.emails },
		};
		delete initialEmailValues.configuration.audit;
		const initialLinkValues = { ...links };
		this.setState({
			initialNameValues,
			initialLanguageValues,
			initialThemeValues,
			initialCountryValues,
			initialEmailValues,
			initialLinkValues,
			isSignUpActive,
			initialEmailVerificationValues,
			initialCaptchaValues,
			showDisableSignUpsConfirmation: false,
		});
	};

	handleSaveIcon = async (iconKey) => {
		const { currentIcon } = this.state;
		const { updateIcons } = this.props;
		const icons = {};

		for (const themeKey in currentIcon) {
			if (currentIcon.hasOwnProperty(themeKey)) {
				icons[themeKey] = {};

				for (const key in currentIcon[themeKey]) {
					if (currentIcon[themeKey].hasOwnProperty(key)) {
						const file = currentIcon[themeKey][key];
						if (file) {
							const formData = new FormData();
							const { name: fileName } = file;
							const uniqueId = Date.now();
							const extension = fileName.split('.').pop();
							const name = `${key}__${themeKey}___${uniqueId}.${extension}`;

							formData.append('name', name);
							formData.append('file', file);

							try {
								const {
									data: { path },
								} = await upload(formData);
								icons[themeKey][key] = path;
								this.setState({ currentIcon: {}, isPublishDisable: true });
							} catch ({ response }) {
								clearFileInputById(`admin-file-input__${themeKey},${key}`);
								const errorMsg =
									response && response.data && response.data.message
										? response.data.message
										: 'Something went wrong!';
								message.error(errorMsg);
								return;
							}
						}
					}
				}
			}
		}
		this.setState((prevState) => ({
			...prevState,
			pendingPublishIcons: merge({}, prevState.pendingPublishIcons, {
				[iconKey]: icons,
			}),
			updatedKey: iconKey,
		}));

		updateIcons(icons);
	};

	handleCancelIcon = (theme, iconKey) => {
		this.setState({ currentIcon: {} }, () => {
			clearFileInputById(`admin-file-input__${theme},${iconKey}`);
		});
	};

	handleChangeFile = ({ target: { name, files } }, is_image = true) => {
		const [theme, iconKey] = name.split(',');

		if (files) {
			this.setState(
				(prevState) => ({
					...prevState,
					currentIcon: {
						...prevState.currentIcon,
						[theme]: {
							...prevState.currentIcon[theme],
							[iconKey]: files[0],
						},
					},
				}),
				() => {
					const hasExceeded = !checkFileSize(files[0]);
					Modal.confirm({
						content: hasExceeded
							? fileSizeError
							: `Do you want to save this ${is_image ? 'graphic' : 'icon'}?`,
						okText: 'Save',
						cancelText: 'Cancel',
						onOk: () => this.handleSaveIcon(iconKey),
						onCancel: () => this.handleCancelIcon(theme, iconKey),
						okButtonProps: {
							disabled: hasExceeded,
						},
					});
				}
			);
		}
	};

	handleSubmitGeneral = (formProps) => {
		this.setState({ buttonSubmitting: true });
		updateConstants(formProps)
			.then((res) => {
				this.setState({ constants: res });
				this.props.setConfig(res.kit);
				message.success('Updated successfully');
				this.setState({ buttonSubmitting: false });
				this.handleDisable(true);
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				message.error(error);
				this.setState({ buttonSubmitting: false });
				this.handleDisable(true);
			});
	};

	handleSubmitName = (formProps) => {
		this.handleSubmitGeneral({ kit: { ...formProps } });
	};

	handleSubmitDefault = (formProps) => {
		this.handleSubmitGeneral({
			kit: {
				defaults: { ...formProps },
			},
		});
	};

	submitSettings = (formProps, formKey) => {
		const { initialEmailValues } = this.state;
		let formValues = {};
		if (formKey === 'email_distribution') {
			formValues = {};
			let compareValues = initialEmailValues.distribution || {};
			if (formProps.audit || formProps.send_email_to_support) {
				if (compareValues.audit !== formProps.audit) {
					formValues.secrets = {
						emails: {
							audit: formProps.audit,
						},
					};
				}
				if (
					compareValues.send_email_to_support !==
					formProps.send_email_to_support
				) {
					formValues.secrets = {
						emails: {
							send_email_to_support: formProps.send_email_to_support,
						},
					};
				}
			}
		} else if (formKey === 'email_configuration') {
			formValues = {};
			let compareValues = initialEmailValues.configuration || {};
			Object.keys(formProps).forEach((val) => {
				if (
					val === 'sender' ||
					val === 'timezone' ||
					val === 'send_email_to_support'
				) {
					if (compareValues[val] !== formProps[val]) {
						if (!formValues.secrets) formValues.secrets = {};
						if (!formValues.secrets.emails) formValues.secrets.emails = {};
						formValues.secrets.emails[val] = formProps[val];
					}
				} else if (val === 'port') {
					if (compareValues[val] !== parseInt(formProps[val], 10)) {
						if (!formValues.secrets) formValues.secrets = {};
						if (!formValues.secrets.smtp) formValues.secrets.smtp = {};
						formValues.secrets.smtp[val] = parseInt(formProps[val], 10);
					}
				} else {
					if (compareValues[val] !== formProps[val]) {
						if (!formValues.secrets) formValues.secrets = {};
						if (!formValues.secrets.smtp) formValues.secrets.smtp = {};
						if (val === 'password') {
							if (!formProps[val].includes('*')) {
								formValues.secrets.smtp[val] = formProps[val];
							}
						} else {
							formValues.secrets.smtp[val] = formProps[val];
						}
					}
				}
			});
		} else if (formKey === 'links') {
			formValues.kit = {
				links: { ...formProps },
			};
		}
		if (!Object.keys(formValues).length) {
			this.setState({ error: 'Remove masked values from the secrets fields' });
			return false;
		}
		this.handleSubmitGeneral(formValues);
	};

	handleSubmitReferralBadge = (formProps) => {
		this.handleSubmitGeneral({
			kit: {
				links: {
					...formProps,
				},
			},
		});
	};

	handleSubmitTOSlinks = (formProps) => {
		this.handleSubmitGeneral({
			kit: {
				links: {
					...formProps,
				},
			},
		});
	};

	handleSubmitHelpDesk = (formProps) => {
		this.handleSubmitGeneral({
			kit: {
				links: {
					...formProps,
				},
			},
		});
	};

	handleSubmitAPIDocLink = (formProps) => {
		this.handleSubmitGeneral({
			kit: {
				links: {
					...formProps,
				},
			},
		});
	};

	handleSubmitEmailVerification = (formProps) => {
		this.handleSubmitGeneral({
			kit: {
				...formProps,
			},
		});
	};

	handleSubmitCaptcha = ({ site_key, secret_key }) => {
		const formValues = {
			kit: {
				captcha: {
					site_key,
				},
			},
			...(!secret_key.includes('*')
				? {
						secrets: {
							captcha: {
								secret_key,
							},
						},
				  }
				: {}),
		};

		this.handleSubmitGeneral(formValues);
	};

	handleSubmitSignUps = (new_user_is_activated) => {
		if (this.state.isSignUpActive !== new_user_is_activated) {
			this.setState({ isDisableSave: true });
		} else {
			this.setState({ isDisableSave: false });
		}
		return this.handleSubmitGeneral({
			kit: {
				new_user_is_activated,
			},
		});
	};

	renderImageUpload = (id, theme, index, is_image = true, showLable = true) => {
		const { allIcons } = this.props;
		return (
			<div key={index} className="file-container">
				<div className="file-img-content">
					<Image icon={allIcons[theme][id]} wrapperClassName="icon-img" />
				</div>
				<label>
					{showLable && `${theme} theme`}
					<span className="anchor">Upload</span>
					<input
						type="file"
						accept="image/*"
						onChange={(e) => this.handleChangeFile(e, is_image)}
						name={`${theme},${id}`}
						id={`admin-file-input__${theme},${id}`}
					/>
				</label>
			</div>
		);
	};

	handleSaveInterface = (features) => {
		this.handleSubmitGeneral({
			kit: {
				features,
			},
		});
	};

	handlePublish = (id) => {
		const {
			pendingPublishIcons: { [id]: published = {} },
		} = this.state;

		this.setState({ loadingButton: true, currentPublishType: id });
		const iconsOverwrites = JSON.parse(localStorage.getItem('icons') || '{}');

		const icons = merge({}, iconsOverwrites, published);
		const configs = { icons };
		publish(configs)
			.then(() => {
				localStorage.setItem('icons', JSON.stringify(icons));
				this.setState({ pendingPublishIcons: {} });
				message.success('Updated successfully');
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				message.error(error);
			})
			.finally(() => {
				this.setState({ loadingButton: false, isPublishDisable: false });
			});
	};

	handleSignUpsSwitch = () => {
		const { isSignUpActive } = this.state;
		if (isSignUpActive) {
			this.setState({
				showDisableSignUpsConfirmation: true,
			});
		} else {
			this.handleSubmitSignUps(true);
		}
	};

	disableSignUpsConfirmation = () => {
		this.handleSubmitSignUps(false);
	};

	handleGeoFenceModal = () => {
		this.setState({ isVisible: true, screen: '' });
	};

	handleClose = () => {
		this.setState({ isVisible: false, selectedCountry: { isFocus: false } });
	};

	handleBackConfirm = () => {
		const { screen } = this.state;
		if (screen === 'step2') {
			this.setState({
				screen: '',
				selectedCountry: { ...this.state.selectedCountry, isFocus: true },
			});
		} else if (screen === 'step3') {
			this.setState({ isVisible: false });
		}
	};

	handleNext = () => {
		this.setState({ screen: 'step2', countryOptions: COUNTRIES_OPTIONS });
	};

	selectedCountryOption = (value) => {
		let selectedCountry = { ...value, isFocus: true };
		this.setState({ selectedCountry });
	};

	removeCountry = (value) => {
		const { constants } = this.state;
		const names = _get(constants, 'kit.black_list_countries', []).filter(
			(data) => data !== value.value
		);
		this.setState({
			screen: 'step3',
			isVisible: true,
			removeCountryLabel: value.label,
			removeCountryValue: names,
		});
	};

	handleSearch = (e) => {
		const searchValue = e.target.value ? e.target.value.toLowerCase() : '';
		if (searchValue) {
			const filteredData = COUNTRIES_OPTIONS.filter((data) => {
				return data.label.toLowerCase().includes(searchValue);
			});
			this.setState({ countryOptions: filteredData });
		} else {
			this.setState({ countryOptions: COUNTRIES_OPTIONS });
		}
	};

	handleConfirm = () => {
		const {
			screen,
			constants,
			selectedCountry,
			removeCountryValue,
		} = this.state;
		if (screen === 'step2') {
			if (
				_get(constants, 'kit.black_list_countries', []).includes(
					selectedCountry.value
				)
			) {
				message.warn('Country is already exist in blacklist');
			} else {
				this.handleSubmitName({
					black_list_countries: [
						...constants.kit.black_list_countries,
						selectedCountry.value,
					],
				});
			}
			this.setState({ isVisible: false, selectedCountry: { isFocus: false } });
		} else if (screen === 'step3') {
			this.handleSubmitName({ black_list_countries: removeCountryValue });
			this.setState({ isVisible: false });
		}
	};

	renderModalContent = () => {
		const { screen, removeCountryLabel, selectedCountry } = this.state;
		switch (screen) {
			case 'step2':
				return (
					<div className="general-geo-wrapper">
						<div className="title">Check and confirm</div>
						<div className="pt-3 pb-3">
							Please check that the details below are correct and confirm that
							you do want to restrict access from this location to your
							platform.
						</div>
						<div className="box-wrapper">
							<div>Location: {selectedCountry.label}</div>

							<div>IP address: All</div>
						</div>
						<div className="btn-wrapper">
							<Button type="primary" onClick={this.handleBackConfirm}>
								Back
							</Button>
							<div className="separator"></div>
							<Button type="primary" onClick={this.handleConfirm}>
								Confirm
							</Button>
						</div>
					</div>
				);
			case 'step3':
				return (
					<div className="general-geo-wrapper">
						<div className="title">Remove geofencing</div>
						<div className="pt-3 pb-3">
							Are you sure you want to remove this country?
						</div>
						<div className="box-wrapper">
							<div>Location: {removeCountryLabel}</div>
							<div>IP address: All</div>
						</div>
						<div className="btn-wrapper">
							<Button type="primary" onClick={this.handleBackConfirm}>
								Back
							</Button>
							<div className="separator"></div>
							<Button type="primary" onClick={this.handleConfirm}>
								Confirm
							</Button>
						</div>
					</div>
				);
			default:
				return (
					<div className="general-geo-wrapper">
						<div className="title">Add geofence restriction</div>
						<div>Restrict location by specific location name</div>
						<div className="mt-4">Select a location</div>
						<Input
							placeholder={'Search name country location name'}
							onChange={this.handleSearch}
						/>
						<div className="location-option-wrapper mt-3 mb-5">
							{this.state.countryOptions.map((data, index) => {
								return (
									<div
										className="location-option"
										key={index}
										onClick={() => this.selectedCountryOption(data)}
									>
										<div
											className={
												this.state.selectedCountry?.isFocus &&
												this.state.selectedCountry?.label === data.label
													? 'location-option-active'
													: ''
											}
										>
											{data.label}
										</div>
									</div>
								);
							})}
						</div>
						<div className="btn-wrapper">
							<Button type="primary" onClick={this.handleClose}>
								Back
							</Button>
							<div className="separator"></div>
							<Button
								type="primary"
								onClick={this.handleNext}
								disabled={!_get(selectedCountry, 'isFocus', false)}
							>
								Next
							</Button>
						</div>
					</div>
				);
		}
	};

	render() {
		const {
			initialEmailValues,
			initialNameValues,
			initialLanguageValues,
			initialThemeValues,
			initialCountryValues,
			initialLinkValues,
			initialEmailVerificationValues,
			initialCaptchaValues,
			loading,
			isSignUpActive,
			showDisableSignUpsConfirmation,
			loadingButton,
			buttonSubmitting,
			constants,
			emailTypeData,
			currentPublishType,
			isPublishDisable,
			updatedKey,
			isDisable,
			emailData,
			defaultEmailData,
		} = this.state;
		const { kit = {} } = this.state.constants;
		const { coins, themeOptions, activeTab, handleTabChange } = this.props;
		const generalFields = getGeneralFields(coins);

		if (loading) {
			return (
				<div className="d-flex align-items-center">
					<Spin />
				</div>
			);
		}
		const isUpgrade = handleUpgrade(kit.info);
		const isFiatUpgrade = handleFiatUpgrade(kit.info);

		return (
			<div>
				<div className="general-wrapper">
					{activeTab === 'branding' ? (
						<div>
							<div className="sub-title">Exchange Name</div>
							<NameForm
								initialValues={initialNameValues}
								onSubmit={this.handleSubmitName}
								buttonText={'Save'}
								buttonClass="green-btn minimal-btn"
								fields={generalFields.section_1}
								buttonSubmitting={buttonSubmitting}
							/>
							<div className="divider"></div>
						</div>
					) : null}
					{activeTab === 'localization' ? (
						<div>
							<div>
								<div className="sub-title">Country</div>
								<CountryForm
									initialValues={initialCountryValues}
									onSubmit={this.handleSubmitDefault}
									buttonText={'Save'}
									buttonClass="green-btn minimal-btn"
									fields={generalFields.countrySection}
									buttonSubmitting={buttonSubmitting}
								/>
							</div>
							<div className="divider"></div>
							<div>
								<div className="sub-title">Language</div>
								<div className="description">
									You can edit language and strings{' '}
									<span
										onClick={() =>
											browserHistory.push('/account?stringSettings=true')
										}
										className="general-edit-link"
									>
										here
									</span>
									.
								</div>
								<span
									onClick={() =>
										browserHistory.push('/account?stringSettings=true')
									}
									className="general-edit-link general-edit-link-position"
								>
									Edit
								</span>
								<LanguageForm
									initialValues={initialLanguageValues}
									onSubmit={this.handleSubmitDefault}
									buttonText={'Save'}
									buttonClass="green-btn minimal-btn"
									fields={generalFields.section_2}
									buttonSubmitting={buttonSubmitting}
								/>
							</div>
							<div className="divider" />
							<div>
								<div className="sub-title">Theme</div>
								<div className="description">
									You can edit theme and create new themes{' '}
									<span
										onClick={() =>
											browserHistory.push('/account?themeSettings=true')
										}
										className="general-edit-link"
									>
										here
									</span>
									.
								</div>
								<span
									onClick={() =>
										browserHistory.push('/account?themeSettings=true')
									}
									className="general-edit-link general-edit-link-position"
								>
									Edit
								</span>
								<ThemeForm
									initialValues={initialThemeValues}
									onSubmit={this.handleSubmitDefault}
									buttonText={'Save'}
									buttonClass="green-btn minimal-btn"
									fields={generalFields.section_3}
									buttonSubmitting={buttonSubmitting}
								/>
							</div>
							<div className="divider"></div>
							<div className="mb-5">
								<div className="sub-title">Native currency</div>
								<div className="description">
									This currency unit will be used for valuing
									deposits/withdrawals and other important areas.
								</div>
								<div className="coins-list">
									<NativeCurrencyForm
										initialValues={{
											native_currency: kit.native_currency,
										}}
										onSubmit={this.handleSubmitName}
										buttonText={'Save'}
										buttonClass="green-btn minimal-btn"
										fields={generalFields.section_4}
										buttonSubmitting={buttonSubmitting}
									/>
								</div>
							</div>
						</div>
					) : null}
					{activeTab === 'branding' ? (
						<div>
							{publishJSON.map((item, key) => {
								return (
									<div key={key}>
										<PublishSection
											title={item.title}
											description={item.description}
											themeOptions={themeOptions}
											loadingButton={loadingButton}
											currentPublishType={currentPublishType}
											renderImageUpload={this.renderImageUpload}
											handlePublish={this.handlePublish}
											currentkey={item.currentkey}
											isPublishDisable={isPublishDisable}
											updatedKey={updatedKey}
											themeKey={item.themeKey ? item.themeKey : ''}
											indexKey={item.indexKey ? item.indexKey : ''}
										/>
										<div className="divider"></div>
									</div>
								);
							})}
							<div className="mb-5">
								<div className="sub-title">Onboarding background image</div>
								<div className="description">
									<span>
										To change the login/signup background image please visit the{' '}
									</span>
									<span className="anchor" onClick={() => handleTabChange('4')}>
										onboarding page
									</span>
									.
								</div>
							</div>
						</div>
					) : null}
					{activeTab === 'onboarding' ? (
						<div>
							<h2>Onboarding</h2>
							<div className="description">
								Setup the login and sign up section of your platform.
							</div>
							<div className="sub-title pt-4">Allow new sign ups</div>
							<div className="small-text ml-0">
								(Turning on sign ups will allow new users to sign up on your
								platforms)
							</div>
							<div className="admin-chat-feature-wrapper pt-4">
								<div className="switch-wrapper mb-5">
									<div className="d-flex">
										<span
											className={
												!isSignUpActive
													? 'switch-label'
													: 'switch-label label-inactive'
											}
										>
											Off
										</span>
										<Switch
											checked={isSignUpActive}
											onClick={this.handleSignUpsSwitch}
										/>
										<span
											className={
												isSignUpActive
													? 'switch-label'
													: 'switch-label label-inactive'
											}
										>
											On
										</span>
									</div>
								</div>
							</div>
							<EmailVerificationForm
								initialValues={initialEmailVerificationValues}
								handleSaveEmailVerification={this.handleSubmitEmailVerification}
								buttonSubmitting={buttonSubmitting}
							/>

							<DisableSignupsConfirmation
								visible={showDisableSignUpsConfirmation}
								onCancel={() =>
									this.setState({ showDisableSignUpsConfirmation: false })
								}
								onConfirm={this.disableSignUpsConfirmation}
								buttonSubmitting={buttonSubmitting}
							/>
							<PublishSection
								title="Onboarding background image"
								description="(The image displayed in the background on your onboarding page)"
								themeOptions={themeOptions}
								loadingButton={loadingButton}
								currentPublishType={currentPublishType}
								renderImageUpload={this.renderImageUpload}
								handlePublish={this.handlePublish}
								currentkey="EXCHANGE_BOARDING_IMAGE"
								isPublishDisable={isPublishDisable}
								updatedKey={updatedKey}
							/>
						</div>
					) : null}
					{activeTab === 'email' ? (
						<div>
							<div className="form-wrapper">
								<div className="disable-button">
									<EmailSettingsForm
										initialValues={initialEmailValues}
										handleSubmitSettings={this.submitSettings}
										buttonSubmitting={buttonSubmitting}
										emailData={emailData}
										requestEmail={this.requestEmail}
										defaults={kit && kit.defaults}
										emailTypeData={emailTypeData}
										constants={constants}
										defaultEmailData={defaultEmailData}
									/>
								</div>
							</div>
						</div>
					) : null}
				</div>
				{activeTab === 'footer' ? (
					<div>
						<div className="general-wrapper">
							<Description
								descriptionFields={generalFields.section_5}
								descriptionInitialValues={{ description: kit.description }}
								footerFields={generalFields.section_6}
								ReferralBadgeFields={generalFields.section_8}
								ReferralBadgeInitialValues={{
									hide_referral_badge: initialLinkValues.hide_referral_badge,
									referral_label: initialLinkValues.referral_label,
									referral_link: initialLinkValues.referral_link,
								}}
								footerInitialValues={{
									terms: initialLinkValues.terms,
									privacy: initialLinkValues.privacy,
								}}
								handleSubmitDescription={this.handleSubmitName}
								handleSubmitFooterText={this.handleSubmitTOSlinks}
								handleSubmitReferralBadge={this.handleSubmitReferralBadge}
								isUpgrade={isUpgrade}
								buttonSubmitting={buttonSubmitting}
							/>
						</div>
						<div className="divider"></div>
						<FooterConfig
							links={kit.links}
							initialValues={initialLinkValues}
							handleSubmitFooter={this.submitSettings}
							buttonSubmitting={buttonSubmitting}
							isDisable={isDisable}
							handleDisable={this.handleDisable}
						/>
						<div className="mb-5"></div>
					</div>
				) : null}
				{activeTab === 'help_info' ? (
					<div className="general-wrapper">
						<h3>Help pop up</h3>
						<p>
							The help pop up displays helpful links for your users and can be
							accessed in various areas that say 'help'.
						</p>
						<div className="sub-title pt-3">Helpdesk link</div>
						<div className="description mb-4">
							This link will be used for your any help sections on your
							exchange. You can put a direct link to your helpdesk service or
							your support email address.
						</div>
						<HelpDeskForm
							initialValues={{
								helpdesk: initialLinkValues.helpdesk,
							}}
							fields={generalFields.section_7}
							buttonText="Save"
							buttonClass="green-btn minimal-btn"
							onSubmit={this.handleSubmitHelpDesk}
							buttonSubmitting={buttonSubmitting}
						/>
						<div className="sub-title mt-4 pt-3">API documentation link</div>
						<div className="description mb-4">
							Provide the link to your exchanges API documentation. This link
							will appear on universal help pop up.
						</div>
						<APIDocLinkForm
							initialValues={{
								api_doc_link: initialLinkValues.api_doc_link,
							}}
							fields={generalFields.section_9}
							buttonText="Save"
							buttonClass="green-btn minimal-btn mb-5"
							onSubmit={this.handleSubmitAPIDocLink}
							buttonSubmitting={buttonSubmitting}
						/>
					</div>
				) : null}
				{activeTab === 'features' ? (
					<InterfaceForm
						initialValues={kit.features}
						handleSaveInterface={this.handleSaveInterface}
						isUpgrade={isUpgrade}
						buttonSubmitting={buttonSubmitting}
						isFiatUpgrade={isFiatUpgrade}
					/>
				) : null}
				{activeTab === 'security' ? (
					<div>
						<div className="general-wrapper">
							<div className="sub-title">Geofencing</div>
							<div className="description">
								Add a blacklist country to block activity from certain location.
							</div>
							<div className="geo-display">
								{_get(constants, 'kit.black_list_countries', []).length ? (
									COUNTRIES_OPTIONS.map((data, index) => {
										return _get(constants, 'kit.black_list_countries', []).map(
											(item) => {
												if (item === data.value) {
													return (
														<div className="d-flex location-data" key={index}>
															<div>{data.label} (All IPs)</div>
															<div>
																(
																<span
																	className="anchor"
																	onClick={() => this.removeCountry(data)}
																>
																	Remove
																</span>
																)
															</div>
														</div>
													);
												} else {
													return null;
												}
											}
										);
									})
								) : (
									<div className="placeHolder">Add country to the list...</div>
								)}
							</div>
							<div>
								<Button
									type="primary"
									onClick={this.handleGeoFenceModal}
									className="green-btn minimal-btn mt-5 mb-3"
								>
									Add
								</Button>
							</div>
							<Modal
								visible={this.state.isVisible}
								footer={null}
								onCancel={this.handleClose}
							>
								{this.renderModalContent()}
							</Modal>
						</div>
						<div className="divider"></div>
						<div className="general-wrapper mb-4 pb-4">
							<div className="sub-title">reCAPTCHA</div>
							<div className="description mb-4">
								Make spammers go away with{' '}
								<a
									target="_blank"
									href="https://docs.hollaex.com/advanced/dependencies#recaptcha"
									rel="noopener noreferrer"
								>
									Google reCAPTCHA v3
								</a>
								. Leave the field blank to remove recaptcha.
							</div>
							<CaptchaForm
								initialValues={initialCaptchaValues}
								fields={generalFields.section_10}
								buttonText="Save"
								buttonClass="green-btn minimal-btn"
								onSubmit={this.handleSubmitCaptcha}
								buttonSubmitting={buttonSubmitting}
							/>
						</div>
						<div className="divider"></div>
						<div className="general-wrapper mb-5">
							<div className="sub-title">Operator roles</div>
							<div className="description">
								<span>
									Invite other exchange operators to help secure your exchange
									in the{' '}
								</span>
								<Link to="/admin/roles">roles page</Link>.
							</div>
						</div>
					</div>
				) : null}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	coins: state.app.coins,
	user: state.user,
	constants: state.app.constants,
});

const mapDispatchToProps = (dispatch) => ({
	setConfig: bindActionCreators(setConfig, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(GeneralContent));
