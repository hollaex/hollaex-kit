import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tooltip, Button } from 'antd';
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
			constants: { info: { type, plan } = {} } = {},
			isUpgrade
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
				<p>Add a link to your Terms of Service and Privacy Policy</p>
				<FooterTextForm
					initialValues={footerInitialValues}
					fields={footerFields}
					onSubmit={this.props.handleSubmitFooterText}
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
				{isUpgrade
					?
						<div className="d-flex">
							<div className="d-flex align-items-center justify-content-between upgrade-section mt-2 mb-5">
								<div>
									<div className="font-weight-bold">Fully rebrand your platform</div>
									<div>Replace the badge with your own branding</div>
								</div>
								<div className="ml-5 button-wrapper">
									<a
										href="https://dash.bitholla.com/billing"
										target="_blank"
										rel="noopener noreferrer"
									>
										<Button
											type="primary"
											className="w-100"
										>
											Upgrade Now
										</Button>
									</a>
								</div>
							</div>
						</div>
					: null
				}
				{type === 'DIY' ? (
					<div
						style={{ width: '465px' }}
						className="admin-dash-card flex-menu justify-content-between"
					>
						<div>
							<div className="card-description">
								This feature is only available for Cloud exchanges
							</div>
						</div>
					</div>
				) : plan === 'basic' ? (
					<div
						style={{ width: '465px' }}
						className="admin-dash-card flex-menu justify-content-between"
					>
						<div>
							<div className="card-title bold">Fully rebrand your platform</div>
							<div className="card-description">
								Replace the badge with your own branding.
							</div>
						</div>
						<div>
							<a
								href="https://dash.bitholla.com/"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Button type="primary" className="green-btn minimal-btn bold">
									Upgrade Now
								</Button>
							</a>
						</div>
					</div>
				) : null}
				<div className={isUpgrade ? "disable-referral" : ""}>
					<ReferralBadgeForm
						initialValues={ReferralBadgeInitialValues}
						fields={ReferralBadgeFields}
						buttonText="Save"
						buttonClass="green-btn minimal-btn"
						onSubmit={this.props.handleSubmitReferralBadge}
						disableAllFields={type === 'DIY' || plan === 'basic'}
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	constants: store.app.constants,
});

export default connect(mapStateToProps)(Description);
