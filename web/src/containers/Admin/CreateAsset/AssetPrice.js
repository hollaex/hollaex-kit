import React, { Fragment } from 'react';
import { InputNumber, Button } from 'antd';

import Coins from '../Coins';
// import { getCoinParams } from '../../common/fetch';

const AssetParams = ({
    // editParams = false,
    coinFormData = {},
    // handleCheckChange,
    handleBulkUpdate = () => { },
    handleChangeNumber,
    handleScreenChange,
    handleNext,
    // handleMetaChange
}) => {
    // const [loading, setLoading] = useState(false);

    const handleGetParams = async () => {
        if (coinFormData.estimated_price) {
            // try {
            //     setLoading(true);
            //     const res = await getCoinParams(coinFormData.estimated_price);
            //     if (res.data) {
            //         setLoading(false);
            //         handleBulkUpdate(res.data);
                    handleNext('edit-param-values');
            //     }
            // } catch (error) {
            //     setLoading(false);
            //     if (error.data && error.data.message) {
            //         message.error(error.data.message);
            //     } else {
            //         message.error(error.message);
            //     }
            // }
        } else {
            handleNext('edit-params');
        }
    };

    return (
        <Fragment>
            <div className="title">Asset parameters</div>
            <div className="assets-wrapper">
                <div className="section-wrapper last">
                    <div className="d-flex align-items-center">
                        <div className="color-wrapper">
                            <Coins
                                nohover
                                large
                                small
                                type={(coinFormData.symbol || '').toLowerCase()}
                                fullname={coinFormData.fullname}
                                color={
                                    coinFormData.meta
                                        ? coinFormData.meta.color
                                        : ''
                                }
                            />
                        </div>
                        <div className="md-field-wrap">
                            <div>
                                <span className="sub-title">Price</span>
                            </div>
                            <div className="field-description">Set a rough dollar value for this asset <br/> (1 {coinFormData.symbol.toUpperCase()} = ? USD)</div>
                            <InputNumber
                                name="estimated_price"
                                min={0}
                                // max={18}
                                onChange={(val) => handleChangeNumber(val, 'estimated_price')}
                                value={coinFormData.estimated_price}
                            />
                        </div>
                    </div>
                </div>
                <div className="btn-wrapper">
                    <Button
                        type="primary"
                        className="green-btn"
                        onClick={() => handleScreenChange('step7')}
                    >
                        Back
                    </Button>
                    <div className="separator"></div>
                    <Button
                        type="primary"
                        className="green-btn"
                        disabled={!coinFormData.estimated_price}
                        // loading={loading}
                        onClick={handleGetParams}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </Fragment>
    );
}

export default AssetParams;
