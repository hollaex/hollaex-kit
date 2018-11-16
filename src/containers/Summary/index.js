import React, { Component } from 'react';
import { connect } from 'react-redux';
import SummaryBlock from './components/SummaryBlock';
import TraderAccounts from './components/TraderAccounts';
import SummaryRequirements from './components/SummaryRequirements';
import { IconTitle } from '../../components';
import { SUMMMARY_ICON } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

class Summary extends Component {
    render() {
        const { user } = this.props;
        return (
            <div className="summary-container">
                <IconTitle
                    text={STRINGS.SUMMARY_TITLE}
                    textType="title"
                />
                <div className="d-flex align-items-center">
                    <div className="trader-account-wrapper d-flex">
                        <SummaryBlock title={STRINGS.SUMMARY.TINY_PINK_SHRIMP_TRADER_ACCOUNT} >
                            <TraderAccounts
                                icon={SUMMMARY_ICON.SHRIMP} />
                        </SummaryBlock>
                    </div>
                    <div className="requirement-wrapper d-flex">
                        <SummaryBlock title={STRINGS.SUMMARY.URGENT_REQUIREMENTS} >
                            <SummaryRequirements user={user} />
                        </SummaryBlock>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(Summary);

