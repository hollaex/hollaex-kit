import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Button, message, Spin, Tooltip, Switch, Input } from 'antd';
import _debounce from 'lodash/debounce';
import { Link } from 'react-router';


import { setPricesAndAsset } from 'actions/assetActions';
import { getTickers, setBroker } from 'actions/appActions';
import { MarketsSelector } from 'containers/Trade/utils';
import { SettingOutlined } from '@ant-design/icons';



const quickTradeTypes = {
    'network': 'HollaEx Network Swap',
    'broker': 'OTC Desk',
    'pro': 'Orderbook',
}

const QuickTradeTab = ({
	coins,
	pairs,
	allCoins,
	exchange,
	user,
	coinData,
	balanceData,
	oraclePrices,
	setPricesAndAsset,
	setBroker,
	constants,
	markets,
	getTickers,
    quickTradeData
}) => {

    const [isActive, setIsActive] = useState(false);

	return (
		<div className="otcDeskContainer">
			<div className="header-container">
				<div className="d-flex justify-content-center">
                    <div>
                        <div style= {{
                            width: 90,
                            height: 24,
                            backgroundColor:"#050596",
                            color: 'white',
                            textAlign:"center"
                            }}>
                            SELL
                        </div>
                        <div style= {{
                            width: 90,
                            height: 24,
                            marginTop: 5,
                            backgroundColor: "white",
                            textAlign:"center",
                            color:"black"
                            }}>
                            BUY
                        </div>
                    </div>
                
					<div className="ml-4">
						<div className="main-subHeading">
                        Quick Trade is a straight-forward buy and sell interface. Below are all the markets available to your users 
                        based on
						</div>
                        <div className="main-subHeading">
                            the active assets on your exchange. Each Quick Trade market can be configured to source prices and 
                            liquidity from either HollaEx's Network Swap, a 

                        </div>
                        <div className="main-subHeading">
                            matching Public Orderbook or your personal{' '}
							<a
								target="_blank"
								href="https://docs.hollaex.com/how-tos/otc-broker"
								rel="noopener noreferrer"
							>
								OTC Desk.
							</a>
                        </div>
					</div>
				</div>
			</div>
            <div className="header-container" style={{ marginTop: 30 }}>
				<div className="d-flex justify-content-center">
					<div>
						<div className="main-Heading">Display Quick Trade page</div>
						<div className="main-subHeading">
                            Allow your to buy and sell through the Quick Trade interface.
						</div>
					</div>
				</div>
			</div>

            <div className="header-container" style={{ marginTop: 30 }}>
				<div className="d-flex justify-content-center">
					<div>
                        <span
                        	className={
                                !isActive ? 'switch-label' : 'switch-label label-inactive'
                            }
                        >Off</span>
                        <Switch
                            checked={false}
                            onClick={() => {}}
                            className="mx-2"
                        />
                        <span
                        	className={
                                !isActive ? 'switch-label' : 'switch-label label-inactive'
                            }
                        >On</span>
					</div>
				</div>
			</div>

            <div className="header-container" style={{ marginTop: 30 }}>
				<div className="d-flex justify-content-center">
					<div>
						<div className="main-Heading">Active Quick Trade markets (70)</div>
					</div>
				</div>
			</div>

            <div className="header-container">
				<div className="d-flex justify-content-center">
					<div>
						<div className="main-subHeading">
                            Search
						</div>
                        <Input
                            style={{ marginTop: 10 }}
			        	    size="small"
			        	    placeholder={'Search markets'}
			        	    onChange={() => { }}
			            />
					</div>
				</div>
                <div className="d-flex justify-content-center">
					<div className="ml-4" style={{ fontSize: 17 }}>
                        [X] Disabled markets (1)
					</div>
				</div>
			</div>

			<div style={{ marginTop: 50 }}>
                <div style={{ display: 'flex', flexDirection:'row', gap: 10,  paddingBottom: 20 }}>

                    {quickTradeData?.map(data => {
                        return(
                            <div
                            style={{
                                height: 90,
                                width: 200,
                                textAlign:'center',
                                border:"1px solid #74B0E4",
                                borderTop:"7px solid #74B0E4",
                                display: 'flex',
                                flexDirection:'column',
                                justifyContent:'center',
                                color: '#b2b2b2',
                                position: 'relative'
                            }}
                        >
                            <div style={{ fontSize: 16, marginBottom: 3 }}>{data.symbol.split('-').join('/').toUpperCase()}</div>
                            <div>{quickTradeTypes[data.type]}</div>
    
                            <div 
                                style={{ 
                                    height:30,
                                    width: 30,
                                    borderRadius: '100%',
                                    backgroundColor: '#288500',
                                    cursor: 'pointer',
                                    position: 'absolute',
                                    right: -5,
                                    bottom: -5,
                                    textAlign: 'center',
                                    display: 'flex',
                                    justifyContent:'center',
                                    alignItems: 'center',
                                    color: 'white',
                                    fontSize: 17
                                }}>
                                <SettingOutlined />
                            </div>
                        </div>
                        )
                    })}
                </div>
			</div>
		
		
		</div>
	);
};

const mapStateToProps = (store) => ({
	coinData: store.app.coins,
	prices: store.orderbook.prices,
	balanceData: store.user.balance,
	oraclePrices: store.asset.oraclePrices,
	constants: store.app.constants,
	markets: MarketsSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
	setPricesAndAsset: bindActionCreators(setPricesAndAsset, dispatch),
	setBroker: bindActionCreators(setBroker, dispatch),
	getTickers: bindActionCreators(getTickers, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(QuickTradeTab);
