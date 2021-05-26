import React from 'react';
import IconTitle from '../IconTitle';
import Button from '../Button';
import STRINGS from '../../config/localizedStrings';
import { EditWrapper } from 'components';

const StakeToken = ({ onBack, icons: ICONS }) => {
	return (
		<div className="invite_friends_wrapper">
			<IconTitle
				stringId="STAKE_TOKEN.TITLE"
				text={STRINGS['STAKE_TOKEN.TITLE']}
				iconId="STAKETOKEN_ICON"
				iconPath={ICONS['STAKETOKEN_ICON']}
				textType="title"
				underline={true}
			/>
			<div>
				<div className="my-2 stake_txt">
					<div className="mt-3">
						<EditWrapper stringId="STAKE_TOKEN.INFO_TXT1">
							{STRINGS['STAKE_TOKEN.INFO_TXT1']}
						</EditWrapper>
					</div>
					<div className="mt-3">
						<EditWrapper stringId="STAKE_TOKEN.INFO_TXT2">
							{STRINGS['STAKE_TOKEN.INFO_TXT2']}
						</EditWrapper>
					</div>
					<div className="mt-3">
						<EditWrapper stringId="STAKE_TOKEN.INFO_TXT3">
							{STRINGS['STAKE_TOKEN.INFO_TXT3']}
						</EditWrapper>
					</div>
				</div>
				<div className="d-flex my-5 mt-5">
					<Button
						label={STRINGS['BACK_TEXT']}
						className="mr-5"
						onClick={onBack}
					/>
					<a
						className="holla-button mdc-button mdc-button--unelevated holla-button-font"
						href="https://info.hollaex.com/hc/en-us/articles/360040097453-How-can-I-stake-collateralize-HollaEx-Token-XHT"
						target="blank"
					>
						<Button
							label={STRINGS['STAKE_TOKEN.BUTTON_TXT']}
							onClick={() => {}}
						/>
					</a>
				</div>
			</div>
		</div>
	);
};

export default StakeToken;
