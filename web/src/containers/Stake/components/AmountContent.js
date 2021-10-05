import React, { Fragment } from 'react';
import { Input } from 'antd';
import { EditWrapper, Button, IconTitle, Image } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const AmountContent = ({
	tokenData,
	onBack,
	onNext,
	amount,
	setAmount,
	icons: ICONS,
}) => {
	const { symbol, fullname, available } = tokenData;
	const iconId = `${symbol.toUpperCase()}_ICON`;

	const background = {
		'background-image': `url(${ICONS['STAKING_AMOUNT_MODAL']})`,
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
						stringId="STAKE.MODAL_TITLE"
						text={STRINGS.formatString(
							STRINGS['STAKE.MODAL_TITLE'],
							symbol.toUpperCase()
						)}
						textType="title"
						underline={false}
						className="w-100"
					/>
					<div className="text-align-center my-4 py-3">
						<EditWrapper stringId="STAKE.AVAILABLE_TOKEN">
							{STRINGS.formatString(
								STRINGS['STAKE.AVAILABLE_TOKEN'],
								fullname,
								symbol.toUpperCase(),
								<span className="blue-link mx-2">{available}</span>
							)}
						</EditWrapper>
					</div>
				</div>
			</div>
			<div className="dialog-content bottom w-100 h-100">
				<div className="mt-4 pt-3">
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
								iconId={iconId}
								icon={ICONS[iconId]}
								wrapperClassName="currency-ball"
							/>
						}
					/>
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

export default withConfig(AmountContent);
