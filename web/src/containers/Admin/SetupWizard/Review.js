import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Button } from 'antd';

const ExchangeReview = ({
	constants = {},
	coins = {},
	pairs = {},
	setPreview,
	setConfirm,
}) => {
	const { kit = {}, secrets = {} } = constants;
	let coinData = Object.keys(coins || {})
		.map((key) => key)
		.join(',');
	let pairData = Object.keys(pairs || {})
		.map((key) => key)
		.join(',');
	return (
		<div className="wizard-container">
			<div className="content">
				<div>
					<div className="header">
						<div>Exchange</div>
						<div>Configuration review</div>
					</div>
					<div className="description">
						Please review and click confirm to complete your exchange setup.
						Incomplete data can be configured within operator controls at a
						later date.
					</div>
				</div>
				<div className="preview-container">
					<div className="preview-heading">{kit.api_name}</div>
					<div className="preview-time description">
						<div>{moment().format('YYYY-MM-DD')}</div>
					</div>
				</div>
				<div>
					{/* <div className="option-list">
						<div className="option-label">Time zone: </div>
						<div className="option-value">
							{kit && kit.timezone !== 'null' ? kit.timezone : ''}
						</div>
					</div> */}
					<div className="option-list">
						<div className="option-label">Language: </div>
						<div className="option-value">
							{kit.defaults && kit.defaults.language !== 'null'
								? kit.defaults.language
								: ''}
						</div>
					</div>
					<div className="option-list">
						<div className="option-label">2FA: </div>
						<div className="option-value">false</div>
					</div>
					{/* <div className="option-list">
						<div className="option-label">Exchange network key: </div>
						<div className="option-value"> </div>
					</div> */}
					<div className="option-list">
						<div className="option-label">Assets: </div>
						<div className="option-value">{coinData}</div>
					</div>
					<div className="option-list">
						<div className="option-label">Pairs: </div>
						<div className="option-value">{pairData}</div>
					</div>
					<div className="option-list">
						<div className="option-label">Pro trade: </div>
						<div className="option-value">true</div>
					</div>
					<div className="option-list">
						<div className="option-label">Quick trade: </div>
						<div className="option-value">true</div>
					</div>
					<div className="option-list">
						<div className="option-label">Sender email: </div>
						<div className="option-value">
							{secrets.emails && secrets.emails.sender !== 'null'
								? secrets.emails.sender
								: ''}
						</div>
					</div>
					<div className="option-list">
						<div className="option-label">Email time zone: </div>
						<div className="option-value">
							{secrets.emails && secrets.emails.timezone !== 'null'
								? secrets.emails.timezone
								: ''}
						</div>
					</div>
					{/* <div className="option-list">
						<div className="option-label">SMTP server: </div>
						<div className="option-value">
							{secrets.smtp && secrets.smtp.server !== 'null'
								? secrets.smtp.server
								: ''}
						</div>
					</div>
					<div className="option-list">
						<div className="option-label">SMTP port: </div>
						<div className="option-value">
							{secrets.smtp && secrets.smtp.port !== 'null'
								? secrets.smtp.port
								: ''}
						</div>
					</div>
					<div className="option-list">
						<div className="option-label">SMTP username: </div>
						<div className="option-value">
							{secrets.smtp && secrets.smtp.user !== 'null'
								? secrets.smtp.user
								: ''}
						</div>
					</div>
					<div className="option-list">
						<div className="option-label">SMTP password: </div>
						<div className="option-value">
							{secrets.smtp && secrets.smtp.password !== 'null'
								? secrets.smtp.password
								: ''}
						</div>
					</div> */}
					<div className="option-list">
						<div className="option-label">Auditor email: </div>
						<div className="option-value">
							{secrets.emails && secrets.emails.audit !== 'null'
								? secrets.emails.audit
								: ''}
						</div>
					</div>
					{/* <div className="option-list">
						<div className="option-label">Site key (Google reCAPTHA V3): </div>
						<div className="option-value">
							{kit.captcha && kit.captcha.site_key !== 'null'
								? kit.captcha.site_key
								: ''}
						</div>
					</div>
					<div className="option-list">
						<div className="option-label">
							Secret key (Google reCAPTHA V3):{' '}
						</div>
						<div className="option-value">
							{secrets.captcha && secrets.captcha.secret_key !== 'null'
								? secrets.captcha.secret_key
								: ''}
						</div>
					</div> */}
				</div>
				<div className="option-list previewButton">
					<Button onClick={() => setPreview()}>Back</Button>
					<div className="separator"></div>
					<Button
						onClick={() => {
							setConfirm(true);
						}}
					>
						Confirm
					</Button>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	user: state.user,
	coins: state.app.coins,
	pairs: state.app.pairs,
});

export default connect(mapStateToProps)(ExchangeReview);
