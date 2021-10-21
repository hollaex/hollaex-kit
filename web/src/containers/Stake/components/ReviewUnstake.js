import React, { Fragment } from 'react';
import { Button as AntBtn } from 'antd';
import { EditWrapper, Button, IconTitle, Image } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const ReviewEarlyUnstake = ({
	stakeData,
	onCancel,
	onProceed,
	onClear,
	icons: ICONS,
}) => {
	const { symbol } = stakeData;
	const iconId = `${symbol.toUpperCase()}_ICON`;

	const background = {
		'background-image': `url(${ICONS['STAKING_MODAL_BACKGROUND']})`,
		height: '292px',
		width: '506px',
	};

	const headerContent = {};

	return (
		<Fragment>
			<div className="dialog-content background" style={background}>
				<div style={headerContent}>
					<IconTitle
						stringId="UNSTAKE.TITLE"
						text={STRINGS['UNSTAKE.TITLE']}
						textType="stake_popup__title"
						underline={false}
						className="w-100"
					/>
					<div className="pt-4">
						<div className="bold pb-1">
							<EditWrapper stringId="UNSTAKE.AMOUNT_TO_RECEIVE">
								{STRINGS['UNSTAKE.AMOUNT_TO_RECEIVE']}
							</EditWrapper>
						</div>
						<div className="d-flex">
							<div>
								<Image
									iconId={iconId}
									icon={ICONS[iconId]}
									wrapperClassName="currency-ball"
								/>
							</div>
							<div className="bold">{`${'?'} ${symbol.toUpperCase()}`}</div>
						</div>
						<div className="secondary-text pt-1">
							<EditWrapper stringId="UNSTAKE.AMOUNT_NOTE">
								{STRINGS['UNSTAKE.AMOUNT_NOTE']}
							</EditWrapper>
						</div>
					</div>
				</div>
			</div>

			<div className="dialog-content bottom w-100">
				<div className="pt-4">
					<div className="bold pb-1">
						<EditWrapper stringId="UNSTAKE.TOTAL_EARNT">
							{STRINGS['UNSTAKE.TOTAL_EARNT']}
						</EditWrapper>
					</div>
					<div>
						{STRINGS.formatString(
							STRINGS['UNSTAKE.PRICE_FORMAT'],
							'?',
							symbol.toUpperCase()
						)}
					</div>
				</div>
				<div className="pt-4">
					<div className="bold pb-1">
						<EditWrapper stringId="UNSTAKE.PENDING_EARNINGS">
							{STRINGS['UNSTAKE.PENDING_EARNINGS']}
						</EditWrapper>
					</div>
					<div>
						{STRINGS.formatString(
							STRINGS['UNSTAKE.PRICE_FORMAT'],
							'?',
							symbol.toUpperCase()
						)}
					</div>
				</div>

				<div className="py-3">
					<AntBtn
						type="primary"
						className="stake-btn caps"
						ghost={true}
						danger={true}
						onClick={onClear}
					>
						{STRINGS['UNSTAKE.CLEAR_PENDING_EARNING']}
					</AntBtn>
				</div>
				<div className="kit-divider" />

				<div className="pt-3 secondary-text">
					<EditWrapper stringId="UNSTAKE.PENDING_EARNINGS_FOOTNOTE" />
					{STRINGS.formatString(
						STRINGS['UNSTAKE.PENDING_EARNINGS_FOOTNOTE'],
						<span
							className="blue-link pointer underline-text"
							onClick={onClear}
						>
							{STRINGS['UNSTAKE.CLEAR']}
						</span>
					)}
				</div>

				<div className="d-flex mt-4 pt-3">
					<div className="w-50">
						<EditWrapper stringId="UNSTAKE.CANCEL" />
						<Button label={STRINGS['UNSTAKE.CANCEL']} onClick={onCancel} />
					</div>
					<div className="separator" />
					<div className="w-50">
						<EditWrapper stringId="UNSTAKE.PROCEED" />
						<Button label={STRINGS['UNSTAKE.PROCEED']} onClick={onProceed} />
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default withConfig(ReviewEarlyUnstake);
