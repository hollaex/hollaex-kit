import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DownloadOutlined, HomeOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu, Row, Col, Spin } from 'antd';
// import io from 'socket.io-client';
import { debounce } from 'lodash';

import { PATHS } from '../paths';
import SetupWizard from '../SetupWizard';
import {
	removeToken,
	isLoggedIn,
	isSupport,
	isSupervisor,
	isAdmin,
	getTokenTimestamp
} from '../../../utils/token';
import { checkUserSessionExpired } from '../../../utils/utils';
import { getExchangeInitialized } from '../../../utils/initialize';
import { logout } from '../../../actions/authAction';
import { getMe, setMe } from '../../../actions/userAction';
import {
	setPairsData
} from '../../../actions/orderbookAction';
import {
	setPairs,
	changePair,
	setCurrencies,
	setOrderLimits,
	setValidBaseCurrency,
	setConfig,
	setLanguage,
	changeTheme,
	requestAvailPlugins,
	requestInitial,
	requestConstant,
	requestAdminData
} from '../../../actions/appActions';
import { SESSION_TIME, BASE_CURRENCY, ADMIN_GUIDE_DOWNLOAD_LINK } from '../../../config/constants';

import MobileDetect from 'mobile-detect';
import MobileSider from './mobileSider';
import './index.css';
import 'antd/dist/antd.css';

const md = new MobileDetect(window.navigator.userAgent);

const { Content, Sider } = Layout;

class AppWrapper extends React.Component {
	constructor(prop) {
		super(prop);
		this.state = {
			isSupportUser: false,
			isSupervisorUser: false,
			isAdminUser: false,
			isLoaded: false,
			appLoaded: false,
			publicSocket: undefined,
			idleTimer: undefined,
			setupCompleted: true,
			initialLoading: true
		};
	}

	componentWillMount() {
		if (isLoggedIn() && checkUserSessionExpired(getTokenTimestamp())) {
			this.logout('Token is expired');
		}
	}

	componentDidMount() {
		// if (!this.props.fetchingAuth && !Object.keys(this.props.pairs).length) {
		if (!this.props.fetchingAuth) {
			this.initSocketConnections();
		}
		const initialized = getExchangeInitialized();
		if (initialized === 'false' || (typeof initialized === 'boolean' && !initialized)) {
			this.props.router.push('/init');
		}
		this.requestAdminInitialize();
		this._resetTimer();
		this.props.requestAvailPlugins();
		this.setState({
			isSupportUser: isSupport(),
			isSupervisorUser: isSupervisor(),
			isAdminUser: isAdmin(),
			isLoaded: true
		});
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		// if (
		// 	!nextProps.fetchingAuth &&
		// 	nextProps.fetchingAuth !== this.props.fetchingAuth &&
		// 	!Object.keys(this.props.pairs).length
		// ) {
		if (
			!nextProps.fetchingAuth &&
			nextProps.fetchingAuth !== this.props.fetchingAuth
		) {
			if (!this.state.publicSocket) {
				this.initSocketConnections();
			}
		}
	}

	componentWillUnmount() {

		if (this.state.idleTimer) {
			clearTimeout(this.state.idleTimer);
		}
	}

	requestAdminInitialize = () => {
		requestAdminData()
			.then((res) => {
				if (res.data) {
					if (res.data.secrets) {
						this.setState({ setupCompleted: res.data.secrets.setup_completed });
					}
				}
				this.setState({ initialLoading: false });
			})
			.catch(err => {
				this.setState({ initialLoading: false });
				console.error(err);
			})
	};

	initSocketConnections = () => {
		this.setPublicWS();
		if (isLoggedIn()) {
			this.setUserSocket();
		}
		this.setState({ appLoaded: true }, () => {
			this._resetTimer();
		});
	};

	_resetTimer = () => {
		if (this.state.idleTimer) {
			clearTimeout(this.idleTimer);
		}
		if (this.state.appLoaded) {
			const idleTimer = setTimeout(
				() => this.logout('Inactive'),
				SESSION_TIME
			); // no activity will log the user out automatically
			this.setState({ idleTimer });
		}
	};

	resetTimer = debounce(this._resetTimer, 250);

	setPublicWS = () => {

		requestInitial()
			.then(res => {
				if (res && res.data) {
					this.props.setConfig(res.data);
				}
			})
			.catch(err => {
				console.error(err);
			});

		requestConstant()
			.then(res => {
				if (res && res.data) {
					if (!this.props.pair) {
						const pair = Object.keys(res.data.pairs)[0];
						this.props.changePair(pair);
					}
					this.props.setPairs(res.data.pairs);
					this.props.setPairsData(res.data.pairs);
					this.props.setCurrencies(res.data.coins);
					const pairWithBase = Object.keys(res.data.pairs).filter((key) => {
						let temp = res.data.pairs[key];
						return temp.pair_2 === BASE_CURRENCY;
					});
					const isValidPair = pairWithBase.length > 0;
					this.props.setValidBaseCurrency(isValidPair);
					const orderLimits = {};
					Object.keys(res.data.pairs).map((pair, index) => {
						orderLimits[pair] = {
							PRICE: {
								MIN: res.data.pairs[pair].min_price,
								MAX: res.data.pairs[pair].max_price,
								STEP: res.data.pairs[pair].increment_price
							},
							SIZE: {
								MIN: res.data.pairs[pair].min_size,
								MAX: res.data.pairs[pair].max_size,
								STEP: res.data.pairs[pair].increment_price
							}
						};
						return '';
					});
					this.props.setOrderLimits(orderLimits);
				}
			})
			.catch(err => {
				console.error(err);
			});
	};

