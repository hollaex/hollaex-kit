import React from 'react';
import { Input, Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const Pophedge = ({
	MarketPop,
	handleMarkSearch,
	ManageArr,
	chooseMarket,
	marketLink,
	handleCustomPrice,
}) => {
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
						onChange={handleMarkSearch}
						value={marketLink}
					/>
					<div className="email-option-wrapper mt-5">
						<div className="d-flex table-header email-header">
							<div>EXCHANGE</div>
							<div>MARKET</div>
							<div>PRICE</div>
						</div>
						<div className="overflow">
							{ManageArr.map((data, index) => {
								return (
									<div
										key={index}
										className="email-option"
										onClick={() => chooseMarket(data)}
									>
										<div className="d-flex w-85">
											<div className="w-50">{data.exchange}</div>
											<div className="w-50">{data.pair}</div>
											<div className="w-50 preview_text">{data.price}</div>
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
					<div className="main-subHeading mt-3 text-align-center grey-text-color">
						Can't find what you are looking for? Make a{' '}
						<span className="anchor" onClick={handleCustomPrice}>
							custom price
						</span>
						.
					</div>
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
							onClick={() => chooseMarket({}, 'confirm')}
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
