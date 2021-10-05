import React, { Fragment } from 'react';
import { EditWrapper, Button, IconTitle, ProgressBar } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const ReviewEarlyUnstake = ({
	stakeData,
	onCancel,
	onProceed,
	icons: ICONS,
}) => {
	const { partial, total, progressStatusText } = stakeData;

	const background = {
		'background-image': `url(${ICONS['STAKING_MODAL_BACKGROUND']})`,
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
			<div className="dialog-content top" style={background}>
				<div style={headerContent}>
					<IconTitle
						stringId="UNSTAKE.EARLY_TITLE"
						text={STRINGS['UNSTAKE.EARLY_TITLE']}
						textType="title"
						underline={false}
						className="w-100"
					/>
					<div>
						<EditWrapper stringId="UNSTAKE.DURATION">
							{STRINGS['UNSTAKE.DURATION']}
						</EditWrapper>
					</div>
					<div className="d-flex">
						<ProgressBar partial={partial} total={total} />
						<div className="px-2 align-center">{progressStatusText}</div>
					</div>
				</div>
			</div>

			<div className="dialog-content bottom w-100 h-100">
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
