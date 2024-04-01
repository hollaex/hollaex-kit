import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import DumbField from 'components/Form/FormFields/DumbField';
import { Table, EditWrapper, Button, IconTitle } from 'components';
import STRINGS from 'config/localizedStrings';
import { getUserReferrals } from 'actions/userAction';
import { setSnackNotification } from 'actions/appActions';

const RenderDumbField = (props) => <DumbField {...props} />;
const RECORD_LIMIT = 20;

const HEADERS = [
	{
		stringId: 'REFERRAL_LINK.USER',
		label: STRINGS['REFERRAL_LINK.USER'],
		key: 'email',
		renderCell: ({ user: { email } }, key, index) => (
			<td key={key}>
				<div className="d-flex justify-content-start">{email}</div>
			</td>
		),
	},
	{
		stringId: 'REFERRAL_LINK.TIME',
		label: STRINGS['REFERRAL_LINK.TIME'],
		key: 'time',
		className: 'd-flex justify-content-end',
		renderCell: ({ created_at }, key, index) => (
			<td key={key}>
				<div className="d-flex justify-content-end">{created_at}</div>
			</td>
		),
	},
];

class InviteFriends extends Component {
	constructor(props) {
		super(props);
		this.state = {
			copied: false,
			showReferrals: false,
		};
	}

	componentDidMount() {
		const { getUserReferrals } = this.props;
		getUserReferrals();
	}

	handleCopy = () => {
		const { icons: ICONS, setSnackNotification } = this.props;
		setSnackNotification({
			icon: ICONS.COPY_NOTIFICATION,
			content: STRINGS['COPY_SUCCESS_TEXT'],
		});
	};

	viewReferrals = (showReferrals) => {
		this.setState({ showReferrals });
	};

	handleNext = (pageCount, pageNumber) => {
		const { affiliation, getUserReferrals } = this.props;
		const pageTemp = pageNumber % 2 === 0 ? 2 : 1;
		const apiPageTemp = Math.floor((pageNumber + 1) / 2);

		if (
			RECORD_LIMIT === pageCount * pageTemp &&
			apiPageTemp >= affiliation.page &&
			affiliation.isRemaining
		) {
			getUserReferrals(affiliation.page + 1, RECORD_LIMIT);
		}
	};

	render() {
		const {
			data: { affiliation_code },
			affiliation,
			icons: ICONS,
			onBack,
		} = this.props;
		const referralLink = `${process.env.REACT_APP_PUBLIC_URL}/signup?affiliation_code=${affiliation_code}`;
		const { showReferrals } = this.state;

		return !showReferrals ? (
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
					<div className="user_refer_info p-4 d-flex align-items-center justify-content-between">
						<div>
							<EditWrapper stringId="REFERRAL_LINK.REFERRED_USER_COUT">
								{STRINGS.formatString(
									STRINGS['REFERRAL_LINK.REFERRED_USER_COUT'],
									affiliation.loading ? (
										<LoadingOutlined className="px-2" />
									) : (
										affiliation.count
									)
								)}
							</EditWrapper>
						</div>
						<div
							className="underline-text caps pointer"
							onClick={() => this.viewReferrals(true)}
						>
							<EditWrapper stringId="REFERRAL_LINK.VIEW">
								{STRINGS['REFERRAL_LINK.VIEW']}
							</EditWrapper>
						</div>
					</div>
					<div className="d-flex my-5">
						<Button
							label={STRINGS['BACK_TEXT']}
							className="mr-5"
							onClick={onBack}
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
		) : (
			<div className="invite_friends_wrapper mx-auto">
				<IconTitle
					stringId="REFERRAL_LINK.TABLE_TITLE"
					text={STRINGS['REFERRAL_LINK.TABLE_TITLE']}
					iconId="REFER_ICON"
					iconPath={ICONS['REFER_ICON']}
					textType="title"
					underline={true}
				/>
				<div>
					<div className="my-2">
						<Table
							rowClassName="pt-2 pb-2"
							headers={HEADERS}
							data={affiliation.data}
							count={affiliation.count}
							handleNext={this.handleNext}
							pageSize={10}
							displayPaginator={!affiliation.loading}
						/>
						{affiliation.loading && (
							<div className="d-flex my-5 py-5 align-items-center justify-content-center">
								<LoadingOutlined style={{ fontSize: '3rem' }} />
							</div>
						)}
					</div>
					<div className="d-flex my-5">
						<Button
							label={STRINGS['BACK_TEXT']}
							className="mr-5"
							onClick={() => this.viewReferrals(false)}
						/>
						<Button label={STRINGS['CLOSE_TEXT']} onClick={onBack} />
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
	getUserReferrals: bindActionCreators(getUserReferrals, dispatch),
	setSnackNotification: bindActionCreators(setSnackNotification, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(InviteFriends);
