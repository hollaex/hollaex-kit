import React from 'react';
import { withRouter } from 'react-router';
import { IconTitle, Button, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { DEFAULT_COIN_DATA, CURRENCY_PRICE_FORMAT } from 'config/constants';
import { formatCurrencyByIncrementalUnit } from 'utils/currency';

const DustSuccess = ({
	onBack,
	router,
	icons: ICONS,
	coins,
	conversion,
	data = { value: 7.2 },
}) => {
	const { increment_unit, display_name } =
		coins[conversion] || DEFAULT_COIN_DATA;

	return (
		<div className="dust-dialog-content">
			<IconTitle
				stringId="DUST.SUCCESSFUL.TITLE"
				iconId="DUST_SUCCESSFUL"
				iconPath={ICONS['DUST_SUCCESSFUL']}
				text={STRINGS['DUST.SUCCESSFUL.TITLE']}
				underline={true}
				className="w-100"
			/>

			<div className="d-flex justify-content-center secondary-text pt-4 pb-3">
				<EditWrapper stringId="DUST.SUCCESSFUL.TEXT">
					{STRINGS['DUST.SUCCESSFUL.TEXT']}
				</EditWrapper>
				:
			</div>

			<div className="d-flex justify-content-center large-font bold">
				<EditWrapper stringId="DUST.SUCCESSFUL.TEXT">
					{STRINGS.formatString(
						CURRENCY_PRICE_FORMAT,
						formatCurrencyByIncrementalUnit(data.value, increment_unit),
						display_name
					)}
				</EditWrapper>
			</div>

			<div className="d-flex mt-4 pt-3">
				<div className="w-50">
					<EditWrapper stringId="DUST.SUCCESSFUL.CLOSE" />
					<Button label={STRINGS['DUST.SUCCESSFUL.CLOSE']} onClick={onBack} />
				</div>
				<div className="separator" />
				<div className="w-50">
					<EditWrapper stringId="DUST.SUCCESSFUL.VIEW_HISTORY" />
					<Button
						label={STRINGS['DUST.SUCCESSFUL.VIEW_HISTORY']}
						onClick={() => router.push('/transactions?tab=0')}
					/>
				</div>
			</div>
		</div>
	);
};

export default withConfig(withRouter(DustSuccess));
