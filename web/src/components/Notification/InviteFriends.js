import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import IconTitle from '../IconTitle';
import DumbField from '../Form/FormFields/DumbField';
import Button from '../Button';
import STRINGS from '../../config/localizedStrings';
import { getUserReferralCount } from '../../actions/userAction';
import { setSnackNotification } from '../../actions/appActions';
import { EditWrapper } from 'components';

const RenderDumbField = (props) => <DumbField {...props} />;

class InviteFriends extends Component {
	constructor(props) {
		super(props);
		this.state = {
			copied: false,
		};
	}

	componentDidMount() {
		this.props.getUserReferralCount();
	}

	handleCopy = () => {
		const { icons: ICONS, setSnackNotification } = this.props;
		setSnackNotification({
			icon: ICONS.COPY_NOTIFICATION,
			content: STRINGS['COPY_SUCCESS_TEXT'],
		});
	};

	render() {
		const { affiliation_code } = this.props.data;
		const { affiliation, icons: ICONS } = this.props;
		const referralLink = `${process.env.REACT_APP_PUBLIC_URL}/signup?affiliation_code=${affiliation_code}`;
		const affiliationCount = affiliation.count ? affiliation.count : 0;
		return (
			<div className="invite_friends_wrapper mx-auto">
				<IconTitle
					stringId="REFERRAL_LINK.TITLE"
					text={STRINGS['REFERRAL_LINK.TITLE']}
					iconId="REFER_ICON"
					iconPath={ICONS['REFER_ICON']}
					textType="title"
					underline={true}
				/>
				<div>
					<div className="my-2">
						<div>
							<EditWrapper stringId="REFERRAL_LINK.INFO_TEXT">
								{STRINGS['REFERRAL_LINK.INFO_TEXT']}
							</EditWrapper>
						</div>
					</div>
					<div className="my-4">
						<RenderDumbField
							stringId="REFERRAL_LINK.COPY_FIELD_LABEL"
							label={STRINGS['REFERRAL_LINK.COPY_FIELD_LABEL']}
							value={referralLink}
							fullWidth={true}
							allowCopy={true}
							copyOnClick={true}
							onCopy={this.handleCopy}
						/>
					</div>
					<div className="user_refer_info p-4 d-flex align-items-center">
						<EditWrapper stringId="REFERRAL_LINK.REFERRED_USER_COUT">
							{STRINGS.formatString(
								STRINGS['REFERRAL_LINK.REFERRED_USER_COUT'],
								affiliationCount
							)}
						</EditWrapper>
					</div>
					<div className="d-flex my-5">
						<Button
							label={STRINGS['BACK_TEXT']}
							className="mr-5"
							onClick={this.props.onBack}
						/>
						<CopyToClipboard text={referralLink} onCopy={this.handleCopy}>
							<Button
								label={
									this.state.copied
										? STRINGS['SUCCESFUL_COPY']
										: STRINGS['REFERRAL_LINK.COPY_LINK_BUTTON']
								}
								onClick={() => {}}
							/>
						</CopyToClipboard>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	affiliation: store.user.affiliation || {},
	is_hap: store.user.is_hap,
});

const mapDispatchToProps = (dispatch) => ({
	getUserReferralCount: bindActionCreators(getUserReferralCount, dispatch),
	setSnackNotification: bindActionCreators(setSnackNotification, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(InviteFriends);
