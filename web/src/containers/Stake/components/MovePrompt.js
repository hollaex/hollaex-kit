import React, { Fragment } from 'react';
import { EditWrapper, Button, IconTitle } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import DumbField from 'components/Form/FormFields/DumbField';

const MovePrompt = ({ account, onClose }) => {
	const props_account = {
		stringId: 'MOVE_XHT.LABEL',
		label: STRINGS['MOVE_XHT.LABEL'],
		className: 'token-value-input',
		value: account,
		fullWidth: true,
		allowCopy: true,
	};

	return (
		<Fragment>
			<div className="dialog-content">
				<IconTitle
					stringId="MOVE_XHT.TITLE"
					text={STRINGS['MOVE_XHT.TITLE']}
					textType="stake_popup__title m-0 pl-3"
					underline={false}
					className="w-100 py-4 flex-direction-row justify-content-start"
					imageWrapperClassName="stake-unlock-title"
				/>

				<div className="pt-4">
					<div>
						<EditWrapper stringId="MOVE_XHT.TEXT_1">
							{STRINGS['MOVE_XHT.TEXT_1']}
						</EditWrapper>
					</div>
				</div>

				<div className="pt-4">
					<div>
						<EditWrapper stringId="MOVE_XHT.TEXT_2">
							{STRINGS['MOVE_XHT.TEXT_2']}
						</EditWrapper>
					</div>
					<div className="mt-4">
						<DumbField {...props_account} />
					</div>
				</div>

				<div className="pt-4">
					<div>
						<EditWrapper stringId="MOVE_XHT.TEXT_3">
							{STRINGS['MOVE_XHT.TEXT_3']}
						</EditWrapper>
					</div>
				</div>
			</div>
			<div className="dialog-content bottom">
				<div className="d-flex mt-4 pt-3">
					<div className="w-100">
						<EditWrapper stringId="NOTIFICATIONS.BUTTONS.OKAY" />
						<Button
							label={STRINGS['NOTIFICATIONS.BUTTONS.OKAY']}
							onClick={onClose}
						/>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default withConfig(MovePrompt);
