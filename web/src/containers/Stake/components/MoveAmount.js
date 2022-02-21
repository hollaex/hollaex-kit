import React, { Fragment } from 'react';
import STRINGS from 'config/localizedStrings';
import {
	ActionNotification,
	EditWrapper,
	Button,
	Image,
	IconTitle,
} from 'components';
import { Input } from 'antd';
import Ionicon from 'react-ionicons';
import withConfig from 'components/ConfigProvider/withConfig';

const MoveAmount = ({
	onClose,
	onBack,
	onNext,
	amount,
	setAmount,
	icons: ICONS,
	available,
	currency,
}) => {
	const symbol = 'xht';
	const iconId = `${symbol.toUpperCase()}_ICON`;

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
					stringId="MOVE_AMOUNT.TITLE"
					text={STRINGS['MOVE_AMOUNT.TITLE']}
					textType="stake_popup__title m-0 pl-3"
					underline={false}
					className="w-100 py-4 flex-direction-row justify-content-start"
					imageWrapperClassName="stake-unlock-title"
				/>

				<div>
					<div>
						<EditWrapper stringId="MOVE_AMOUNT.PROMPT">
							{STRINGS['MOVE_AMOUNT.PROMPT']}
						</EditWrapper>
					</div>
				</div>

				<div className="pt-4">
					<div>
						<EditWrapper stringId="MOVE_AMOUNT.BALANCE">
							{STRINGS.formatString(
								STRINGS['MOVE_AMOUNT.BALANCE'],
								currency.toUpperCase(),
								available
							)}
						</EditWrapper>
					</div>
				</div>
			</div>
			<div className="dialog-content bottom w-100">
				<div className="mt-4 pt-3">
					<div className="pb-2">
						<EditWrapper stringId="STAKE.AMOUNT_LABEL">
							{STRINGS['MOVE_AMOUNT.LABEL']}
						</EditWrapper>
					</div>
					<Input
						className="stake-amount-input"
						type="number"
						value={amount}
						onChange={setAmount}
						prefix={
							<Image
								iconId={iconId}
								icon={ICONS[iconId]}
								wrapperClassName="currency-ball"
							/>
						}
					/>
				</div>
				<div className="pt-4">
					<div>
						<EditWrapper stringId="MOVE_AMOUNT.FEE">
							{STRINGS.formatString(STRINGS['MOVE_AMOUNT.FEE'], 'ETH', 0.05)}
						</EditWrapper>
					</div>
				</div>
				<div className="d-flex mt-4 pt-3">
					<div className="w-50">
						<EditWrapper stringId="STAKE.BACK" />
						<Button label={STRINGS['STAKE.BACK']} onClick={onBack} />
					</div>
					<div className="separator" />
					<div className="w-50">
						<EditWrapper stringId="STAKE.NEXT" />
						<Button
							label={STRINGS['STAKE.NEXT']}
							onClick={onNext}
							disabled={!amount}
						/>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default withConfig(MoveAmount);
