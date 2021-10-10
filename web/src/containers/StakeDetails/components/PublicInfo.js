import React from 'react';
import STRINGS from 'config/localizedStrings';

const PublicInfo = ({ fullname, token }) => {
	return (
		<div>
			<div className="d-flex">
				<div>
					<div>
						<div className="bold">
							{STRINGS['STAKE_DETAILS.PUBLIC_INFO.TITLE']}
						</div>
						<div className="secondary-text">
							{STRINGS.formatString(
								STRINGS['STAKE_DETAILS.PUBLIC_INFO.SUBTITLE'],
								fullname,
								token.toUpperCase()
							)}
						</div>
					</div>

					<div className="pt-4">
						<div className="bold">
							{STRINGS['STAKE_DETAILS.PUBLIC_INFO.TOTAL_DISTRIBUTED_EARNINGS']}
						</div>
						<div className="secondary-text">383,001 XHT</div>
					</div>

					<div className="pt-4 d-flex">
						<div>
							<div className="bold">
								{
									STRINGS[
										'STAKE_DETAILS.PUBLIC_INFO.CLEARED_UNDISTRIBUTED_EARNINGS'
									]
								}
							</div>
							<div className="secondary-text">31,000 XHT</div>
						</div>
						<div className="secondary-text px-4">|</div>
						<div>
							<div className="bold">
								{
									STRINGS[
										'STAKE_DETAILS.PUBLIC_INFO.UNCLEARED_PENDING_EARNINGS'
									]
								}
							</div>
							<div className="secondary-text">13,000 XHT</div>
						</div>
					</div>

					<div className="pt-4">
						<div className="bold">
							{STRINGS['STAKE_DETAILS.PUBLIC_INFO.TOTAL_STAKED']}
						</div>
						<div className="secondary-text">3,213,321 XHT</div>
					</div>

					<div className="pt-4">
						<div className="bold">
							{STRINGS['STAKE_DETAILS.PUBLIC_INFO.REWARD_RATE']}
						</div>
						<div className="secondary-text">
							{STRINGS['STAKE_DETAILS.PUBLIC_INFO.VARIABLE']}
						</div>
					</div>
				</div>
				<div>
					<div className="pt-4">
						<div className="bold">
							{STRINGS.formatString(
								STRINGS['STAKE_DETAILS.PUBLIC_INFO.MY_STAKE'],
								25
							)}
						</div>
						<div className="secondary-text">3,213,321 XHT</div>
					</div>

					<div className="pt-4">
						<div className="bold">
							{STRINGS.formatString(
								STRINGS['STAKE_DETAILS.PUBLIC_INFO.OTHER_STAKE'],
								75
							)}
						</div>
						<div className="secondary-text">3,213,321 XHT</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PublicInfo;
