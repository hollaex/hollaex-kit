import React, { Fragment } from 'react';
import { EditWrapper, IconTitle } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const WaitingContent = ({ action, amount, symbol, icons: ICONS }) => {
	return (
		<Fragment>
			<div className="dialog-content">
				<IconTitle
					stringId="STAKE.WAITING_TITLE"
					text={STRINGS['STAKE.WAITING_TITLE']}
					iconId="EXCHANGE_LOADER"
					iconPath={ICONS['EXCHANGE_LOADER']}
					textType="title"
					underline={false}
					className="w-100"
				/>
			</div>
			<div className="dialog-content bottom">
				<div className="text-align-center">
					<EditWrapper stringId="STAKE.WAITING_PROMPT,STAKE.WAITING_APPROVE,STAKE.WAITING_STAKE">
						{STRINGS.formatString(
							STRINGS['STAKE.WAITING_PROMPT'],
							STRINGS[`STAKE.WAITING_${action}`],
							amount,
							symbol.toUpperCase()
						)}
					</EditWrapper>
				</div>
				<div className="text-align-center secondary-text">
					<EditWrapper stringId="STAKE.WAITING_TEXT">
						{STRINGS['STAKE.WAITING_TEXT']}
					</EditWrapper>
				</div>
			</div>
		</Fragment>
	);
};

export default withConfig(WaitingContent);
