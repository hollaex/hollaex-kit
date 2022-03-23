import React, { Fragment } from 'react';
import Ionicon from 'react-ionicons';
import { EditWrapper, Button, IconTitle, ActionNotification } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import DumbField from 'components/Form/FormFields/DumbField';

const MovePrompt = ({
	account,
	onBack,
	onClose,
	onProceed,
	icons: ICONS,
	onCopy,
}) => {
	const props_account = {
		stringId: 'MOVE_XHT.LABEL',
		label: STRINGS['MOVE_XHT.LABEL'],
		value: account,
		fullWidth: true,
		allowCopy: true,
		onCopy: onCopy,
		copyOnClick: true,
	};

	return (
		<Fragment>
			<ActionNotification
				text={
					<Ionicon
						icon="md-close"
						fontSize="24px"
						className="action_notification-image"
					/>
				}
				onClick={onClose}
				className="close-button p-2"
			/>
			<div className="dialog-content">
				<IconTitle
					stringId="MOVE_XHT.TITLE"
					text={STRINGS['MOVE_XHT.TITLE']}
					iconPath={ICONS['MOVE_XHT']}
					iconId="MOVE_XHT"
					textType="stake_popup__title m-0 pl-3"
					underline={false}
					className="w-100 py-4 flex-direction-row justify-content-start"
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
					<div className="w-50">
						<EditWrapper stringId="STAKE.BACK" />
						<Button label={STRINGS['STAKE.BACK']} onClick={onBack} />
					</div>
					<div className="separator" />
					<div className="w-50">
						<EditWrapper stringId="STAKE.GO_TO_WALLET" />
						<Button
							classname="caps"
							label={STRINGS['STAKE.GO_TO_WALLET']}
							onClick={onProceed}
						/>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default withConfig(MovePrompt);
