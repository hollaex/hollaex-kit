import React from 'react';
import { isMobile } from 'react-device-detect';
import classnames from 'classnames';

import { IconTitle, HeaderSection, CustomTabBar, MobileTabBar } from '../../components';
import STRINGS from '../../config/localizedStrings';

const VerificationHome = ({ activeTab, tabProps, tabs, openContactForm, setActiveTab, renderContent }) => {
    // if (activeTab < tabs.length) {
        return (
            <div className="presentation_container apply_rtl verification_container">
                {!isMobile && (
                  <IconTitle
                    stringId="ACCOUNTS.TAB_VERIFICATION"
                    text={STRINGS["ACCOUNTS.TAB_VERIFICATION"]}
                    textType="title"
                  />
                )}
                <HeaderSection
                    openContactForm={openContactForm}
                />
                <div
                    className={
                        classnames(
                            "header-content",
                            {
                                "w-50": !isMobile,
                                "w-100": isMobile
                            }
                        )
                    }>
                    <div className="mb-3">{STRINGS["USER_VERIFICATION.INFO_TXT"]}</div>
                    <div className="mb-3">{STRINGS["USER_VERIFICATION.INFO_TXT_1"]}</div>
                </div>
                {!isMobile
                    ? <CustomTabBar activeTab={activeTab} setActiveTab={setActiveTab} {...tabProps} />
                    : <MobileTabBar activeTab={activeTab} renderContent={renderContent} setActiveTab={setActiveTab} {...tabProps} />
                }
                {!isMobile
                    ? <div className="inner_container">
                        {activeTab > -1 && renderContent(tabs, activeTab)}
                    </div>
                    : null
                }
            </div>
        );
    // } else {
    //     return (
    //         <div className="presentation_container apply_rtl verification_container">
    //             {!isMobile && <TabController {...tabProps} />}
    //             <div className="inner_container">complete</div>
    //         </div>
    //     )
    // }
    
};

export default VerificationHome;
