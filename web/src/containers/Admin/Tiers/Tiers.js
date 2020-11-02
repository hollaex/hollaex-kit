import React from 'react';
import ReactSVG from 'react-svg';
import { Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { ICONS } from '../../../config/constants';

const TiersContainer = ({ userTiers = {}, handleEdit, handleAdd }) => {
    return (
        <div>
            <div className="sub-title mb-2">
                Number of User Tier Accounts
            </div>
            <div className="description">Select the number of user account tiers and set the trading fees, deposit and withdrawals allowed for each account tier. Rules such as completing KYC and account age and volume traded can be applied to account tiers to reward your users.</div>
            <div className="my-4">
                {Object.keys(userTiers).map((tier, index) => {
                    let tierData = userTiers[tier];
                    return (
                        <div key={index} className="d-flex tiers-container">
                            <div>
                                {tierData.icon
                                    ? <img src={tierData.icon} className="tier-icon" alt={`Account Tier ${tier}`} />
                                    : <ReactSVG path={ICONS[`LEVEL_ACCOUNT_ICON_${tier}`]} wrapperClassName="tier-icon" />
                                }
                            </div>
                            <div className="mx-3 f-1">
                                <div>
                                    <div>Account Tier {tier}</div>
                                    <div className="description">{tierData.description}</div>
                                </div>
                                <div className="requirement-divider"></div>
                                <div>
                                    <div>Requirements</div>
                                    <div className="description">{tierData.requirements}</div>
                                </div>
                            </div>
                            <div className="pointer" onClick={() => handleEdit(tierData)}>Edit</div>
                        </div>
                    )
                })}
            </div>
            <div>
                <Button type="primary" size="middle" className="green-btn minimal-btn" onClick={handleAdd}>
                    <UserOutlined /> + Add tier
                </Button>
            </div>
        </div>
    );
}

export default TiersContainer;
