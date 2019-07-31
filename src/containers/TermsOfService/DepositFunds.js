import React from 'react';
import ReactSVG from 'react-svg';

import { IconTitle, BlueLink, Button } from '../../components';
import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

const DepositFunds = (props) => {
    return (
        <div className="deposit_funds-wrapper">
            <IconTitle
                iconPath={ICONS.TRANSACTION_HISTORY}
                text={STRINGS.TERMS_OF_SERVICES.DEPOSIT_FUNDS}
                textType="title"
                underline={true}
                useSvg={true}
                className="w-100"
            />
            <div className="mx-3">
                <div className="d-flex align-items-center my-4">
                    <ReactSVG path={ICONS.TRANSACTION_HISTORY} wrapperClassName="funds-svg" />
                    <div className="ml-2 font-weight-bold">
                        {STRINGS.formatString(
                            STRINGS.TERMS_OF_SERVICES.READ_FAG,
                            <BlueLink
                                href="https://HEX-faq.bitholla.com"
                                text={"https://HEX-faq.bitholla.com"}
                            />
                        )}
                    </div>
                </div>
                <div className="d-flex align-items-center my-4">
                    <ReactSVG path={ICONS.TRANSACTION_HISTORY} wrapperClassName="funds-svg" />
                    <div className="ml-2 font-weight-bold">
                        {STRINGS.formatString(
                            STRINGS.TERMS_OF_SERVICES.READ_DOCUMENTATION,
                            <BlueLink
                                href="https://hex-docs.bitholla.com"
                                text={"https://hex-docs.bitholla.com"}
                            />
                        )}
                    </div>
                </div>
                <div className="d-flex align-items-center my-4">
                    <ReactSVG path={ICONS.TRANSACTION_HISTORY} wrapperClassName="funds-svg" />
                    <div className="ml-2 font-weight-bold">
                        {STRINGS.formatString(
                            STRINGS.TERMS_OF_SERVICES.DOWNLOAD_BUY_HEX,
                            <BlueLink
                                href=""
                                text={STRINGS.TERMS_OF_SERVICES.HOW_TO_BUY}
                            />
                        )}
                    </div>
                </div>
                <div className="d-flex align-items-center my-4">
                    <ReactSVG path={ICONS.TRANSACTION_HISTORY} wrapperClassName="funds-svg" />
                    <div className="ml-2 font-weight-bold">
                        {STRINGS.formatString(
                            STRINGS.TERMS_OF_SERVICES.CONTACT_US,
                            <BlueLink
                                href=""
                                text={"support@bitholla.com"}
                            />
                        )}
                    </div>
                </div>
            </div>
            <Button
                label={STRINGS.USER_VERIFICATION.GOTO_WALLET.toUpperCase()}
                onClick={props.gotoWallet}
            />
        </div>
    );
}

export default DepositFunds;
