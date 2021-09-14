import React from 'react';
import { Input } from 'antd';
import { EditWrapper, Button, IconTitle } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const AmountContent = ({ tokenData, onBack, onNext, amount, setAmount }) => {
	const { symbol, fullname, available } = tokenData;
	// const iconId = `${symbol.toUpperCase()}_ICON`;
	return (
		<div>
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
			<div>
				<EditWrapper stringId="STAKE.AVAILABLE_TOKEN">
					{STRINGS.formatString(
						STRINGS['STAKE.AVAILABLE_TOKEN'],
						fullname,
						symbol.toUpperCase(),
						available
					)}
				</EditWrapper>
			</div>
			<div>Amount to stake</div>
			<Input
				className="stake-amount-input"
				type="number"
				value={amount}
				onChange={setAmount}
			/>
			<div className="d-flex">
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
	);
};

export default withConfig(AmountContent);
