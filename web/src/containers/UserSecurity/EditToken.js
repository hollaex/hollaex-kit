import React, { Component, Fragment } from 'react';
import { Button } from 'components';
import STRINGS from 'config/localizedStrings';
import { Checkbox, Radio, Space, Input, Tag, Button as AntButton } from 'antd';
import DumbField from 'components/Form/FormFields/DumbField';

const BASIC_PERMISSIONS = ['can_read', 'can_trade'];
const ADVANCED_PERMISSIONS = ['can_withdraw'];

class EditToken extends Component {
	constructor(props) {
		super(props);
		const {
			permissions: { can_read, can_trade, can_withdraw },
			enabled_whitelisting,
			whitelisted_ips,
		} = this.props;

		this.state = {
			can_read,
			can_trade,
			can_withdraw,
			enabled_whitelisting,
			whitelisted_ips,
			ip: '',
		};
	}

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
			enabled_whitelisting: value === 'only-trusted',
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
		const {
			can_read,
			can_trade,
			can_withdraw,
			enabled_whitelisting,
			whitelisted_ips,
		} = this.state;

		const data = {
			permissions: {
				can_read,
				can_trade,
				can_withdraw,
			},
			enabled_whitelisting,
			whitelisted_ips: enabled_whitelisting ? whitelisted_ips : [],
		};

		console.log(data);
	};

	render() {
		const { enabled_whitelisting, whitelisted_ips, ip } = this.state;
		const { apiKey, secret } = this.props;
		const radioStyle = {
			display: 'block',
			height: '30px',
			lineHeight: '30px',
		};

		const props_api_key = {
			stringId: 'DEVELOPERS_TOKEN.API_KEY',
			label: STRINGS['DEVELOPERS_TOKEN.API_KEY'],
			className: 'pr-2',
			value: apiKey,
			allowCopy: true,
			fullWidth: true,
		};

		const basicPermissions = BASIC_PERMISSIONS.filter(
			(value) => this.state[value]
		);
		const advancedPermissions = ADVANCED_PERMISSIONS.filter(
			(value) => this.state[value]
		);
		const IPPermission = enabled_whitelisting ? 'only-trusted' : 'any';

		return (
			<div className="edit_token d-flex">
				<div>QR CODE / ICON</div>
				<div>
					<div className="d-flex">
						<div className="w-50">
							<DumbField {...props_api_key} />
						</div>
						<div className="w-50 pl-4">
							<div>{STRINGS['DEVELOPERS_TOKEN.SECRET_KEY']}</div>
							<div className="secondary-text">{secret}</div>
						</div>
					</div>
					<div className="kit-divider" />
					<div>
						<div className="important-text bold">
							{STRINGS['DEVELOPERS_TOKEN.ACCESS']}
						</div>
						<div className="d-flex py-4">
							<div>
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
							<div>
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
									{enabled_whitelisting && (
										<Fragment>
											<div>
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
											<div className="d-flex">
												<Input
													placeholder={STRINGS['DEVELOPERS_TOKEN.ADD_IP_PH']}
													bordered={false}
													value={ip}
													onChange={this.onChangeIp}
												/>
												<AntButton
													type="link"
													onClick={this.addIP}
													disabled={!ip}
												>
													{STRINGS['DEVELOPERS_TOKEN.ADD_IP']}
												</AntButton>
											</div>
										</Fragment>
									)}
								</div>
							</div>
							<div>
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
								className="w-50"
								stringId="DEVELOPERS_TOKEN.SAVE"
								label={STRINGS['DEVELOPERS_TOKEN.SAVE']}
								onClick={this.onSave}
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
		can_read: true,
		can_trade: false,
		can_withdraw: false,
	},
	whitelisted_ips: [],
	enabled_whitelisting: false,
	apiKey: '',
	secret: '',
};

export default EditToken;
