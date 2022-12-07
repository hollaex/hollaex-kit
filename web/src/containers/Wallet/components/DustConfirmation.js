import React from 'react';
import { IconTitle, Button, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';

const DustConfirmation = ({
	dustAssets,
	selectedAssets,
	onConfirm,
	onBack,
	definition,
	conversion,
}) => {
	return (
		<div>
			<IconTitle
				stringId="DUST.CONFIRMATION.TITLE,DUST.CONFIRMATION.SUBTITLE"
				text={STRINGS['DUST.CONFIRMATION.TITLE']}
				subtitle={STRINGS['DUST.CONFIRMATION.SUBTITLE']}
				underline={true}
				className="w-100 pt-4"
			/>

			<div>
				<EditWrapper stringId="DUST.CONFIRMATION.NOTE">
					{STRINGS.formatString(
						STRINGS['DUST.CONFIRMATION.NOTE'],
						<span className="caps">{conversion}</span>,
						definition.criterion,
						<span className="caps">{definition.quote}</span>
					)}
				</EditWrapper>
			</div>

			<div className="d-flex mt-4 pt-3">
				<div className="w-50">
					<EditWrapper stringId="DUST.CONFIRMATION.BACK" />
					<Button label={STRINGS['DUST.CONFIRMATION.BACK']} onClick={onBack} />
				</div>
				<div className="separator" />
				<div className="w-50">
					<EditWrapper stringId="DUST.CONFIRMATION.CONFIRM" />
					<Button
						label={STRINGS['DUST.CONFIRMATION.CONFIRM']}
						onClick={onConfirm}
						disabled={true}
					/>
				</div>
			</div>
		</div>
	);
};

export default DustConfirmation;
