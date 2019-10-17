import React from 'react';
import ReactSVG from 'react-svg';
import classnames from 'classnames';

import { IconTitle, BlueLink, Button } from '../../components';
import { ICONS, FLEX_CENTER_CLASSES } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

const DepositFunds = (props) => {
    return (
        <div className="deposit_funds-wrapper m-auto">
            <IconTitle
                iconPath={ICONS.HEX_COIN_STACK}
                text={STRINGS.TERMS_OF_SERVICES.DEPOSIT_FUNDS}
                textType="title"
                underline={true}
                useSvg={true}
                className="w-100"
            />
            <div className="mx-3">
                <div className="d-flex align-items-center my-4">
                    <ReactSVG path={ICONS.HEX_FAQ} wrapperClassName="funds-svg" />
                    <div className="ml-2 font-weight-bold">
                        {STRINGS.formatString(
                            STRINGS.TERMS_OF_SERVICES.READ_FAG,
                            <BlueLink
                                href="https://hollaex.com/docs/faq.html"
                                text={"https://hollaex.com/docs/faq.html"}
                            />
                        )}
                    </div>
                </div>
                <div className="d-flex align-items-center my-4">
                    <ReactSVG path={ICONS.HEX_DOCS} wrapperClassName="funds-svg" />
                    <div className="ml-2 font-weight-bold">
                        {STRINGS.formatString(
                            STRINGS.TERMS_OF_SERVICES.READ_DOCUMENTATION,
                            <BlueLink
                                href="https://hollaex.com/docs/whitepaper.html"
                                text={"https://hollaex.com/docs/whitepaper.html"}
                            />
                        )}
                    </div>
                </div>
                <div className="d-flex align-items-center my-4">
                    <ReactSVG path={ICONS.HEX_PDF} wrapperClassName="funds-svg" />
                    <div className="ml-2 font-weight-bold">
                        {STRINGS.formatString(
                            STRINGS.TERMS_OF_SERVICES.DOWNLOAD_BUY_HEX,
                            <BlueLink
                                href="https://hollaex.com/docs/guideline.pdf"
                                text={STRINGS.TERMS_OF_SERVICES.HOW_TO_BUY}
                            />
                        )}
                    </div>
                </div>
                <div className="d-flex align-items-center my-4">
                    <ReactSVG path={ICONS.HEX_EMAIL} wrapperClassName="funds-svg" />
                    <div className="ml-2 font-weight-bold">
                        {STRINGS.formatString(
                            STRINGS.TERMS_OF_SERVICES.CONTACT_US,
                            <BlueLink
                                href="mailto:support@bitholla.com"
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
