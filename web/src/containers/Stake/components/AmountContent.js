import React, { Fragment } from 'react';
import { Input } from 'antd';
import {
	EditWrapper,
	Button,
	IconTitle,
	Image,
	ActionNotification,
} from 'components';
import Ionicon from 'react-ionicons';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const AmountContent = ({
	tokenData,
	onClose,
	onBack,
	onNext,
	amount,
	setAmount,
	icons: ICONS,
	isValid,
	error,
}) => {
	const { fullname, available, icon_id, display_name } = tokenData;

	const background = {
		'background-image': `url(${ICONS['STAKING_AMOUNT_MODAL']})`,
		'background-size': 'cover',
		height: '34rem',
		minWidth: '30rem',
		maxWidth: '40rem',
	};

	const headerContent = {
		width: '100%',
		height: '100%',
		display: 'flex',
		'flex-direction': 'column',
		'justify-content': 'space-between',
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
			<div className="dialog-content background" style={background}>
				<div style={headerContent}>
					<IconTitle
						stringId="STAKE.MODAL_TITLE"
						text={STRINGS.formatString(
							STRINGS['STAKE.MODAL_TITLE'],
							display_name
						)}
						textType="stake_popup__title"
						underline={false}
						className="w-100 pt-4"
					/>
					<div className="text-align-center my-4 py-3">
						<EditWrapper stringId="STAKE.AVAILABLE_TOKEN">
							{STRINGS.formatString(
								STRINGS['STAKE.AVAILABLE_TOKEN'],
								fullname,
								display_name,
								<span
									className="blue-link mx-2 pointer"
									onClick={() => setAmount({ target: { value: available } })}
								>
									{available}
								</span>
							)}
						</EditWrapper>
					</div>
				</div>
			</div>
			<div className="dialog-content bottom w-100">
				<div className="mt-4">
					<div className="pb-2">
						<EditWrapper stringId="STAKE.AMOUNT_LABEL">
							{STRINGS['STAKE.AMOUNT_LABEL']}
						</EditWrapper>
					</div>
					<Input
						className="stake-amount-input"
						type="number"
						value={amount}
						onChange={setAmount}
						prefix={
							<Image
								iconId={icon_id}
								icon={ICONS[icon_id]}
								wrapperClassName="currency-ball"
							/>
						}
					/>
					<div>
						{error && <span className="field_warning_wrapper">{error}</span>}
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
							disabled={!isValid}
						/>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default withConfig(AmountContent);