	setUserSocket = (token) => {
		this.props.getMe()
			.then(({ value }) => {
				if (value && value.data && value.data.id) {
					const data = value.data;
						this.props.setMe(data);
						if (
							data.settings &&
							data.settings.language !== this.props.activeLanguage
						) {
							this.props.changeLanguage(data.settings.language);
						}
						if (
							data.settings.interface &&
							data.settings.interface.theme !== this.props.activeTheme
						) {
							this.props.changeTheme(data.settings.interface.theme);
							localStorage.setItem('theme', data.settings.interface.theme);
						}
				}
			})
			.catch((err) => {
				console.log('err', err);
				let error = err.message;
				if (err.data && err.data.message) {
					error = err.data.message;
				}
				if (error.indexOf('Access Denied') > -1) {
					this.logout('Token is expired');
				}
			})
	};

	isSocketDataReady = () => {
		const { pairs } = this.props;
		return Object.keys(pairs).length;
	};

	logout = (message = '') => {
		this.setState({ appLoaded: false }, () => {
			this.props.logout(typeof message === 'string' ? message : '');
		});
	};

	renderMenuItem = ({ path, label, routeKey, ...rest }, index) => {
		let showLabel = label;
		if (routeKey === 'main') {
			showLabel = this.props.constants.api_name || ''
		}
		return (
			<Menu.Item key={index}>
				<Link to={path} className="no-link">
					{showLabel}
				</Link>
			</Menu.Item>
		);
	}

	render() {
		const { children, router } = this.props;
		const logout = () => {
			removeToken();
			router.replace('/login');
		};
		const { isAdminUser, isLoaded, appLoaded, initialLoading, setupCompleted } = this.state;

		if (!isLoaded || initialLoading) return null;
		if (!isLoggedIn()) {
			router.replace('/login');
		}
		if (isLoggedIn() && !isAdminUser) {
			router.replace('/summary');
		}
		if (!setupCompleted) {
			return (
				<SetupWizard />
			);
		}
		if (md.phone()) {
			return (
				<Layout>
					<Row>
						<Col span={8}>
							<MobileSider menuItem={this.renderMenuItem} logout={logout} />
						</Col>

						{/*<Sider style={{width: 100}}>*/}
						{/*<Menu theme="dark" mode="vertical" style={{ lineHeight: '64px' }} className="m-top">*/}
						{/*{PATHS.filter(*/}
						{/*({ hideIfSupport }) => !isSupportUser || !hideIfSupport*/}
						{/*).map(renderMenuItem)}*/}
						{/*<Menu.Item key="logout">*/}
						{/*<div onClick={logout}>*/}
						{/*<Icon type="logout" />LOGOUT*/}
						{/*</div>*/}
						{/*</Menu.Item>*/}
						{/*</Menu>*/}
						{/*</Sider>*/}

						<Col span={16}>
							<Layout>
								<Content style={{ marginLeft: 50, marginTop: 0 }}>
									<div className="content-wrapper">
										{appLoaded && this.isSocketDataReady()
											? children
											: <Spin size="large" className="m-top" />
										}
									</div>
								</Content>
							</Layout>
						</Col>
					</Row>
				</Layout>
			);
		} else {
			return (
				<Layout>
					<Sider>
						<div className="d-flex flex-column justify-content-between">
							<Menu
								theme="dark"
								mode="vertical"
								style={{ lineHeight: '64px' }}
								className="m-top"
							>
								{PATHS.filter(
									({ hideIfSupport, hideIfSupervisor, hideIfKYC }) =>
										true
								).map(this.renderMenuItem)}
								<Menu.Item>
									<Link to="/summary">
										<HomeOutlined />
										Go To HollaEx-WEB
									</Link>
								</Menu.Item>
								<Menu.Item key="logout">
									<div onClick={logout}>
										<LogoutOutlined />
										LOGOUT
									</div>
								</Menu.Item>
							</Menu>
							<Menu
								theme="dark"
								mode="vertical"
								style={{ lineHeight: '64px' }}
								className="m-top"
							>
								<Menu.Item style={{ fontSize: '14px', fontWeight: 'normal' }}>
									<Link
										href={ADMIN_GUIDE_DOWNLOAD_LINK}
										target="blank"
									>
										<DownloadOutlined />
										Admin Panel Guide
									</Link>
								</Menu.Item>
							</Menu>
						</div>
					</Sider>
					<Layout>
						<Content>
							<div className="content-wrapper">
								{appLoaded && this.isSocketDataReady()
									? children
									: <Spin size="large" className="m-top" />
								}
							</div>
						</Content>
					</Layout>
				</Layout>
			);
		}
	}
}

const mapStateToProps = (state) => ({
	fetchingAuth: state.auth.fetching,
	pairs: state.app.pairs,
	constants: state.app.constants
});

const mapDispatchToProps = (dispatch) => ({
	changePair: bindActionCreators(changePair, dispatch),
	setPairs: bindActionCreators(setPairs, dispatch),
	setPairsData: bindActionCreators(setPairsData, dispatch),
	setCurrencies: bindActionCreators(setCurrencies, dispatch),
	setConfig: bindActionCreators(setConfig, dispatch),
	setValidBaseCurrency: bindActionCreators(setValidBaseCurrency, dispatch),
	setOrderLimits: bindActionCreators(setOrderLimits, dispatch),
	getMe: bindActionCreators(getMe, dispatch),
	setMe: bindActionCreators(setMe, dispatch),
	changeLanguage: bindActionCreators(setLanguage, dispatch),
	changeTheme: bindActionCreators(changeTheme, dispatch),
	requestAvailPlugins: bindActionCreators(requestAvailPlugins, dispatch),
	logout: bindActionCreators(logout, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AppWrapper);
