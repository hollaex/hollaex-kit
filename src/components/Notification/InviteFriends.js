import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import IconTitle from '../IconTitle';
import DumbField from '../Form/FormFields/DumbField';
import Button from '../Button';
import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import { getUserReferralCount } from '../../actions/userAction';

const RenderDumbField = (props) => <DumbField {...props} />;

class InviteFriends extends Component {
    constructor(props) {
        super(props)
        this.state = {
            copied: false
        }
    }
    
    componentDidMount() {
        this.props.getUserReferralCount();
    }

    handleCopy = () => {
        this.setState({ copied: true });
    };
    
    render() {
        const { affiliation_code } = this.props.data;
        const referralLink = `${process.env.REACT_APP_PUBLIC_URL}/signup?affiliation_code=${affiliation_code}`;
        const affiliationCount = this.props.affiliation.count ? this.props.affiliation.count : 0;
        return (
            <div className='invite_friends_wrapper'>
                <IconTitle
                    text={STRINGS.REFERRAL_LINK.TITLE}
                    iconPath={ICONS.REFER_ICON}
                    textType="title"
                    useSvg={true}
                    underline={true}
                />
                <div>
                    <div className='my-2'>
                        <div>{STRINGS.REFERRAL_LINK.INFO_TEXT}</div>
                        <div>{STRINGS.REFERRAL_LINK.INFO_TEXT_1}</div>
                    </div>
                    <div className='my-4'>
                        <RenderDumbField
                            label={STRINGS.REFERRAL_LINK.COPY_FIELD_LABEL}
                            value={referralLink}
                            fullWidth={true}
                            allowCopy={true}
                            copyOnClick={true}
                            onCopy={this.handleCopy}
                        />
                    </div>
                    <div className="user_refer_info p-4 d-flex align-items-center">
                        {STRINGS.formatString(
                            STRINGS.REFERRAL_LINK.REFERRED_USER_COUT,
                            affiliationCount
                        )}
                    </div>
                    <div className="d-flex my-5">
                        <Button
							label={STRINGS.BACK_TEXT}
							className="mr-5"
							onClick={this.props.onBack}
						/>
                        <CopyToClipboard
                            text={referralLink}
                            onCopy={this.handleCopy}
                        >
                            <Button
                                label={this.state.copied ? STRINGS.SUCCESFUL_COPY : STRINGS.REFERRAL_LINK.COPY_LINK_BUTTON}
                                onClick={() => {}}
                            />
                        </CopyToClipboard>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store) => ({
    affiliation: store.user.affiliation || {}
});

const mapDispatchToProps = (dispatch) => ({
    getUserReferralCount: bindActionCreators(getUserReferralCount, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(InviteFriends);
