import React, { Component } from 'react';
import { Input, Button, Radio } from 'antd';
import ReactSVG from 'react-svg';
import { connect } from 'react-redux';

import FooterConfig from './FooterConfig';
import Description from './Description';
import { ICONS } from '../../../config/constants';
import { EmailSettingsForm } from '../Settings/SettingsForm';
import { AdminHocForm } from '../../../components';
import { requestAdminData } from '../../../actions/appActions';
import { getGeneralFields } from './utils';

import './index.css';

const NameForm = AdminHocForm('NameForm');
const LanguageForm = AdminHocForm('LanguageForm');
const ThemeForm = AdminHocForm('ThemeForm');
const NativeCurrencyForm = AdminHocForm('NativeCurrencyForm');

class General extends Component {
	constructor() {
		super();
		this.state = {
			constants: {},
			icons: {},
			uploads: {},
			initialEmailValues: {},
			initialGeneralValues: {}
		};
	}

	componentDidMount() {
		if (this.props.constants && this.props.constants.icons) {
			this.setState({
				icons: this.props.constants.icons
			});
		}
		this.requestInitial();
	}

	componentDidUpdate(prevProps, prevState) {
		if (JSON.stringify(prevProps.constants.icons) !== JSON.stringify(this.props.constants.icons)) {
			this.setState({
				icons: {
					...this.state.icons,
					...this.props.constants.icons
				}
			});
		}
		if (JSON.stringify(prevState.constants) !== JSON.stringify(this.state.constants)) {
			this.getSettingsValues();
		}
	}

	requestInitial = () => {
		requestAdminData()
			.then((res) => {
				this.setState({ constants: res.data });
			})
			.catch((err) => {
				console.log('err', err);
			})
	}
	
	getSettingsValues = () => {
        let initialGeneralValues = { ...this.state.initialGeneralValues };
        const {
            title,
            description,
            defaults = {},
            secrets = { smtp: {}, captcha: {}, emails: {} },
            links = {}
        } = this.state.constants || {};
        const { configuration = {}, distribution = {} } = this.state.initialEmailValues || {};
        const initialEmailValues = {
            configuration: { ...configuration, ...secrets.emails, ...secrets.smtp },
            distribution: { ...distribution, ...secrets.emails }
        };
        initialGeneralValues = { ...initialGeneralValues, ...defaults, title, description };

        const initialLinkValues = { ...links };
        this.setState({
            initialGeneralValues,
            initialEmailValues,
            initialLinkValues
        });
    };

	handleSubmitName = (formProps) => {
		console.log(formProps);
	};

	handleChangeFile = (event) => {
		if (event.target.files) {
			this.setState({
				icons: {
					...this.state.icons,
					[event.target.name]: event.target.value
				},
				uploads: {
					...this.state.uploads,
					[event.target.name]: event.target.files[0]
				}
			});
		}
	};

	submitSettings = (formProps) => {
		console.log('submitSettings', formProps);
	};

