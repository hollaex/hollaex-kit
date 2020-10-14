import React from 'react';
import { Radio, Form, Button } from 'antd';
import ReactSVG from 'react-svg';

import { ICONS } from '../../../config/constants';

const { Item } = Form;

const TradingInterface = ({ initialValues = {}, handleNext, updateConstants }) => {
    const handleSubmit = (values) => {
        const formValues = {
            kit: {}
        };
        if (values.interface) {
            formValues.kit.interface = {
                type: values.interface
            }
            updateConstants(formValues, () => handleNext(4));
        }
    };
    return (
        <div className="asset-content">
            <div>Select the trading interface that will be available on your exchange. All interfaces includes a crypto wallet.</div>
            <Form
                name="interface-form"
                initialValues={initialValues}
                onFinish={handleSubmit}
            >
                <div className="interface-box">
                    <Item name="interface">
                        <Radio.Group>
                            <Radio value="full">
                                Full interface
                                <div className="flex-container">
                                    <div className="small-text">
                                        (Pro & quick trade with wallet)
                                    </div>
                                    <div className="box">
                                        <div className="interface_container">
                                            <div className="sell">
                                                <span className="label">SELL</span>
                                            </div>
                                            <div className="buy">
                                                <span className="label">BUY</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <ReactSVG
                                            path={ICONS.CANDLES_LOGO}
                                            wrapperClassName="candle-icon"
                                        />
                                    </div>
                                </div>
                            </Radio>
                            <Radio value="pro-trade" disabled>
                                Pro trade only (coming soon)
                                            <div className="small-text">
                                    (Chart, orderbook, limit orders with wallet)
                                            </div>
                                <ReactSVG
                                    path={ICONS.CANDLES_LOGO}
                                    wrapperClassName="candle-icon"
                                />
                            </Radio>
                            <Radio value="quick-trade" disabled>
                                Quick trade only (coming soon)
                            <div className="flex-container">
                                    <div className="small-text">
                                        (Simple buy/sell interface with wallet)
                                                </div>
                                    <div className="box interface">
                                        <div className="interface_container">
                                            <div className="sell">
                                                <span className="label">SELL</span>
                                            </div>
                                            <div className="buy">
                                                <span className="label">BUY</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Radio>
                            <Radio value="wallet" disabled>
                                Wallet only (coming soon)
                                            <div className="flex-container">
                                    <div className="small-text">
                                        (No trading. Only crypto wallet)
                                                </div>
                                    <div className="box interface">
                                        <ReactSVG
                                            path={ICONS.WALLET_BTC_ICON}
                                            wrapperClassName="wallet-icon"
                                        />
                                    </div>
                                </div>
                            </Radio>
                        </Radio.Group>
                    </Item>
                </div>
                <div className="asset-btn-wrapper">
                    <div className="btn-container">
                        <Button htmlType='submit'>Proceed</Button>
                    </div>
                    <span
                        className="step-link"
                        onClick={() => handleNext(4)}
                    >
                        Skip this step
                    </span>
                </div>
            </Form>
        </div>
    );
}

TradingInterface.defaultProps = {
    initialValues: {
        interface: "full"
    }
};

export default TradingInterface;
