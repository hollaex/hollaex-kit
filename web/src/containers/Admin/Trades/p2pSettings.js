import React, { useEffect, useState } from 'react';
import { Tabs, message, Modal, Button, Select, Checkbox, Input } from 'antd';
import { Radio, Space } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CloseOutlined } from '@ant-design/icons';
import { setExchange } from 'actions/assetActions';
import './index.css';

const TabPane = Tabs.TabPane;

const P2PSettings = () => {
	const [displayP2pModel, setDisplayP2pModel] = useState(false);
	const [displayFiatAdd, setDisplayFiatAdd] = useState(false);
	const [displayPaymentAdd, setDisplayPaymentAdd] = useState(false);
	const [displayNewPayment, setDisplayNewPayment] = useState(false);
	const [paymentFieldAdd, setPaymentFieldAdd] = useState(false);
	const [step, setStep] = useState(0);

	return (
		<div className="admin-earnings-container w-100">
			<div>
				Below is the status of the P2P system on your platform and the settings.
				Select what assets, KYC requirements and more are allowed on your
				platform.
			</div>
			<div
				style={{
					padding: 20,
					backgroundColor: 'rgba(255, 255, 255, 0.1)',
					width: 600,
				}}
			>
				<div>
					Currently the P2P markets have not been setup on your exchange.
				</div>
				<div
					style={{ cursor: 'pointer' }}
					onClick={() => {
						setDisplayP2pModel(true);
					}}
				>
					→ Click here to set up P2P trading
				</div>
			</div>

			<div style={{ opacity: 0.5 }}>
				<div style={{ marginBottom: 10, marginTop: 10 }}>
					<div style={{ fontSize: 20, marginBottom: 10, marginTop: 10 }}>
						Sides
					</div>
					<div style={{ marginBottom: 10 }}>Trade sides allowed:</div>
					<div style={{ borderBottom: '1px solid grey', width: 600 }}></div>
				</div>

				<div style={{ marginBottom: 10, marginTop: 10 }}>
					<div style={{ fontSize: 20, marginBottom: 10, marginTop: 10 }}>
						Crypto:
					</div>
					<div style={{ marginBottom: 10 }}>
						Cryptocurrencies allowed for trading:
					</div>
					<div style={{ borderBottom: '1px solid grey', width: 600 }}></div>
				</div>

				<div style={{ marginBottom: 10, marginTop: 10 }}>
					<div style={{ fontSize: 20, marginBottom: 10, marginTop: 10 }}>
						Fiat:
					</div>
					<div style={{ marginBottom: 10 }}>
						Fiat currencies allowed for trading:
					</div>
					<div style={{ borderBottom: '1px solid grey', width: 600 }}></div>
				</div>

				<div style={{ marginBottom: 10, marginTop: 10 }}>
					<div style={{ fontSize: 20, marginBottom: 10, marginTop: 10 }}>
						Payment methods:
					</div>
					<div style={{ marginBottom: 10 }}>
						Outside payment methods allowed:
					</div>
					<div style={{ borderBottom: '1px solid grey', width: 600 }}></div>
				</div>

				<div style={{ marginBottom: 10, marginTop: 10 }}>
					<div style={{ fontSize: 20, marginBottom: 10, marginTop: 10 }}>
						Manage:
					</div>
					<div style={{ marginBottom: 10 }}>Management fee:</div>
					<div style={{ borderBottom: '1px solid grey', width: 600 }}></div>
				</div>
			</div>

			{displayP2pModel && (
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#27339D',
						marginTop: 60,
					}}
					visible={displayP2pModel}
					width={600}
					footer={null}
					onCancel={() => {
						setDisplayP2pModel(false);
					}}
				>
					<h1 style={{ fontWeight: '600', color: 'white' }}>P2P setup</h1>

					{step === 0 && (
						<div>
							<div>Trade direction (side)</div>
							<div>
								Select what kind of deals that the vendors (market makers) can
								advertise.
							</div>

							<Select
								showSearch
								className="select-box"
								placeholder="Vendor buys crypto only"
								// value={}
								onChange={(e) => {}}
							>
								<Select.Option value={1}></Select.Option>
							</Select>

							<div style={{ fontSize: 13, marginTop: 10, marginBottom: 10 }}>
								Vendors (makers) can only offer to buy crypto from users
								(takers), who in turn can only sell to vendors.
							</div>
							<div
								style={{ borderBottom: '1px solid grey', marginBottom: 30 }}
							></div>
							<div>Crypto assets</div>
							<div>Select the crypto assets that vendors can transact with</div>
							<div>
								<Checkbox style={{ color: 'white' }}>
									HollaEx Token (XHT)
								</Checkbox>
							</div>
							<div>
								<Checkbox style={{ color: 'white' }}>Bitcoin (BTC)</Checkbox>
							</div>
							<div>
								<Checkbox style={{ color: 'white' }}>Ethereum (ETH)</Checkbox>
							</div>
							<div>
								<Checkbox style={{ color: 'white' }}>Tether (USDT)</Checkbox>
							</div>
						</div>
					)}

					{step === 1 && (
						<div>
							<div>Fiat currencies</div>
							<div>
								Select the fiat currencies to be used for P2P trading on your
								platform.
							</div>

							<div style={{ marginTop: 10, marginBottom: 10 }}>
								Add a fiat currency
							</div>

							<div
								style={{
									display: 'flex',
									display: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									backgroundColor: '#192491',
									padding: 70,
									textAlign: 'center',
								}}
							>
								<div>No fiat asset added yet.</div>
								<div
									onClick={() => {
										setDisplayFiatAdd(true);
									}}
								>
									Add here
								</div>
							</div>
						</div>
					)}

					{step === 2 && (
						<div>
							<div>Requirements</div>
							<div>
								Set the account required for users to P2P trade (market taker)
							</div>
							<div style={{ marginTop: 20, marginBottom: 40 }}>
								{' '}
								Vendors (market makers) can setup public P2P deals with their
								own prices however should be held to a higher standard as
								stipulated from your account tier levels.
							</div>

							<div style={{ marginBottom: 40 }}>
								<div style={{ fontSize: 20 }}>User account requirement</div>
								<div>
									<span style={{ fontWeight: 'bold' }}>
										{' '}
										User tier account level
									</span>{' '}
									(it is recommended to select a tier level that requires KYC
									verification)
								</div>
								<Select
									showSearch
									className="select-box"
									placeholder="Select a tier level:"
									// value={}
									onChange={(e) => {}}
								>
									<Select.Option value={1}></Select.Option>
								</Select>
								<div style={{ display: 'flex' }}>
									<div>ICON</div>
									<div>
										<div style={{ fontWeight: 'bold' }}>Requirements:</div>
										<div>• KYC Verification </div>
										<div>• Email Verification</div>
										<div>• SMS Verification</div>
									</div>
								</div>
							</div>

							<div style={{ fontSize: 20 }}>Vendor account requirement</div>
							<div>
								<span style={{ fontWeight: 'bold' }}>
									{' '}
									Vendor tier account level
								</span>{' '}
								(higher or equal to user account)
							</div>
							<Select
								showSearch
								className="select-box"
								placeholder="Select a tier level:"
								style={{ marginBottom: 40 }}
								// value={}
								onChange={(e) => {}}
							>
								<Select.Option value={1}></Select.Option>
							</Select>
						</div>
					)}

					{step === 3 && (
						<div>
							<div>Payment methods</div>
							<div>
								Select the fiat payment methods that will be used to settle
								transactions between P2P buyers and sellers. These methods will
								be used outside of your platform and should ideally include the
								fiat currencies that you have enabled for P2P trading on your
								platform.
							</div>

							<div
								style={{ marginTop: 10, marginBottom: 10 }}
								onClick={() => setDisplayPaymentAdd(true)}
							>
								Add/create a method
							</div>

							<div
								style={{
									display: 'flex',
									display: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									backgroundColor: '#192491',
									padding: 70,
									textAlign: 'center',
								}}
							>
								<div>No payment accounts added yet.</div>
								<div
									onClick={() => {
										setDisplayPaymentAdd(true);
									}}
								>
									Add here
								</div>
							</div>
							{/* <div style={{display: 'flex', display:'column',  justifyContent:'center', alignItems: 'center', backgroundColor: '#192491', padding: 10, width: '90%'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <div>ICON</div>
                                    <div>🆕 PayPal (Custom)</div>
                                    <div>EDIT</div>
                                    <div>REMOVE</div>
                                </div>
                            </div> */}
						</div>
					)}

					{step === 4 && (
						<div>
							<div>Platform management fees</div>
							<div>
								Apply a trading fee upon every P2P transaction that uses your
								platform. The fee percentage will be split between both vendor
								(maker) and user (taker) evenly.
							</div>

							<div
								style={{ marginTop: 10, marginBottom: 10 }}
								onClick={() => setDisplayPaymentAdd(true)}
							>
								Add/create a method
							</div>

							<div style={{ marginBottom: 20 }}>
								<div style={{ fontWeight: 'bold' }}>
									P2P Vendor percent trade fee
								</div>
								<Input placeholder="Input percentage fee" />
							</div>

							<div style={{ marginBottom: 20 }}>
								<div style={{ fontWeight: 'bold' }}>
									P2P Merchant percent trade fee
								</div>
								<Input placeholder="Input percentage fee" />
							</div>

							<div style={{ marginBottom: 20 }}>
								<div>Vendor fee: 0.0%</div>
								<div>User fee: 0.0%</div>
							</div>

							<div>
								The minimum fee allowed to apply is dependent on exchange
								system's plan:
							</div>
							<div>https://www.hollaex.com/pricing</div>
						</div>
					)}

					{step === 5 && (
						<div>
							<div>Review and confirm</div>
							<div>Below are your P2P settings</div>

							<div>
								Please check the details below are correct and confirm.{' '}
							</div>
							<div style={{ marginBottom: 10 }}>
								After confirming the P2P market page will be in view and
								available for user merchants and traders
							</div>

							<div
								style={{
									width: '90%',
									border: '1px solid white',
									marginBottom: 20,
									padding: 20,
								}}
							>
								<div
									style={{ display: 'flex', justifyContent: 'space-between' }}
								>
									<div>
										<div>Type of P2P deals:</div>
										<div>SELL</div>
									</div>
									<div>EDIT</div>
								</div>
							</div>

							<div
								style={{
									width: '90%',
									border: '1px solid white',
									marginBottom: 20,
									padding: 20,
								}}
							>
								<div
									style={{ display: 'flex', justifyContent: 'space-between' }}
								>
									<div>
										<div>Type of P2P deals:</div>
										<div>SELL</div>
									</div>
									<div>EDIT</div>
								</div>
							</div>
						</div>
					)}

					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: 15,
							justifyContent: 'space-between',
							marginTop: 30,
						}}
					>
						<Button
							onClick={() => {
								setDisplayP2pModel(false);
							}}
							style={{
								backgroundColor: '#288500',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							Back
						</Button>
						<Button
							onClick={async () => {
								setStep(step + 1);
							}}
							style={{
								backgroundColor: '#288500',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
							disabled={false}
						>
							NEXT
						</Button>
					</div>
				</Modal>
			)}

			{displayFiatAdd && (
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#27339D',
						marginTop: 60,
					}}
					visible={displayP2pModel}
					width={450}
					footer={null}
					onCancel={() => {
						setDisplayFiatAdd(false);
					}}
				>
					<h1 style={{ fontWeight: '600', color: 'white' }}>
						Select fiat to add
					</h1>

					<div>
						<div>Search fiat</div>
						<Select
							showSearch
							className="select-box"
							placeholder="fiat name or symbol"
							// value={}
							onChange={(e) => {}}
						>
							<Select.Option value={1}></Select.Option>
						</Select>

						<div style={{ fontSize: 13, marginTop: 10, marginBottom: 10 }}>
							Fiat:
						</div>
						<div
							style={{
								width: '90%',
								height: 200,
								padding: 10,
								border: '1px solid white',
							}}
						>
							<div>
								<span>ICON</span> <span>EURO(eur)</span>
							</div>
						</div>
					</div>

					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: 15,
							justifyContent: 'space-between',
							marginTop: 30,
						}}
					>
						<Button
							onClick={() => {
								setDisplayFiatAdd(false);
							}}
							style={{
								backgroundColor: '#288500',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							Back
						</Button>
					</div>
				</Modal>
			)}

			{displayPaymentAdd && (
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#27339D',
						marginTop: 60,
					}}
					visible={displayP2pModel}
					width={450}
					footer={null}
					onCancel={() => {
						setDisplayPaymentAdd(false);
					}}
				>
					<h1 style={{ fontWeight: '600', color: 'white' }}>
						Select payment methods to add
					</h1>

					<div>
						<div>Search payment methods</div>
						<Select
							showSearch
							className="select-box"
							placeholder="Input payment system"
							// value={}
							onChange={(e) => {}}
						>
							<Select.Option value={1}></Select.Option>
						</Select>

						<div style={{ fontSize: 13, marginTop: 10, marginBottom: 10 }}>
							Fiat:
						</div>
						<div
							style={{
								width: '90%',
								height: 200,
								padding: 10,
								border: '1px solid white',
							}}
						>
							<div>
								<span>ICON</span> <span>SWIFT (Bank transfer)</span>
							</div>
						</div>
					</div>

					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: 15,
							justifyContent: 'space-between',
							marginTop: 30,
						}}
					>
						<Button
							onClick={() => {
								setDisplayPaymentAdd(false);
							}}
							style={{
								backgroundColor: '#288500',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							Back
						</Button>
					</div>
					<div>Can't find your local payment method?</div>
					<div
						onClick={() => {
							setDisplayNewPayment(true);
						}}
					>
						Create and add a new payment method
					</div>
				</Modal>
			)}

			{displayNewPayment && (
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#27339D',
						marginTop: 60,
					}}
					visible={displayP2pModel}
					width={600}
					footer={null}
					onCancel={() => {
						setDisplayNewPayment(false);
					}}
				>
					<h1 style={{ fontWeight: '600', color: 'white' }}>
						Create and add new payment methods
					</h1>
					<div>
						To add a payment method to your P2P platform, you can do so manually
						by entering the name of the payment method and the required payment
						details. For example, PayPal uses email addresses to send and
						receive funds.{' '}
					</div>

					<div style={{ marginTop: 20, marginBottom: 30 }}>
						Once the payment method is added, your P2P merchants and users will
						be able to select it and enter the necessary information when making
						or receiving payments. The details they provide will be shared with
						the other party in the P2P transaction.
					</div>

					<div style={{ fontSize: 20 }}>
						Name of method and main payment detail
					</div>

					<div style={{ marginBottom: 20 }}>
						<div style={{ fontWeight: 'bold' }}>Create new payment methods</div>
						<Input placeholder="Enter your system name" />
					</div>

					<div style={{ marginBottom: 30 }}>
						<div style={{ fontWeight: 'bold', fontSize: 17 }}>FIELD 1#</div>
						<div style={{ fontWeight: 'bold' }}>Payment detail name</div>
						<Input placeholder="Input the payment detail name" />
					</div>

					<div
						style={{ fontWeight: 'bold', textDecoration: 'underline' }}
						onClick={() => {
							setPaymentFieldAdd(true);
						}}
					>
						Add new payment detail field
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: 15,
							justifyContent: 'space-between',
							marginTop: 30,
						}}
					>
						<Button
							onClick={() => {
								setDisplayNewPayment(false);
							}}
							style={{
								backgroundColor: '#288500',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							Back
						</Button>

						<Button
							onClick={() => {
								setDisplayNewPayment(false);
							}}
							style={{
								backgroundColor: '#288500',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							Add
						</Button>
					</div>
				</Modal>
			)}

			{paymentFieldAdd && (
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined style={{ color: 'white' }} />}
					bodyStyle={{
						backgroundColor: '#27339D',
						marginTop: 60,
					}}
					visible={displayP2pModel}
					width={450}
					footer={null}
					onCancel={() => {
						setPaymentFieldAdd(false);
					}}
				>
					<h1 style={{ fontWeight: '600', color: 'white' }}>
						Add an additional payment details
					</h1>
					<div style={{ marginBottom: 20 }}>
						This new payment field is additional and should assist P2P
						participants in their fiat currency transfers. This should be
						account details related to payment method. This may including phone
						numbers, usernames, unique account numbers, and other necessary
						information for transactions depending on the payment methods
						system.{' '}
					</div>

					<div style={{ marginBottom: 20 }}>
						<div style={{ fontWeight: 'bold' }}>Payment detail name</div>
						<Input placeholder="Input the payment detail name" />
					</div>

					<div>
						<div style={{ fontWeight: '600' }}>Required or optional</div>
						<div style={{ marginLeft: 20 }}>
							<Radio.Group>
								<Space direction="vertical">
									<Radio value={1}>Required</Radio>
									<div style={{ marginLeft: 20 }}>
										(Important payment detail)
									</div>
									<Radio value={2}>Optional</Radio>
									<div style={{ marginLeft: 20 }}>
										(Optional payment detail)
									</div>
								</Space>
							</Radio.Group>
						</div>
					</div>

					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: 15,
							justifyContent: 'space-between',
							marginTop: 30,
						}}
					>
						<Button
							onClick={() => {
								setPaymentFieldAdd(false);
							}}
							style={{
								backgroundColor: '#288500',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							Back
						</Button>

						<Button
							onClick={() => {
								setPaymentFieldAdd(false);
							}}
							style={{
								backgroundColor: '#288500',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							Add
						</Button>
					</div>
				</Modal>
			)}
		</div>
	);
};

const mapStateToProps = (state) => ({
	exchange: state.asset && state.asset.exchange,
	coins: state.asset.allCoins,
	pairs: state.asset.allPairs,
	user: state.user,
	quicktrade: state.app.allContracts.quicktrade,
	networkQuickTrades: state.app.allContracts.networkQuickTrades,
	coinObjects: state.app.allContracts.coins,
	broker: state.app.broker,
	features: state.app.constants.features,
});

const mapDispatchToProps = (dispatch) => ({
	setExchange: bindActionCreators(setExchange, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(P2PSettings);
