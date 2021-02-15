import React, { Component } from 'react';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { AdminHocForm } from '../../../components';
import { STATIC_ICONS } from 'config/icons';

const DescriptionForm = AdminHocForm('DescriptionForm');
const FooterTextForm = AdminHocForm('FooterDescriptionForm');
const ReferralBadgeForm = AdminHocForm('ReferralBadgeForm');

class Description extends Component {
	handleImg = (type) => {
		if (type === 'referral_badge') {
			return (
				<img
					src={STATIC_ICONS.HELP_REFERRAL_BADGE_POPUP}
					className="help-icon referral_badge_note"
					alt="referral badge"
				/>
			);
		}

		return type === 'description' ? (
			<img
				src={STATIC_ICONS.HELP_DESCRIPTION_POPUP}
				className="help-icon description_note"
				alt="description_note"
			/>
		) : type === 'footer' ? (
			<img
				src={STATIC_ICONS.HELP_FOOTER_POPUP}
				className="help-icon description_footer"
				alt="footer"
			/>
		) : null;
	};

	render() {
		const {
			descriptionFields,
			descriptionInitialValues,
			footerFields,
			footerInitialValues,
			ReferralBadgeFields,
			ReferralBadgeInitialValues,
		} = this.props;
		return (
			<div className="description-wrapper">
				<div>
					<h3>
						Exchange description{' '}
						<Tooltip
							overlayClassName="admin-general-description-tip general-description-tip-right"
							title={this.handleImg('description')}
							placement="right"
						>
							<QuestionCircleOutlined style={{ color: '#ffffff' }} />
						</Tooltip>
					</h3>
				</div>
				<p>
					Write a short description or slogan for your project that will be
					displayed in the footer near your logo.
				</p>
				<DescriptionForm
					initialValues={descriptionInitialValues}
					fields={descriptionFields}
					onSubmit={this.props.handleSubmitDescription}
					buttonText="Save"
					buttonClass="green-btn minimal-btn"
				/>
				<div className="divider"></div>
				<div>
					<h3>
						Footer small text{' '}
						<Tooltip
							overlayClassName="admin-general-description-tip general-description-tip-right"
							title={this.handleImg('footer')}
							placement="right"
						>
							<QuestionCircleOutlined style={{ color: '#ffffff' }} />
						</Tooltip>
					</h3>
				</div>
				<p>Small text often used for copywrite or other business data</p>
				<FooterTextForm
					initialValues={footerInitialValues}
					fields={footerFields}
					onSubmit={this.props.handleSubmitDescription}
					buttonText="Save"
					buttonClass="green-btn minimal-btn"
				/>
				<div className="divider"></div>
				<div>
					<h3>
						Referral Badge{' '}
						<Tooltip
							overlayClassName="admin-general-description-tip general-description-tip-right"
							title={this.handleImg('referral_badge')}
							placement="right"
						>
							<QuestionCircleOutlined style={{ color: '#ffffff' }} />
						</Tooltip>
					</h3>
				</div>
				<p>
					Edit the referral badge in the bottom left corner. This space can be
					repurposed for copyright or other business related data.
				</p>
				<ReferralBadgeForm
					initialValues={ReferralBadgeInitialValues}
					fields={ReferralBadgeFields}
					buttonText="Save"
					buttonClass="green-btn minimal-btn"
					onSubmit={this.props.handleSubmitReferralBadge}
				/>
			</div>
		);
	}
}

export default Description;
