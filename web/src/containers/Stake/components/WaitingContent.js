import React, { Fragment } from 'react';
import { EditWrapper, IconTitle, ActionNotification } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { LoadingOutlined } from '@ant-design/icons';
import Ionicon from 'react-ionicons';

const WaitingContent = ({ action, amount, symbol, isPending, onClose }) => {
	return (
		<Fragment>
			{isPending && (
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
			)}
			<div className="dialog-content">
				<div className="d-flex content-center pt-4 mt-4 staking-loader">
					{isPending && <LoadingOutlined />}
				</div>
				<IconTitle
					stringId="STAKE.WAITING_TITLE"
					text={isPending ? '' : STRINGS['STAKE.WAITING_TITLE']}
					textType="stake_popup__title"
					underline={false}
					className="w-100"
				/>
			</div>
			<div className="dialog-content bottom">
				<div className="text-align-center">
					<EditWrapper stringId="STAKE.WAITING_PROMPT,STAKE.WAITING_APPROVE,STAKE.WAITING_STAKE">
						{!isPending
							? STRINGS.formatString(
									STRINGS['STAKE.WAITING_PROMPT'],
									STRINGS[`STAKE.WAITING_${action}`],
									amount,
									symbol.toUpperCase()
							  )
							: STRINGS.formatString(
									STRINGS['STAKE.WAITING_PROMPT'],
									STRINGS[`STAKE.WAITING_${action}_ING`],
									amount,
									symbol.toUpperCase()
							  )}
					</EditWrapper>
				</div>
				<div className="text-align-center secondary-text">
					{!isPending ? (
						<EditWrapper stringId="STAKE.WAITING_TEXT">
							{STRINGS['STAKE.WAITING_TEXT']}
						</EditWrapper>
					) : (
						<EditWrapper stringId="STAKE.PENDING_TEXT">
							{STRINGS['STAKE.PENDING_TEXT']}
						</EditWrapper>
					)}
				</div>
			</div>
		</Fragment>
	);
};

export default withConfig(WaitingContent);
