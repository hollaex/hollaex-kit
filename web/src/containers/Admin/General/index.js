import React, { Component } from 'react';
import { Switch, Button, Modal, message, Collapse, Spin } from 'antd';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';

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
import { upload, updateConstants } from './action';
import { getGeneralFields } from './utils';
import { publish } from 'actions/operatorActions';
import merge from 'lodash.merge';
import { clearFileInputById } from 'helpers/vanilla';

import './index.css';
import { handleUpgrade } from 'utils/utils';

const NameForm = AdminHocForm('NameForm');
const LanguageForm = AdminHocForm('LanguageForm');
const ThemeForm = AdminHocForm('ThemeForm');
const NativeCurrencyForm = AdminHocForm('NativeCurrencyForm');
const HelpDeskForm = AdminHocForm('HelpDeskForm');
const APIDocLinkForm = AdminHocForm('APIDocLinkForm');

class General extends Component {
	constructor() {
		super();
		this.state = {
			constants: {},
			currentIcon: {},
			uploads: {},
			initialNameValues: {},
			initialLanguageValues: {},
			initialThemeValues: {},
			initialEmailValues: {},
			initialLinkValues: {},
			initialEmailVerificationValues: {},
			pendingPublishIcons: {},
			showDisableSignUpsConfirmation: false,
			isSignUpActive: true,
			loading: false,
			loadingButton: false,
			isReferralLink: false,
		};
	}

