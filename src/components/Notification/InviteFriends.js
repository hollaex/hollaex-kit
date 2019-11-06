import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import IconTitle from '../IconTitle';
import DumbField from '../Form/FormFields/DumbField';
import Button from '../Button';
import { ICONS, IS_HEX, AFFILIATION_APPLY_URL } from '../../config/constants';
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

    render() {
        const { affiliation_code } = this.props.data;
        const { affiliation, is_hap } = this.props;
        const referralLink = `${process.env.REACT_APP_PUBLIC_URL}/signup?affiliation_code=${affiliation_code}`;
        const affiliationCount = affiliation.count ? affiliation.count : 0;
        return (
            <div className='invite_friends_wrapper mx-auto'>
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
                        {
                            (!IS_HEX || is_hap) ?
                                <RenderDumbField
                                    label={STRINGS.REFERRAL_LINK.COPY_FIELD_LABEL}
                                    value={referralLink}
                                    fullWidth={true}
                                    allowCopy={true}
                                    copyOnClick={true}
                                    onCopy={this.handleCopy}
                                />
                                : <div className='mt-2'>{STRINGS.REFERRAL_LINK.APPLICATION_TXT}</div>
                        }
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
                        {(!IS_HEX || is_hap) ?
                            <CopyToClipboard
                                text={referralLink}
                                onCopy={this.handleCopy}>
                                <Button
                                    label={this.state.copied ? STRINGS.SUCCESFUL_COPY : STRINGS.REFERRAL_LINK.COPY_LINK_BUTTON}
                                    onClick={() => { }}
                                />
                            </CopyToClipboard>
                            :
                            <a
                                className="exir-button mdc-button mdc-button--unelevated exir-button-font"
                                href={AFFILIATION_APPLY_URL}
                                target='blank'>
                                <Button
                                    label={STRINGS.REFERRAL_LINK.APPLY_BUTTON}
                                    onClick={() => { }}
                                />
                            </a>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store) => ({
    affiliation: store.user.affiliation || {},
    is_hap: store.user.is_hap
});

const mapDispatchToProps = (dispatch) => ({
    getUserReferralCount: bindActionCreators(getUserReferralCount, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(InviteFriends);
