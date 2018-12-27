import React from 'react';
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router';

import CustomTabs from './CustomTabs';
import HeaderSection from './HeaderSection';
import MobileTabBar from './MobileTabBar';
import { IconTitle } from '../../components';
import STRINGS from '../../config/localizedStrings';

const VerificationHome = ({ activeTab, tabProps, tabs, openContactForm, setActiveTab, renderContent }) => {
    // if (activeTab < tabs.length) {
        return (
            <div className="presentation_container apply_rtl verification_container">
                {!isMobile && <IconTitle text={STRINGS.ACCOUNTS.TAB_VERIFICATION} textType="title" />}
                <HeaderSection
                    openContactForm={openContactForm}
                />
                <div className="w-50 header-content">
                    <div className="mb-3">{STRINGS.USER_VERIFICATION.INFO_TXT}</div>
                    <div className="mb-3">{STRINGS.USER_VERIFICATION.INFO_TXT_1}</div>
                    <div className="mb-3">{STRINGS.formatString(
                        STRINGS.USER_VERIFICATION.INFO_TXT_2,
                        <Link className="link-content" onClick={() => setActiveTab(4)}>{STRINGS.USER_VERIFICATION.DOCUMENTATIONS}</Link>
                    )}</div>
                </div>
                {!isMobile
                    ? <CustomTabs activeTab={activeTab} setActiveTab={setActiveTab} {...tabProps} />
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
