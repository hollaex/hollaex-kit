import React, { useState } from 'react';
import { Input, Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const Pophedge = ({
	MarketPop,
	handleMarkSearch,
	ManageArr,
	chooseMarket,
	marketLink,
	handleCustomPrice,
	hedgeMarkets,
	setHedgeSymbol,
	hedgeSymbol,
	hedgeApi,
	hedge
}) => {
	const [filter, setFilter] = useState();
	return (
		<>
			<Modal
				visible={MarketPop}
				onCancel={() => chooseMarket({}, 'back')}
				footer={null}
			>
				<div className="otc-Container">
					<h1 className="hedgehead">Select exchange market</h1>
					<div className="sub-title mt-3">
						Selected market below or input a custom API market
					</div>
					<Input
						placeholder="Search market name or symbols"
						id="marketkey mb-2"
						value={hedgeSymbol}
						onChange={(e) => { setFilter(e.target.value) }}
					/>
					<div className="email-option-wrapper mt-5">
						<div className="d-flex table-header email-header">
							<div>EXCHANGE</div>
							<div>MARKET</div>
							{/* <div>PRICE</div> */}
						</div>
						<div className="overflow">
							{hedgeMarkets?.filter(m => filter ? m?.symbol?.toLowerCase()?.includes(filter?.toLowerCase()) : true).map((data, index) => {
								return (
									<div
										key={index}
										className="email-option"
										onClick={() => setHedgeSymbol(data.symbol)}
									>
										<div className="d-flex w-85">
											<div className="w-50">{hedgeApi.charAt(0).toUpperCase() + hedgeApi.slice(1)}</div>
											<div className="w-50">{data.symbol}</div>
											{/* <div className="w-50 preview_text">{'-'}</div> */}
										</div>
									</div>
								);
							})}
						</div>
					</div>
					<div className="d-flex mt-4 justify-content-center align-items-center">
						<div className="pr-2">
							<ExclamationCircleOutlined />
						</div>
						<div className="main-subHeading grey-text-color">
							It is highly recommended to use matching market pair price sources
						</div>
					</div>
					{/* <div className="main-subHeading mt-3 text-align-center grey-text-color">
						Can't find what you are looking for? Make a{' '}
						<span className="anchor" onClick={handleCustomPrice}>
							custom price
						</span>
						.
					</div> */}
					<div className="btn-wrapper pt-3">
						<Button
							type="primary"
							className="green-btn"
							onClick={() => chooseMarket({}, 'back')}
						>
							Back
						</Button>
						<div className="separator"></div>
						<Button
							type="primary"
							className="green-btn"
							onClick={() => chooseMarket({}, 'confirm', hedge)}
						>
							Confirm
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default Pophedge;
