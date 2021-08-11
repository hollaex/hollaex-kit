import React, { Fragment } from 'react';
import { Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import { STATIC_ICONS } from 'config/icons';
import Coins from '../Coins';
import IconToolTip from '../IconToolTip';
// import IconToolTip from '../../components/IconToolTip';
// import { COIN_ICONS, MISSING_ICON, CURRENCY_SYMBOL } from '../../config/media';

const Final = ({
    isPreview = false,
    isConfigure = false,
    coinFormData = {},
    handleBack,
    handleConfirmation,
    handleEdit = () => { },
    handleFileChange = () => { },
    setConfigEdit,
    handleDelete = () => { },
    user
}) => {
    const { meta = {}, type } = coinFormData;
    return (
        <Fragment>
            <div className="title">
                {isPreview || isConfigure
                    ? `Manage ${coinFormData.symbol}`
                    : 'Create or add a new coin'
                }
            </div>
            {(!isPreview && !isConfigure)
                ? type === 'fiat'
                    ? (<div className="grey-warning">
                        <div className="icon-wrapper">
                            <img className="fiat-icon" src={STATIC_ICONS.CURRENCY_SYMBOL} alt="new_coin" />
                        </div>
                        <div>
                            <p>Since fiat currencies aren't on the blockchain they are the full responsibility of the exchange operator to managed for solvency.</p>
                            <p>In order to facilitate FIAT deposits and withdrawals a banking or payment system must be connected to your exchange.</p>
                        </div>
                    </div>)
                    : (<div className="grey-warning">
                        <div className="warning-text">!</div>
                        <div>
                            <div className="sub-title">Please check the details carefully.</div>
                            <div>To avoid delays it is important to take the time to review the accuracy of the details below</div>
                        </div>
                    </div>)
                : null
            }
            <div className="preview-coin-container">
                <div className="preview-content preview-content-align">
                    {!isPreview && !isConfigure
                        ? <span className="preview-color-tip sub-title">
                            Color
                            <span className="line"></span>
                        </span>
                        : null
                    }
                    <Coins
                        nohover
                        large
                        small
                        fullname={coinFormData.fullname}
                        type={(coinFormData.symbol || '').toLowerCase()}
                        color={meta.color}
                    />
                    {isConfigure
                        ? <Fragment>
                            <div className="edit-content">
                                <b>Color: </b>{meta.color}
                            </div>
                            <Button className="green-btn" type="primary" onClick={() => setConfigEdit('edit-color')}>Edit</Button>
                            <div className="description-small">This will be viewed on your wallet and transaction history page</div>
                        </Fragment>
                        : null
                    }
                    {!isPreview && !isConfigure
                        ? <Fragment>
                            <span className="preview-symbol-tip sub-title">
                                <span className="line"></span>
                                Symbol
                            </span>
                            <span className="preview-name-tip sub-title">
                                <span className="line"></span>
                                Name
                            </span>
                        </Fragment>
                        : null
                    }
                </div>
                <div className="preview-content">
                    {isConfigure
                        ? <Fragment>
                            {coinFormData.logo
                                ? <img
                                    src={coinFormData.logo}
                                    alt="coins"
                                    className="icon-preview"
                                />
                                : <div className="icon-upload">
                                    <div className="file-container">
                                        <label>
                                            <UploadOutlined style={{ fontSize: '94px', color: '#808080' }} />
                                            <input
                                                type="file"
                                                onChange={(e) => handleFileChange(e, 'logo')}
                                                name="logo"
                                            />
                                        </label>
                                    </div>
                                </div>
                            }
                        </Fragment>
                        : 
                        <img
                            src={
                                coinFormData.logo
                                    ? coinFormData.logo
                                    : STATIC_ICONS.COIN_ICONS[(coinFormData.symbol || '').toLowerCase()]
                                        ? STATIC_ICONS.COIN_ICONS[(coinFormData.symbol || '').toLowerCase()]
                                        : STATIC_ICONS.MISSING_ICON
                            }
                            alt="coins"
                            className="icon-preview"
                        />
                    }
                    {isConfigure
                        ? <Fragment>
                            <div className="edit-content">
                                <b>Icon: </b>{coinFormData.iconName}
                            </div>
                            <div className="icon-upload">
                                <div className="file-container">
                                    <label>
                                        <div className="upload-box">Upload</div>
                                        <input
                                            type="file"
                                            onChange={(e) => handleFileChange(e, 'logo')}
                                            name="logo"
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="description-small">Icon will be used in various trading related pages</div>
                        </Fragment>
                        : null
                    }
                    {!isPreview && !isConfigure
                        ? <span className="preview-icon-tip sub-title">
                            <span className="line"></span>
                            Icon
                        </span>
                        : null
                    }
                </div>
            </div>
            <div className="preview-detail-container">
                <div className="title">Asset info</div>
                <div><b>Name:</b> {coinFormData.fullname}</div>
                <div><b>Symbol:</b> {(coinFormData.symbol || '').toUpperCase()}</div>
                <div className="type-wrap">
                    <div className="warning-container">
                        <b>Type: </b>{coinFormData.type}
                        {isPreview && !coinFormData.verified && (coinFormData.created_by === user.id)
                            ? <IconToolTip
                                type="warning"
                                tip="This asset is in pending verification"
                                onClick={() => handleEdit(coinFormData)}
                            />
                            : null
                        }
                    </div>
                </div>
                {coinFormData.network
                    ? <div><b>Network:</b> {coinFormData.network}</div>
                    : null
                }
                {coinFormData.standard
                    ? <div><b>Standard:</b> {coinFormData.standard}</div>
                    : null
                }
                {type === 'blockchain'
                    ? <div><b>Contract:</b> {coinFormData.contract}</div>
                    : null
                }
                {(!isConfigure)
                    ? <div><b>Color:</b> {meta.color}</div>
                    : <div className="btn-wrapper">
                        <Button className="green-btn" type="primary" onClick={() => setConfigEdit('edit-info')}>Edit</Button>
                    </div>
                }
            </div>
            <div className="preview-detail-container">
                <div className="title">Parameters</div>
                <div><b>Status:</b> {coinFormData.active ? 'Active' : 'Not active'}</div>
                <div><b>Price:</b> {coinFormData.estimated_price}</div>
                <div><b>Fee for withdrawal:</b> {coinFormData.withdrawal_fee}</div>
                <div><b>Minimum withdrawal amount:</b> {coinFormData.min}</div>
                <div><b>Maximum withdrawal amount:</b>  {coinFormData.max}</div>
                <div><b>Increment Amount:</b>  {coinFormData.increment_unit}</div>
                <div><b>Decimal points:</b>  {meta.decimal_points}</div>
                {isConfigure
                    ? <div className="btn-wrapper">
                        <Button className="green-btn" type="primary" onClick={() => setConfigEdit('edit-params')}>Edit</Button>
                    </div>
                    : null
                }
            </div>
            {isPreview || isConfigure
                ? <div className="preview-detail-container">
                    <div className="title">Manage</div>
                    <div className="btn-wrapper">
                        <Button type="danger" onClick={() => handleDelete(coinFormData.symbol)}>Remove</Button>
                        <div className="separator"></div>
                        <div className="description-small remove">Removing this coin will permanently delete this coin from your exchange and render any pairs using it inactive. Use with caution!</div>
                    </div>
                </div>
                : null
            }
            {!isPreview && !isConfigure
                ? <div className="btn-wrapper">
                    <Button className="green-btn" type="primary" onClick={handleBack}>
                        Back
                    </Button>
                    <div className="separator"></div>
                    <Button className="green-btn" type="primary" onClick={handleConfirmation}>
                        Confirm
                    </Button>
                </div>
                : null
            }
        </Fragment>
    );
}

export default Final;
