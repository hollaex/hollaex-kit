import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { Modal, Input, Button, Select, message, Spin } from 'antd';
import { CaretDownOutlined, WarningOutlined } from '@ant-design/icons';
import { STATIC_ICONS } from 'config/icons';
import { Table } from 'components';
import {
	sendEmailCode,
	generateToken,
	editToken,
	revokeToken,
} from 'actions/userAction';
import { generateHeaders } from './utils';
import EditToken from './EditToken';

const GenerateAPiKeys = ({
	tokenGenerated,
	tokens,
	requestTokens,
	tokenRevoked,
	user,
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const [tokenTypeAndData, setTokenTypeAndData] = useState({});
	const [currentStep, setCurrentStep] = useState('');
	const [userDetails, setUserDetails] = useState({});
	const [selectedRole, setSelectedRole] = useState('');
	const [ipAddress, setIPAddress] = useState('');
	const [displayQR, setDisplayQR] = useState(false);
	const [loading, setLoading] = useState(false);

	const ipAddressInput = useRef(null);

	useEffect(() => {
		if (!tokens.data) {
			setLoading(true);
		}
		setDisplayQR(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (currentStep === 'step4') {
			sendEmailCode();
		}
	}, [currentStep]);

	const onGenerateToken = () => {
		const {
			code: email_code,
			otp: otp_code,
			name,
			whitelisted_ips,
			role,
		} = userDetails;
		setLoading(true);
		return generateToken({ otp_code, name, email_code, whitelisted_ips, role })
			.then(({ data: { key: apiKey, ...rest } }) => {
				const response = { apiKey, ...rest };
				tokenGenerated(response);
				requestTokens();
				setDisplayQR(true);
				setCurrentStep('');
				setLoading(false);
				return response;
			})

			.catch((err) => {
				setLoading(false);
				message.error(err?.response?.data?.message);
			});
	};

	const onEditToken = (editData) => {
		const data = {
			token_id: editData.id,
			permissions: {
				can_read: editData.can_read,
				can_trade: editData.can_trade,
				can_withdraw: editData.can_withdraw,
			},
			otp_code: userDetails.otp,
			email_code: userDetails.code,
		};

		setLoading(true);
		return editToken({ ...data })
			.then(({ data }) => {
				requestTokens();
				setCurrentStep('');
				setLoading(false);
				return data;
			})

			.catch((err) => {
				setLoading(false);
				message.error(err?.response?.data?.message);
			});
	};

	const onRemoveToken = (data) => {
		setLoading(true);
		return revokeToken(data.id, userDetails.otp, userDetails.code)
			.then((resp) => {
				const { data } = resp;
				tokenRevoked(data);
				setLoading(false);
				requestTokens();
			})

			.catch((err) => {
				setLoading(false);
				message.error(err?.response?.data?.message);
			});
	};

	const onSubmitToken = () => {
		const { type, data } = tokenTypeAndData;
		if (type === 'edit') {
			onEditToken(data);
		} else if (type === 'revoke') {
			onRemoveToken(data);
		} else {
			onGenerateToken();
		}
	};

	const handleEditData = (data) => {
		setIsVisible(true);
		if (data.type === 'revoke') {
			setCurrentStep('revoke');
		} else {
			setCurrentStep('step4');
		}
		setTokenTypeAndData(data);
	};

	const handleAddIPAddress = (e) => {
		const ipformat = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/;
		if (userDetails.whitelisted_ips?.includes(ipAddress)) {
			message.error('IP address already exist');
		} else if (ipAddress === '' || !ipformat.test(ipAddress)) {
			message.error('Please enter the valid IP address');
		} else {
			setUserDetails({
				...userDetails,
				whitelisted_ips: userDetails.whitelisted_ips
					? [...userDetails.whitelisted_ips, ipAddress]
					: [ipAddress],
			});
			setIPAddress('');
			ipAddressInput.current.handleReset(e);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setUserDetails({ ...userDetails, role: selectedRole, [name]: value });
	};

	const handleNext = () => {
		if (currentStep === '') {
			setCurrentStep('step2');
		} else if (currentStep === 'step2') {
			setCurrentStep('step3');
		} else if (currentStep === 'step3') {
			setCurrentStep('step4');
		} else if (currentStep === 'step4') {
			onSubmitToken();
			setIsVisible(false);
		} else if (currentStep === 'revoke') {
			setCurrentStep('step4');
		}
	};

	const handleBack = () => {
		if (
			currentStep === '' ||
			currentStep === 'revoke' ||
			tokenTypeAndData.type === 'edit'
		) {
			setIsVisible(false);
		} else if (currentStep === 'step2') {
			setCurrentStep('');
		} else if (currentStep === 'step3') {
			setCurrentStep('step2');
		} else if (currentStep === 'step4') {
			setCurrentStep('step3');
		}
	};

	const nextBtnDisable = () => {
		let isEnabled = true;
		if (currentStep === '') {
			if (userDetails.name && userDetails.name !== '') isEnabled = false;
		} else if (currentStep === 'step2') {
			if (
				userDetails.whitelisted_ips &&
				userDetails.whitelisted_ips.length !== 0
			)
				isEnabled = false;
		} else if (currentStep === 'step3') {
			if (selectedRole && selectedRole !== '') isEnabled = false;
		} else if (currentStep === 'step4') {
			if (
				userDetails.code &&
				userDetails.otp &&
				userDetails.code !== '' &&
				userDetails.otp.length === 6
			)
				isEnabled = false;
		} else if (currentStep === 'revoke') {
			isEnabled = false;
		}
		return isEnabled;
	};

	const onHandleModalOpen = () => {
		setIsVisible(true);
		setUserDetails({});
		setCurrentStep('');
	};

	const renderModalContent = () => {
		switch (currentStep) {
			case 'step2':
				return (
					<div
						className={
							userDetails.whitelisted_ips
								? 'generate-api-steps-wrapper mb-4'
								: 'generate-api-steps-wrapper'
						}
					>
						<div className="header-txt">
							<p>
								Input a white listed IP address that will be associated with
								this generated API key.
							</p>
							<p>This key will only be usable from this IP address</p>
						</div>
						<div className="generate-api-field-txt">
							<p>IP address</p>
							<Input
								name="ipAddress"
								value={ipAddress}
								ref={ipAddressInput}
								onChange={(e) => setIPAddress(e.target.value)}
								placeholder="Input an IP address"
							/>
							<span
								className="ml-3 underline-text pointer opacity"
								onClick={(e) => handleAddIPAddress(e)}
							>
								Add
							</span>
						</div>
						{userDetails.whitelisted_ips &&
							userDetails.whitelisted_ips.map((name) => {
								return <span className="ip-field mb-3 ml-1">{name}</span>;
							})}
					</div>
				);
			case 'step3':
				return (
					<div className="generate-api-steps-wrapper">
						<div className="header-txt">
							<p>Select the type of API key</p>
						</div>
						<div className="generate-api-select-field">
							<p>Key type</p>
							<Select
								placeholder="select key type"
								suffixIcon={<CaretDownOutlined />}
								showArrow={true}
								onChange={(value) => setSelectedRole(value)}
								options={[
									{
										label: 'Select Role',
										options: [
											{
												className: 'role-option',
												name: 'role',
												value: 'admin',
												label: (
													<>
														<img
															src={STATIC_ICONS.BLUE_ADMIN_KEY}
															alt="key"
															className="key-option-icon"
														/>
														Admin
													</>
												),
											},
											{
												className: 'role-option',
												name: 'role',
												value: 'user',
												label: (
													<>
														<img
															src={STATIC_ICONS.BLUE_ADMIN_KEY}
															alt="key"
															className="key-option-icon"
														/>
														User
													</>
												),
											},
										],
									},
								]}
							/>
						</div>
					</div>
				);
			case 'step4':
				return (
					<div className="generate-api-steps-wrapper">
						<div className="header-txt">
							<p>
								A unique code was sent to your email that is required to finish
								the process.
							</p>
							<p>
								Please input the code sent to your email below along with your
								2FA code.
							</p>
						</div>
						<div className="generate-api-field-txt">
							<p>Input code (please check your email)</p>
							<Input
								name="code"
								value={userDetails ? userDetails.code : ''}
								onChange={(e) => handleChange(e)}
								placeholder="Input code sent to email"
							/>
						</div>
						<div className="generate-api-field-txt">
							<p>2FA code (OTP)</p>
							<Input
								name="otp"
								value={userDetails ? userDetails.otp : ''}
								onChange={(e) => handleChange(e)}
								placeholder="Input 6-digit 2FA code"
							/>
						</div>
					</div>
				);

			case 'revoke':
				return (
					<div className="d-flex">
						<img
							src={STATIC_ICONS.REVOKE_KEY}
							alt="key"
							className="key-icon revoke-key"
						/>
						<div className="custom-image"></div>
						<div className="font-size-small">
							<div className="revoke-header">Revoke key</div>
							<div>
								Revoking your API key is irreversible. However, a new key can be
								generated at
							</div>
							<div>anytime. Do you want to revoke this API key ?</div>
						</div>
					</div>
				);

			default:
				return (
					<div className="generate-api-steps-wrapper">
						<div className="header-txt">
							<p>Name Your API key</p>
						</div>
						<div className="generate-api-field-txt">
							<p>API key name</p>
							<Input
								name="name"
								value={userDetails ? userDetails.name : ''}
								onChange={(e) => handleChange(e)}
								placeholder="Input name"
							/>
						</div>
					</div>
				);
		}
	};

	const footerBtn = () => {
		return (
			<div className="footer">
				<Button className="mr-5" type="sucess" onClick={handleBack}>
					Back
				</Button>
				<Button type="sucess" onClick={handleNext} disabled={nextBtnDisable()}>
					{currentStep === 'revoke' ? 'Proceed' : 'Next'}
				</Button>
			</div>
		);
	};

	return (
		<div className="generate-api">
			{loading ? (
				<Spin size="medium" />
			) : (
				<>
					{!user.otp_enabled && (
						<div className="authentication-wrapper">
							<div>
								<p>
									<WarningOutlined />
								</p>
								<p>
									To Generate API key you need to enable the 2-facotr
									authentication.
								</p>
							</div>
							<Link to="/security">Enable 2FA</Link>
						</div>
					)}
					<div className="mb-5 mt-4">
						{user.otp_enabled && (
							<div className="d-flex">
								<img
									src={STATIC_ICONS.BLUE_ADMIN_KEY}
									alt="key"
									className="key-icon"
								/>
								<span
									onClick={onHandleModalOpen}
									className="ml-2 underline-text pointer"
								>
									Generate API key.
								</span>
							</div>
						)}
					</div>
					<Table
						key={(data) => {
							return data.id;
						}}
						className={!user.otp_enabled && 'disable-table'}
						rowClassName="pt-2 pb-2"
						headers={generateHeaders(handleEditData)}
						data={tokens.data}
						rowKey={(data) => {
							return data.id;
						}}
						count={tokens.count}
						expandable={{
							rowExpandable: () => true,
							defaultExpanded: (row, index) => index === 0,
							expandedRowRender: (record, inx) => (
								<EditToken
									handleEditData={handleEditData}
									displayQR={displayQR}
									record={record}
									inx={inx}
								/>
							),
						}}
					/>
					<Modal
						className="generate-api-modal"
						visible={isVisible}
						onCancel={() => setIsVisible(false)}
						footer={null}
					>
						<div className="generate-api-container">
							<h5 className={currentStep === 'revoke' && 'revoke'}>
								{currentStep === 'revoke' ? '' : 'Generate API keys'}
							</h5>
							{renderModalContent()}
							{footerBtn()}
						</div>
					</Modal>
				</>
			)}
		</div>
	);
};

export default GenerateAPiKeys;
