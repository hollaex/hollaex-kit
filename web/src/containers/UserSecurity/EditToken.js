import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import QRCode from 'qrcode.react';
import { Button } from 'components';
import STRINGS from 'config/localizedStrings';
import { Checkbox, Radio, Space, Input, Tag, Button as AntButton } from 'antd';
import DumbField from 'components/Form/FormFields/DumbField';

const BASIC_PERMISSIONS = ['can_read', 'can_trade'];
const ADVANCED_PERMISSIONS = ['can_withdraw'];
const OTHER_PERMISSIONS = ['whitelisting_enabled', 'whitelisted_ips'];
const ACCESS_TOKEN_DATA_KEYS = [
	...BASIC_PERMISSIONS,
	...ADVANCED_PERMISSIONS,
	...OTHER_PERMISSIONS,
];

class EditToken extends Component {
	constructor(props) {
		super(props);
		const {
			can_read,
			can_trade,
			can_withdraw,
			whitelisting_enabled,
			whitelisted_ips,
		} = this.props;

		this.state = {
			can_read,
			can_trade,
			can_withdraw,
			whitelisting_enabled,
			whitelisted_ips,
			ip: '',
		};
	}

	enableSaveButton = () => {
		let enabled = false;
		ACCESS_TOKEN_DATA_KEYS.forEach((key) => {
			if (this.state[key] !== this.props[key]) {
				enabled = true;
			}
		});
		return enabled;
	};

	validateIp = () => {
		const { ip } = this.state;
		const rx = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/;

		return rx.test(ip);
	};

	onChangeBasicAccess = (permissions) => {
		const basicPermissions = {};
		BASIC_PERMISSIONS.forEach((permission) => {
			basicPermissions[permission] = permissions.includes(permission);
		});

		this.setState({ ...basicPermissions });
	};

	onChangeAdvancedAccess = (permissions) => {
		const advancedPermissions = {};
		ADVANCED_PERMISSIONS.forEach((permission) => {
			advancedPermissions[permission] = permissions.includes(permission);
		});

		this.setState({ ...advancedPermissions });
	};

	onChangeIPAccess = ({ target: { value } }) => {
		this.setState({
			whitelisting_enabled: value === 'only-trusted',
		});
	};

	addIP = () => {
		const { ip } = this.state;
		this.setState((prevState) => ({
			...prevState,
			whitelisted_ips: [
				...prevState.whitelisted_ips.filter((value) => value !== ip),
				ip,
			],
			ip: '',
		}));
	};

	onChangeIp = ({ target: { value: ip } }) => {
		this.setState({ ip });
	};

	removeIp = (ip) => {
		this.setState((prevState) => ({
			...prevState,
			whitelisted_ips: [
				...prevState.whitelisted_ips.filter((value) => value !== ip),
			],
		}));
	};

	onSave = () => {
		const { onEdit, id: token_id } = this.props;
		const {
			can_read,
			can_trade,
			can_withdraw,
			whitelisting_enabled,
			whitelisted_ips,
		} = this.state;

		const data = {
			token_id,
			permissions: {
				can_read,
				can_trade,
				can_withdraw,
			},
			whitelisting_enabled,
			whitelisted_ips: whitelisting_enabled ? whitelisted_ips : [],
		};

		onEdit(data);
	};

