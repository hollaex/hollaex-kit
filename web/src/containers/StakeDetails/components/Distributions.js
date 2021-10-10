import React from 'react';
import STRINGS from 'config/localizedStrings';

const Distributions = ({ token }) => {
	return (
		<div>
			<div className="d-flex">
				<div>
					<div>
						<div className="bold">
							{STRINGS.formatString(
								STRINGS['STAKE_DETAILS.DISTRIBUTIONS.TITLE'],
								token.toUpperCase()
							)}
						</div>
						<div className="secondary-text">
							{STRINGS.formatString(
								STRINGS['STAKE_DETAILS.DISTRIBUTIONS.SUBTITLE'],
								token.toUpperCase()
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Distributions;
