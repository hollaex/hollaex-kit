import React, { useState, useEffect } from 'react';
import mathjs from 'mathjs';
import { IconTitle, Button, EditWrapper, Image } from 'components';
import { DEFAULT_COIN_DATA, CURRENCY_PRICE_FORMAT } from 'config/constants';
import { formatCurrencyByIncrementalUnit } from 'utils/currency';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const FEE_RATIO = 0;

const DustConfirmation = ({
	onConfirm,
	onBack,
	definition,
	quote,
	coins,
	icons: ICONS,
	loading,
	data,
}) => {
	const [estimatedValue, setEstimatedValue] = useState(0);
	const [estimatedFee, setEstimatedFee] = useState(0);

	useEffect(() => {
		let total = 0;
		data.forEach(({ quoteSize = 0 }) => {
			total = mathjs.add(total, quoteSize);
		});
		setEstimatedValue(total);
		setEstimatedFee(mathjs.multiply(total, FEE_RATIO));
	}, [data]);

	const { increment_unit, display_name } = coins[quote] || DEFAULT_COIN_DATA;

	return (
		<div className="dust-dialog-content">
			<IconTitle
				iconId="DUST_CONFIRMATION"
				iconPath={ICONS['DUST_CONFIRMATION']}
				stringId="DUST.CONFIRMATION.TITLE,DUST.CONFIRMATION.SUBTITLE"
				text={STRINGS['DUST.CONFIRMATION.TITLE']}
				subtitle={STRINGS['DUST.CONFIRMATION.SUBTITLE']}
				underline={true}
				textType="title"
				className="w-100"
			/>

			<div
				className="d-flex justify-content-around flex-wrap align-center py-4"
				style={{ gap: '1rem' }}
			>
				{data.map(({ symbol }) => {
					const key = symbol?.split('-')[0];
					const { icon_id, fullname } = coins[key] || DEFAULT_COIN_DATA;

					return (
						<div key={key} className="d-flex align-items-center">
							<Image
								iconId={icon_id}
								icon={ICONS[icon_id]}
								wrapperClassName="currency-ball"
								imageWrapperClassName="currency-ball-image-wrapper"
							/>
							<div>{fullname}</div>
						</div>
					);
				})}
			</div>

			<div className="kit-divider m-0" />
			<div className="d-flex justify-content-between align-start pb-5">
				<div className="bold">
					<EditWrapper stringId="DUST.CONFIRMATION.GET">
						{STRINGS['DUST.CONFIRMATION.GET']}
					</EditWrapper>
					:
				</div>
				<div className="font-title bold">
					{STRINGS.formatString(
						CURRENCY_PRICE_FORMAT,
						formatCurrencyByIncrementalUnit(estimatedValue, increment_unit),
						display_name
					)}
				</div>
			</div>

			<div className="kit-divider" />
			<div className="secondary-text d-flex justify-content-between align-center">
				<div>
					<EditWrapper stringId="DUST.CONFIRMATION.FEE">
						{STRINGS['DUST.CONFIRMATION.FEE']}
					</EditWrapper>
					:
				</div>
				<div>
					{STRINGS.formatString(
						CURRENCY_PRICE_FORMAT,
						formatCurrencyByIncrementalUnit(estimatedFee, increment_unit),
						display_name
					)}
				</div>
			</div>
			<div className="kit-divider" />

			<div>
				<div className="dust-note">
					<EditWrapper stringId="DUST.CONFIRMATION.PLEASE">
						{STRINGS['DUST.CONFIRMATION.PLEASE']}
					</EditWrapper>
				</div>
				<div className="secondary-text">
					<EditWrapper stringId="DUST.CONFIRMATION.NOTE">
						{STRINGS.formatString(
							STRINGS['DUST.CONFIRMATION.NOTE'],
							<span className="caps">{quote}</span>,
							definition.criterion,
							<span className="caps">{definition.quote}</span>
						)}
					</EditWrapper>
				</div>
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
						disabled={loading}
					/>
				</div>
			</div>
		</div>
	);
};

export default withConfig(DustConfirmation);
