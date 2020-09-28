import React from 'react';
import ReactSVG from 'react-svg';

import { IconTitle, BlueLink, Button } from '../../components';
import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

const ReferralSuccess = (props) => {
    return (
        <div className="deposit_funds-wrapper m-auto">
            <IconTitle
                iconPath={ICONS.REFERRAL_SUCCESS}
                text={STRINGS["REFERRAL_SUCCESS.TITLE"]}
                textType="title"
                underline={true}
                useSvg={true}
                className="w-100"
            />
            <div className="my-4 ml-2">
                <label>{STRINGS["TERMS_OF_SERVICES.WARNING_TXT"]}</label>
                <label>{STRINGS["TERMS_OF_SERVICES.WARNING_TXT1"]}</label>
            </div>
            <div className="mx-3">
                <div className="d-flex align-items-center my-4">
                    <ReactSVG path={ICONS.XHT_FAQ} wrapperClassName="funds-svg" />
                    <div className="ml-2 font-weight-bold">
                        {STRINGS.formatString(
                            STRINGS["TERMS_OF_SERVICES.READ_FAG"],
                            <BlueLink
                                href="https://hollaex.com/docs/faq.html"
                                text={" https://HEX-faq.bitholla.com"}
                            />
                        )}
                    </div>
                </div>
                <div className="d-flex align-items-center my-4">
                    <ReactSVG path={ICONS.XHT_DOCS} wrapperClassName="funds-svg" />
                    <div className="ml-2 font-weight-bold">
                        {STRINGS.formatString(
                            STRINGS["TERMS_OF_SERVICES.READ_DOCUMENTATION"],
                            <BlueLink
                                href="https://hollaex.com/docs/whitepaper.html"
                                text={" https://hex-docs.bitholla.com "}
                            />
                        )}
                    </div>
                </div>
                <div className="d-flex align-items-center my-4">
                    <ReactSVG path={ICONS.XHT_WAVES} wrapperClassName="funds-svg" />
                    <div className="ml-2 font-weight-bold">
                        {STRINGS.formatString(
                            STRINGS["TERMS_OF_SERVICES.READ_WAVES"],
                            <BlueLink
                                href="https://hollaex.com/docs/whitepaper.html"
                                text={STRINGS["TERMS_OF_SERVICES.PUBLIC_SALES"]}
                            />
                        )}
                    </div>
                </div>
                <div className="d-flex align-items-center my-4">
                    <ReactSVG path={ICONS.XHT_PDF} wrapperClassName="funds-svg" />
                    <div className="ml-2 font-weight-bold">
                        {STRINGS.formatString(
                            STRINGS["TERMS_OF_SERVICES.VISUAL_STEP"],
                            <BlueLink
                                href="https://hollaex.com/docs/guideline.pdf"
                                text={STRINGS["TERMS_OF_SERVICES.HOW_TO_BUY"]}
                            />
                        )}
                    </div>
                </div>
                <div className="d-flex align-items-center my-4">
                    <ReactSVG path={ICONS.XHT_EMAIL} wrapperClassName="funds-svg" />
                    <div className="ml-2 font-weight-bold">
                        {STRINGS.formatString(
                            STRINGS["TERMS_OF_SERVICES.CONTACT_US"],
                            <BlueLink
                                href="mailto:support@hollaex.com"
                                text={"support@hollaex.com"}
                            />
                        )}
                    </div>
                </div>
            </div>
            <Button
                label={STRINGS["REFERRAL_SUCCESS.BUTTON_TEXT"]}
                onClick={props.onClose}
            />
        </div>
    );
}

export default ReferralSuccess;