	render() {
		const { whitelisting_enabled, whitelisted_ips, ip } = this.state;
		const { apiKey, secret, otp_enabled } = this.props;

		const props_api_key = {
			stringId: 'DEVELOPERS_TOKEN.API_KEY',
			label: STRINGS['DEVELOPERS_TOKEN.API_KEY'],
			className: 'pr-2',
			value: apiKey,
			allowCopy: true,
			fullWidth: true,
		};

		const props_secret_key = {
			stringId: 'DEVELOPERS_TOKENS_POPUP.SECRET_KEY_LABEL',
			label: STRINGS['DEVELOPERS_TOKENS_POPUP.SECRET_KEY_LABEL'],
			className: 'pr-2',
			value: secret,
			fullWidth: true,
			allowCopy: true,
		};

		const isHiddenSecret = secret.includes('*');

		const basicPermissions = BASIC_PERMISSIONS.filter(
			(value) => this.state[value]
		);
		const advancedPermissions = ADVANCED_PERMISSIONS.filter(
			(value) => this.state[value]
		);
		const IPPermission = whitelisting_enabled ? 'only-trusted' : 'any';

		return (
			<div
				className={classnames('edit_token d-flex py-4 small-expandable', {
					overlay: !otp_enabled,
				})}
			>
				<div className="qr-code-bg">
					<QRCode value={apiKey} />
				</div>
				<div>
					<div className="d-flex flex-direction-column token-keys-wrapper">
						<div className="pl-4">
							<DumbField {...props_api_key} />
						</div>
						<div className="pl-4">
							{isHiddenSecret ? (
								<Fragment>
									<div>{STRINGS['DEVELOPERS_TOKEN.SECRET_KEY']}</div>
									<div className="secondary-text">{secret}</div>
								</Fragment>
							) : (
								<DumbField {...props_secret_key} />
							)}
						</div>
					</div>
					<div className="kit-divider" />
					<div>
						<div className="important-text bold">
							{STRINGS['DEVELOPERS_TOKEN.ACCESS']}
						</div>
						<div className="d-flex py-4">
							<div className="flex-col">
								<div className="important-text">
									{STRINGS['DEVELOPERS_TOKEN.BASIC_ACCESS']}
								</div>
								<div className="secondary-text">
									{STRINGS['DEVELOPERS_TOKEN.BASIC_ACCESS_PROMPT']}
								</div>
								<div className="py-3">
									<Checkbox.Group
										onChange={this.onChangeBasicAccess}
										options={[
											{
												label: STRINGS['DEVELOPERS_TOKEN.READING_ACCESS'],
												value: 'can_read',
											},
											{
												label: STRINGS['DEVELOPERS_TOKEN.TRADING_ACCESS'],
												value: 'can_trade',
											},
										]}
										value={basicPermissions}
									/>
								</div>
							</div>
							<div className="flex-col">
								<div className="important-text">
									{STRINGS['DEVELOPERS_TOKEN.IP_ACCESS']}
								</div>
								<div className="secondary-text">
									{STRINGS['DEVELOPERS_TOKEN.IP_ACCESS_PROMPT']}
								</div>
								<div className="py-3">
									<Radio.Group
										value={IPPermission}
										onChange={this.onChangeIPAccess}
									>
										<Space direction="vertical">
											<Radio value="any">
												{STRINGS['DEVELOPERS_TOKEN.ANY_IP_ADDRESS']}
											</Radio>
											<Radio value="only-trusted">
												{STRINGS['DEVELOPERS_TOKEN.ONLY_TRUSTED_IPS']}
											</Radio>
										</Space>
									</Radio.Group>
									{whitelisting_enabled && (
										<Fragment>
											<div
												className={classnames({
													'pt-3': whitelisted_ips.length,
												})}
											>
												{whitelisted_ips.map((ip) => (
													<Tag
														key={ip}
														closable={true}
														onClose={() => this.removeIp(ip)}
													>
														{ip}
													</Tag>
												))}
											</div>
											<div className="d-flex kit-divider">
												<Input
													placeholder={STRINGS['DEVELOPERS_TOKEN.ADD_IP_PH']}
													bordered={false}
													value={ip}
													onChange={this.onChangeIp}
												/>
												<AntButton
													type="link"
													onClick={this.addIP}
													disabled={!this.validateIp()}
												>
													{STRINGS['DEVELOPERS_TOKEN.ADD_IP']}
												</AntButton>
											</div>
										</Fragment>
									)}
								</div>
							</div>
							<div className="flex-col">
								<div className="important-text">
									{STRINGS['DEVELOPERS_TOKEN.ADVANCED_ACCESS']}
								</div>
								<div className="secondary-text">
									{STRINGS['DEVELOPERS_TOKEN.ADVANCED_ACCESS_PROMPT']}
								</div>
								<div className="py-3">
									<Checkbox.Group
										onChange={this.onChangeAdvancedAccess}
										options={[
											{
												label: STRINGS['DEVELOPERS_TOKEN.WITHDRAWAL_ACCESS'],
												value: 'can_withdraw',
											},
										]}
										value={advancedPermissions}
									/>
								</div>
							</div>
						</div>
						<div>
							<Button
								className="holla-button"
								stringId="DEVELOPERS_TOKEN.SAVE"
								label={STRINGS['DEVELOPERS_TOKEN.SAVE']}
								onClick={this.onSave}
								disabled={!otp_enabled || !this.enableSaveButton()}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

EditToken.defaultProps = {
	permissions: {
		can_read: false,
		can_trade: false,
		can_withdraw: false,
	},
	whitelisted_ips: [],
	whitelisting_enabled: false,
	apiKey: '',
	secret: '',
};

export default EditToken;
