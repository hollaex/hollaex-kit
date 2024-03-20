import React from 'react';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';

import { IconTitle, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { Button, Select, Input } from 'antd';
const P2POrder = ({
	data,
	onClose,
	coins,
	pairs,
	constants = {},
	icons: ICONS,
	transaction_limits,
	tiers = {},
	setDisplayOrder,
}) => {
	return (
		<>
			<div
				onClick={() => {
					setDisplayOrder(false);
				}}
				style={{ marginBottom: 10 }}
			>
				Back
			</div>
			<div
				style={{
					height: 750,
					backgroundColor: '#303236',
					width: '100%',
					padding: 20,
				}}
			>
				<div
					className="wallet-assets_block"
					style={{ display: 'flex', gap: 50, marginTop: 20 }}
				>
					<div style={{ flex: 1 }}>
						<div style={{ display: 'flex', gap: 10 }}>
							<div>ICON</div>
							<div>
								<div>ORDER</div>
								<div>Buy Bitcoin (BTC)</div>
							</div>
						</div>
						<div
							style={{
								borderBottom: '1px solid grey',
								marginTop: 10,
								marginBottom: 10,
							}}
						></div>
						<div
							style={{
								flex: 1,
								display: 'flex',
								justifyContent: 'space-between',
							}}
						>
							<div>Amount to send:</div>
							<div>
								<div>$100 USD</div>
								<div>(required flat transfer amount)</div>
							</div>
						</div>
						<div
							style={{
								borderBottom: '1px solid grey',
								marginTop: 10,
								marginBottom: 10,
							}}
						></div>
						<div
							style={{
								flex: 1,
								display: 'flex',
								justifyContent: 'space-between',
							}}
						>
							<div>Price:</div>
							<div>
								<div>$50,000 USD</div>
								<div>(per BTC)</div>
							</div>
						</div>
						<div
							style={{
								borderBottom: '1px solid grey',
								marginTop: 10,
								marginBottom: 10,
							}}
						></div>
						<div
							style={{
								flex: 1,
								display: 'flex',
								justifyContent: 'space-between',
							}}
						>
							<div>Receiving amount:</div>
							<div>
								<div>0.0020 BTC</div>
								<div>(BTC amount you'll receive)</div>
							</div>
						</div>
						<div
							style={{
								borderBottom: '1px solid grey',
								marginTop: 10,
								marginBottom: 10,
							}}
						></div>

						<div style={{ marginBottom: 20 }}>
							<div>TRANSFER DETAILS</div>
							<div style={{ marginBottom: 20 }}>
								Select payment method, transfer money to seller. After you've
								successfully transferred the money please click confirm below to
								notify the seller
							</div>
							<div style={{ border: '1px solid grey', padding: 15 }}>
								<div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
									<div>Payment Method:</div>
									<div>
										<Select
											showSearch
											style={{ backgroundColor: '#303236' }}
											placeholder="Bank Transfer"
											// value={}
											onChange={(e) => {}}
										>
											<Select.Option value={1}></Select.Option>
										</Select>
									</div>
								</div>
								<div
									style={{ display: 'flex', justifyContent: 'space-between' }}
								>
									<div>Name:</div>
									<div>Billy Jeans</div>
								</div>

								<div
									style={{ display: 'flex', justifyContent: 'space-between' }}
								>
									<div>Bank account number:</div>
									<div>32123232323</div>
								</div>

								<div
									style={{ display: 'flex', justifyContent: 'space-between' }}
								>
									<div>Bank name:</div>
									<div>Vendors Bank Name</div>
								</div>
							</div>
						</div>

						<div>
							<div>Expected tiem until funds are release: 15m 41s</div>
							<div style={{ marginBottom: 20 }}>
								Once funds are released you will find the funds credited to your
								funding wallet
							</div>
							<div>
								The buyer has not sent the payment yet. Once you receive payment
								you will be notified here.
							</div>
							<div>
								Please kindly confirm and relase crpyto ufnds to buyer below
								once complete
							</div>
							<div style={{ display: 'flex', gap: 10 }}>
								<div>Appeal</div>
								<div>Cancel order</div>
								<div style={{ padding: 10 }}>CONFIRM AND RELEASE CRYPTO</div>
							</div>
						</div>
					</div>
					<div style={{ flex: 1 }}>
						<div>CHAT WITH VENDOR</div>
						{/* chat box */}
						<div
							style={{
								border: '1px solid grey',
								position: 'relative',
								height: '90%',
								backgroundColor: '#383A3E',
								padding: 15,
							}}
						>
							<div>Vendor name: name_crpytot_vendor</div>
							<div
								style={{
									borderBottom: '1px solid grey',
									marginTop: 10,
									marginBottom: 10,
								}}
							></div>
							<div
								style={{
									marginTop: 15,
									marginBottom: 20,
									textAlign: 'center',
									color: 'grey',
								}}
							>
								<div>
									You've initiated and created an ordewr with
									'name_croyto_vendor'(4234/2342/2004 15:32).
								</div>
								<div>
									Please communicate with the vendor to confirm your incoming
									payment.
								</div>
							</div>

							<div>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										marginBottom: 20,
									}}
								>
									<div>name_crptyo_vendor:</div>
									<div>
										Welcome! this is an automated emssage. Please leave a
										message and I will get back to you ASAP to confirm our P2P
										Deal here.
									</div>
									<div>23/07/25 15:32</div>
								</div>

								<div
									style={{
										marginTop: 10,
										marginBottom: 10,
										textAlign: 'center',
										color: 'grey',
									}}
								>
									Buyer has marked this order as paid. Waiting for vendor to
									check, confirm and realease funds (23/08,25 23:53)
								</div>

								{/* chat */}
								<div style={{ minHeight: 300, overflowY: 'scroll' }}>
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											textAlign: 'right',
										}}
									>
										<div>Buyer:</div>
										<div>I made the payment, where are my coins ?</div>
										<div>23/07/25 15:32</div>
									</div>
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											marginBottom: 20,
										}}
									>
										<div>name_crptyo_vendor:</div>
										<div>
											Hold on, I don't see anything YET!, Ill confirm it when it
											drops
										</div>
										<div>23/07/25 15:32</div>
									</div>
								</div>
							</div>

							<div
								style={{
									position: 'absolute',
									bottom: 0,
									padding: 10,
									marginBottom: 20,
									border: '1px solid grey',
									width: '90%',
								}}
							>
								<div
									style={{ display: 'flex', justifyContent: 'space-between' }}
								>
									<div style={{ flex: 6 }}>TEST</div>
									<div style={{ color: '#5A60E5' }}>SEND</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div
				style={{
					display: 'flex',
					gap: 10,
					textAlign: 'center',
					justifyContent: 'center',
					marginTop: 10,
				}}
			>
				<div>CANCEL</div>
				<div>CONFIRM TRANSFER AND NOTIFY VENDOR</div>
			</div>
		</>
	);
};

const mapStateToProps = (state) => ({
	pairs: state.app.pairs,
	coins: state.app.coins,
	constants: state.app.constants,
	transaction_limits: state.app.transaction_limits,
});

export default connect(mapStateToProps)(withConfig(P2POrder));