	render() {
		const { icons, initialEmailValues } = this.state;
		const { coins } = this.props;
		const generalFields = getGeneralFields(coins);
		return (
			<div>
				<div className='general-wrapper'>
					<div>
						<div className='sub-title'>Exchange Name</div>
						<NameForm
							onSubmit={this.handleSubmitName}
							buttonText={'Save'}
							buttonClass="green-btn minimal-btn"
							fields={generalFields.section_1}
						/>
					</div>
					<div className='divider'></div>
					<div>
						<div className='sub-title'>Language</div>
						<div className='description'>
							You can edit language and strings{' '}
							<span className='general-edit-link'>here</span>.
						</div>
						<span className='general-edit-link general-edit-link-position'>Edit</span>
						<LanguageForm
							onSubmit={this.handleSubmitName}
							buttonText={'Save'}
							buttonClass="green-btn minimal-btn"
							fields={generalFields.section_2}
						/>
					</div>
					<div className='divider'></div>
					<div>
						<div className='sub-title'>Theme</div>
						<div className='description'>
							You can edit theme and create new themes{' '}
							<span className='general-edit-link'>here</span>.
						</div>
						<span className='general-edit-link general-edit-link-position'>Edit</span>
						<ThemeForm
							onSubmit={this.handleSubmitName}
							buttonText={'Save'}
							buttonClass="green-btn minimal-btn"
							fields={generalFields.section_3}
						/>
					</div>
					<div className='divider'></div>
					<div>
						<div className='sub-title'>Native currency</div>
						<div className='description'>
							This currency unit will be used for valuing deposits/withdrawals and
							other important areas.
						</div>
						<div className='coins-list'>
							<NativeCurrencyForm
								onSubmit={this.handleSubmitName}
								buttonText={'Save'}
								buttonClass="green-btn minimal-btn"
								fields={generalFields.section_4}
							/>
						</div>
					</div>
					<div className='divider'></div>
					<div>
						<div className='sub-title'>Exchange logo</div>
						<div className='description'>
							This logo will be applied to emails send to your users and login
							screen, footer and other places. Any custom graphics uploaded via
							the direct edit function will override the logo.
						</div>
						<div className='file-wrapper'>
							<div className="file-container">
								<img
									src={icons.EXCHANGE_LOGO_LIGHT || ''}
									alt='icon'
									className='icon-img'
								/>
								<label>
									<p style={{ whiteSpace: 'normal' }}>Light theme</p>
									<span className="anchor">Upload</span>
									<input
										type="file"
										onChange={this.handleChangeFile}
										name={'EXCHANGE_LOGO_LIGHT'}
									/>
								</label>
							</div>
							<div className='file-container'>
								<img
									src={icons.EXCHANGE_LOGO_DARK || ''}
									alt='icon'
									className='icon-img'
								/>
								<label>
									<p style={{ whiteSpace: 'normal' }}>Dark theme</p>
									<span className='anchor'>Upload</span>
									<input
										type="file"
										onChange={this.handleChangeFile}
										name={'EXCHANGE_LOGO_DARK'}
									/>
								</label>
							</div>
						</div>
						<Button type="primary" className="green-btn minimal-btn">Save</Button>
					</div>
					<div className='divider'></div>
					<div>
						<div className='sub-title'>Loader</div>
						<div className='description'>
							Used for areas that require loading.Also known as a spinner.
						</div>
						<div className='file-wrapper'>
							<div className='file-container'>
								<img
									src={icons.LOADER_LIGHT || ''}
									alt='icon'
									className='icon-img'
								/>
								<label>
									<p style={{ whiteSpace: 'normal' }}>Light theme</p>
									<span className='anchor'>Upload</span>
									<input
										type="file"
										onChange={this.handleChangeFile}
										name={'LOADER_LIGHT'}
									/>
								</label>
							</div>
							<div className='file-container'>
								<img
									src={icons.LOADER_DARK || ''}
									alt='icon'
									className='icon-img'
								/>
								<label>
									<p style={{ whiteSpace: 'normal' }}>Dark theme</p>
									<span className='anchor'>Upload</span>
									<input
										type="file"
										onChange={this.handleChangeFile}
										name={'LOADER_DARK'}
									/>
								</label>
							</div>
						</div>
						<Button type="primary" className="green-btn minimal-btn">Save</Button>
					</div>
					<div className='divider'></div>
					<div>
						<div className='sub-title'>Exchange favicon</div>
						<div className='file-wrapper'>
							<div className='file-container'>
								<img
									src={icons.FAV_ICON || ''}
									alt='icon'
									className='icon-img'
								/>
								<label>
									<span className='anchor'>Upload</span>
									<input
										type="file"
										onChange={this.handleChangeFile}
										name={'FAV_ICON'}
									/>
								</label>
							</div>
						</div>
						<Button type="primary" className="green-btn minimal-btn">Save</Button>
					</div>
					<div className='divider'></div>
					<div>
						<div className='sub-title'>Onboarding background image</div>
						<div className='file-wrapper'>
							<div className='file-container'>
								<img
									src={icons.BOARDING_BACKGROUND_LIGHT || ''}
									alt='icon'
									className='icon-img'
								/>
								<label>
									<p style={{ whiteSpace: 'normal' }}>Light theme</p>
									<span className='anchor'>Upload</span>
									<input
										type="file"
										onChange={this.handleChangeFile}
										name={'BOARDING_BACKGROUND_LIGHT'}
									/>
								</label>
							</div>
							<div className='file-container'>
								<img
									src={icons.BOARDING_BACKGROUND_LIGHT || ''}
									alt='icon'
									className='icon-img'
								/>
								<label>
									<p style={{ whiteSpace: 'normal' }}>Dark theme</p>
									<span className='anchor'>Upload</span>
									<input
										type="file"
										onChange={this.handleChangeFile}
										name={'BOARDING_BACKGROUND_DARK'}
									/>
								</label>
							</div>
						</div>
						<Button type="primary" className="green-btn minimal-btn">Save</Button>
					</div>
					<div className='divider'></div>
					<div>
						<div className='form-wrapper'>
							<EmailSettingsForm
								initialValues={initialEmailValues}
								handleSubmitSettings={this.submitSettings}
							/>
						</div>
					</div>
					<div className='divider'></div>
						<Description />
					<div className='divider'></div>
				</div>
				<div>
					<FooterConfig />
				</div>
				<div className='divider'></div>
				<div className="general-wrapper">
					<div className='sub-title'>Helpdesk link</div>
					<div className='description'>
						This link will be used for your any help sections on your exchange.
						You can put a direct link to your helpdesk service or your support
						email address.
					</div>
					<div className='text-area-wrapper'>
						<div className='description'>Helpdesk</div>
						<Input defaultValue='http://' />
					</div>
					<div>
						<Button type='primary'>Save</Button>
					</div>
				</div>
				<div className='divider'></div>
				<div className="general-wrapper">
					<div className='sub-title'>Trading Interface</div>
					<div className='description'>
						Select the trading interface that will be available on your
						exchange. All interfaces includes a crypto wallet.
					</div>
					<div className='radio-btn-wrapper'>
						<Radio.Group>
							<Radio value='full'>
								Full interface
								<div className='flex-container'>
									<div className='small-text'>
										(Pro & quick trade with wallet)
									</div>
									<div className='box'>
										<div className='interface_container'>
											<div className='sell'>
												<span className='label'>SELL</span>
											</div>
											<div className='buy'>
												<span className='label'>BUY</span>
											</div>
										</div>
									</div>
									<div>
										<ReactSVG
											path={ICONS.CANDLES_LOGO}
											wrapperClassName='candle-icon'
										/>
									</div>
								</div>
							</Radio>
							<Radio value='pro-trade'>
								Pro trade only
								<div className='small-text'>
									(Chart, orderbook, limit orders with wallet)
								</div>
								<ReactSVG
									path={ICONS.CANDLES_LOGO}
									wrapperClassName='candle-icon'
								/>
							</Radio>
							<Radio value='quick-trade'>
								Quick trade only
								<div className='flex-container'>
									<div className='small-text'>
										(Simple buy/sell interface with wallet)
									</div>
									<div className='box interface'>
										<div className='interface_container'>
											<div className='sell'>
												<span className='label'>SELL</span>
											</div>
											<div className='buy'>
												<span className='label'>BUY</span>
											</div>
										</div>
									</div>
								</div>
							</Radio>
							<Radio value='wallet'>
								Wallet only
								<div className='flex-container'>
									<div className='small-text'>
										(No trading. Only crypto wallet)
									</div>
									<div className='box interface'>
										<ReactSVG
											path={ICONS.WALLET_BTC_ICON}
											wrapperClassName='wallet-icon'
										/>
									</div>
								</div>
							</Radio>
						</Radio.Group>
					</div>
					<div>
						<Button type='primary' disabled={true}>
							Save
						</Button>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	coins: state.app.coins,
	user: state.user,
	constants: state.app.constants
});

export default connect(mapStateToProps)(General);