	componentDidMount() {
		this.requestInitial();
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			JSON.stringify(prevState.constants) !==
			JSON.stringify(this.state.constants)
		) {
			this.getSettingsValues();
		}
	}

	requestInitial = () => {
		this.setState({ loading: true });
		requestAdminData()
			.then((res) => {
				this.setState({ constants: res.data, loading: false });
			})
			.catch((err) => {
				console.log('err', err);
				this.setState({ loading: false });
			});
	};

	getSettingsValues = () => {
		let initialNameValues = { ...this.state.initialNameValues };
		let initialLanguageValues = { ...this.state.initialLanguageValues };
		let initialThemeValues = { ...this.state.initialThemeValues };
		let initialEmailVerificationValues = {
			...this.state.initialEmailVerificationValues,
		};
		const { kit = {}, secrets = { smtp: {}, captcha: {}, emails: {} } } =
			this.state.constants || {};
		const {
			api_name,
			defaults = {},
			links = {},
			new_user_is_activated: isSignUpActive,
			email_verification_required,
		} = kit;
		initialNameValues = { ...initialNameValues, api_name };
		initialLanguageValues = {
			...initialLanguageValues,
			language: defaults.language,
		};
		initialThemeValues = { ...initialThemeValues, theme: defaults.theme };
		initialEmailVerificationValues = {
			...initialEmailVerificationValues,
			email_verification_required,
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
			initialEmailValues,
			initialLinkValues,
			isSignUpActive,
			initialEmailVerificationValues,
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
								this.setState({ currentIcon: {} });
							} catch (error) {
								clearFileInputById(`admin-file-input__${themeKey},${key}`);
								message.error('Something went wrong!');
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
		}));

		updateIcons(icons);
	};

	handleCancelIcon = () => {
		this.setState({ currentIcon: {} });
	};

	handleChangeFile = ({ target: { name, files } }) => {
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
					Modal.confirm({
						content: 'Do you want to save this icon?',
						okText: 'Save',
						cancelText: 'Cancel',
						onOk: () => this.handleSaveIcon(iconKey),
						onCancel: this.handleCancelIcon,
					});
				}
			);
		}
	};

	handleSubmitGeneral = (formProps) => {
		updateConstants(formProps)
			.then((res) => {
				this.setState({ constants: res });
				this.props.setConfig(res.kit);
				message.success('Updated successfully');
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				message.error(error);
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
			if (formProps.audit) {
				formValues.secrets = {
					emails: {
						audit: formProps.audit,
					},
				};
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

	handleSubmitSignUps = (new_user_is_activated) => {
		return this.handleSubmitGeneral({
			kit: {
				new_user_is_activated,
			},
		});
	};

	renderImageUpload = (id, theme, index, showLable = true) => {
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
						onChange={this.handleChangeFile}
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

		this.setState({ loadingButton: true });
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
				this.setState({ loadingButton: false });
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

	handleReferralLink = (value) => {
		this.setState({ isReferralLink: value });
	};

	render() {
		const {
			initialEmailValues,
			initialNameValues,
			initialLanguageValues,
			initialThemeValues,
			initialLinkValues,
			initialEmailVerificationValues,
			loading,
			isSignUpActive,
			showDisableSignUpsConfirmation,
			loadingButton,
			isReferralLink,
		} = this.state;
		const { kit = {} } = this.state.constants;
		const { coins, themeOptions } = this.props;
		const generalFields = getGeneralFields(coins);
		if (loading) {
			return (
				<div className="d-flex align-items-center">
					<Spin />
				</div>
			);
		}
		const isUpgrade = handleUpgrade(kit.info);
		return (
			<div>
				<div className="general-wrapper">
					<div>
						<div className="sub-title">Exchange Name</div>
						<NameForm
							initialValues={initialNameValues}
							onSubmit={this.handleSubmitName}
							buttonText={'Save'}
							buttonClass="green-btn minimal-btn"
							fields={generalFields.section_1}
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
							onClick={() => browserHistory.push('/account?themeSettings=true')}
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
						/>
					</div>
					<div className="divider"></div>
					<div>
						<div className="sub-title">Native currency</div>
						<div className="description">
							This currency unit will be used for valuing deposits/withdrawals
							and other important areas.
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
							/>
						</div>
					</div>
					<div className="divider" />
					<div>
						<div className="sub-title">Landing page background</div>
						<div className="description">
							Landing home page for your exchange. This is the page your users
							will likely see first.
						</div>
						<div className="file-wrapper">
							<Collapse defaultActiveKey={['1']} bordered={false} ghost>
								<Collapse.Panel showArrow={false} key="1" disabled={true}>
									<div className="file-wrapper">
										{themeOptions
											.filter(({ value: theme }) => theme === 'dark')
											.map(({ value: theme }, index) =>
												this.renderImageUpload(
													'EXCHANGE_LANDING_PAGE',
													theme,
													index
												)
											)}
									</div>
								</Collapse.Panel>
								<Collapse.Panel
									showArrow={false}
									header={
										<span className="underline-text">
											Theme Specific Graphics
										</span>
									}
									key="2"
								>
									<div className="file-wrapper">
										{themeOptions
											.filter(({ value: theme }) => theme !== 'dark')
											.map(({ value: theme }, index) =>
												this.renderImageUpload(
													'EXCHANGE_LANDING_PAGE',
													theme,
													index
												)
											)}
									</div>
								</Collapse.Panel>
							</Collapse>
						</div>
						<Button
							type="primary"
							className="green-btn minimal-btn"
							loading={loadingButton}
							onClick={() => this.handlePublish('EXCHANGE_LANDING_PAGE')}
						>
							Publish
						</Button>
					</div>
					<div className="divider" />
					<div>
						<div className="sub-title">Exchange logo</div>
						<div className="description">
							This logo will be applied to emails send to your users and login
							screen, footer and other places. Any custom graphics uploaded via
							the direct edit function will override the logo.
						</div>
						<div className="file-wrapper">
							<Collapse defaultActiveKey={['1']} bordered={false} ghost>
								<Collapse.Panel showArrow={false} key="1" disabled={true}>
									<div className="file-wrapper">
										{themeOptions
											.filter(({ value: theme }) => theme === 'dark')
											.map(({ value: theme }, index) =>
												this.renderImageUpload('EXCHANGE_LOGO', theme, index)
											)}
									</div>
								</Collapse.Panel>
								<Collapse.Panel
									showArrow={false}
									header={
										<span className="underline-text">
											Theme Specific Graphics
										</span>
									}
									key="2"
								>
									<div className="file-wrapper">
										{themeOptions
											.filter(({ value: theme }) => theme !== 'dark')
											.map(({ value: theme }, index) =>
												this.renderImageUpload('EXCHANGE_LOGO', theme, index)
											)}
									</div>
								</Collapse.Panel>
							</Collapse>
						</div>
						<Button
							type="primary"
							className="green-btn minimal-btn"
							loading={loadingButton}
							onClick={() => this.handlePublish('EXCHANGE_LOGO')}
						>
							Publish
						</Button>
					</div>
					<div className="divider"></div>
					<div>
						<div className="sub-title">Loader</div>
						<div className="description">
							Used for areas that require loading.Also known as a spinner.
						</div>
						<div className="file-wrapper">
							<Collapse defaultActiveKey={['1']} bordered={false} ghost>
								<Collapse.Panel showArrow={false} key="1" disabled={true}>
									{themeOptions
										.filter(({ value: theme }) => theme === 'dark')
										.map(({ value: theme }, index) =>
											this.renderImageUpload('EXCHANGE_LOADER', theme, index)
										)}
								</Collapse.Panel>
								<Collapse.Panel
									showArrow={false}
									header={
										<span className="underline-text">
											Theme Specific Graphics
										</span>
									}
									key="2"
								>
									{themeOptions
										.filter(({ value: theme }) => theme !== 'dark')
										.map(({ value: theme }, index) =>
											this.renderImageUpload('EXCHANGE_LOADER', theme, index)
										)}
								</Collapse.Panel>
							</Collapse>
						</div>
						<Button
							type="primary"
							className="green-btn minimal-btn"
							loading={loadingButton}
							onClick={() => this.handlePublish('EXCHANGE_LOADER')}
						>
							Publish
						</Button>
					</div>
					<div className="divider"></div>
					<div>
						<div className="sub-title">Exchange favicon</div>
						<Collapse defaultActiveKey={['1']} bordered={false} ghost>
							<Collapse.Panel showArrow={false} key="1" disabled={true}>
								<div className="file-wrapper">
									{this.renderImageUpload(
										'EXCHANGE_FAV_ICON',
										'dark',
										'EXCHANGE_1',
										false
									)}
								</div>
							</Collapse.Panel>
						</Collapse>
						<Button
							type="primary"
							className="green-btn minimal-btn"
							loading={loadingButton}
							onClick={() => this.handlePublish('EXCHANGE_FAV_ICON')}
						>
							Publish
						</Button>
					</div>
					<div className="divider"></div>
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
						/>

						<DisableSignupsConfirmation
							visible={showDisableSignUpsConfirmation}
							onCancel={() =>
								this.setState({ showDisableSignUpsConfirmation: false })
							}
							onConfirm={this.disableSignUpsConfirmation}
						/>

						<div className="sub-title mt-5">Onboarding background image</div>
						<div className="description">
							(The image displayed in the background on your onboarding page)
						</div>
						<div className="file-wrapper">
							<Collapse defaultActiveKey={['1']} bordered={false} ghost>
								<Collapse.Panel showArrow={false} key="1" disabled={true}>
									<div className="file-wrapper">
										{themeOptions
											.filter(({ value: theme }) => theme === 'dark')
											.map(({ value: theme }, index) =>
												this.renderImageUpload(
													'EXCHANGE_BOARDING_IMAGE',
													theme,
													index
												)
											)}
									</div>
								</Collapse.Panel>
								<Collapse.Panel
									showArrow={false}
									header={
										<span className="underline-text">
											Theme Specific Graphics
										</span>
									}
									key="2"
								>
									<div className="file-wrapper">
										{themeOptions
											.filter(({ value: theme }) => theme !== 'dark')
											.map(({ value: theme }, index) =>
												this.renderImageUpload(
													'EXCHANGE_BOARDING_IMAGE',
													theme,
													index
												)
											)}
									</div>
								</Collapse.Panel>
							</Collapse>
						</div>
						<Button
							type="primary"
							className="green-btn minimal-btn"
							loading={loadingButton}
							onClick={() => this.handlePublish('EXCHANGE_BOARDING_IMAGE')}
						>
							Publish
						</Button>
					</div>
					<div className="divider"></div>
					<div>
						<div className="form-wrapper">
							<EmailSettingsForm
								initialValues={initialEmailValues}
								handleSubmitSettings={this.submitSettings}
							/>
						</div>
					</div>
					<div className="divider"></div>
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
					/>
					<div className="divider"></div>
				</div>
				<div>
					<FooterConfig
						links={kit.links}
						initialValues={initialLinkValues}
						handleSubmitFooter={this.submitSettings}
					/>
				</div>
				<div className="divider"></div>
				<div className="general-wrapper">
					<h3>Help pop up</h3>
					<p>
						The help pop up displays helpful links for your users and can be
						accessed in various areas that say 'help'.
					</p>
					<div className="sub-title pt-3">Helpdesk link</div>
					<div className="description mb-4">
						This link will be used for your any help sections on your exchange.
						You can put a direct link to your helpdesk service or your support
						email address.
					</div>
					<HelpDeskForm
						initialValues={{
							helpdesk: initialLinkValues.helpdesk,
						}}
						fields={generalFields.section_7}
						buttonText="Save"
						buttonClass="green-btn minimal-btn"
						onSubmit={this.handleSubmitHelpDesk}
					/>
					<div className="sub-title mt-4 pt-3">API documentation link</div>
					<div className="description mb-4">
						Provide the link to your exchanges API documentation. This link will
						appear on universal help pop up.
					</div>
					<APIDocLinkForm
						initialValues={{
							api_doc_link: initialLinkValues.api_doc_link,
						}}
						fields={generalFields.section_9}
						buttonText="Save"
						buttonClass="green-btn minimal-btn"
						onSubmit={this.handleSubmitAPIDocLink}
					/>
				</div>
				<div className="divider"></div>
				<InterfaceForm
					initialValues={kit.features}
					handleSaveInterface={this.handleSaveInterface}
					isUpgrade={isUpgrade}
				/>
				<div className="divider"></div>
				<div className="referral-link-section">
					<div className="sub-title">Referral affiliate link</div>
					<div className="description">
						Allow your user to share a referral affiliate link with their
						friends. Users that share this link will be able to earn commissions
						form trading fees made from their invited friends.
					</div>
					{isUpgrade ? (
						<div className="d-flex">
							<div className="d-flex align-items-center justify-content-between upgrade-section my-4">
								<div>
									<div className="font-weight-bold">Boost your userbase</div>
									<div>Incentives your users to share your platform</div>
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
					) : null}
					<div className="description">
						In the account summary page your users can access a 'INVITE YOUR
						FRIEND' link which will give them a unique sharable referral link.
					</div>
					<div className={isUpgrade ? 'disabled-area' : ''}>
						<div className="admin-chat-feature-wrapper pt-4">
							<div className="switch-wrapper mb-5">
								<div className="d-flex">
									<span
										className={
											!isReferralLink
												? 'switch-label'
												: 'switch-label label-inactive'
										}
									>
										Hide
									</span>
									<Switch
										checked={isReferralLink}
										onClick={this.handleReferralLink}
									/>
									<span
										className={
											isReferralLink
												? 'switch-label'
												: 'switch-label label-inactive'
										}
									>
										Show
									</span>
								</div>
							</div>
						</div>
						<div className="general-wrapper">
							<Button type="primary" className="mb-5">
								Save
							</Button>
						</div>
					</div>
				</div>
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
)(withConfig(General));
