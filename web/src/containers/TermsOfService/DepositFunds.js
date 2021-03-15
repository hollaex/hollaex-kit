import React from 'react';
import { ReactSVG } from 'react-svg';

import { IconTitle, BlueLink, Button } from '../../components';
import STRINGS from '../../config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const DepositFunds = (props) => {
	const { icons: ICONS } = props;
	return (
		<div className="deposit_funds-wrapper m-auto">
			<IconTitle
				iconId="XHT_COIN_STACK"
				iconPath={ICONS['XHT_COIN_STACK']}
				stringId="TERMS_OF_SERVICES.DEPOSIT_FUNDS"
				text={STRINGS['TERMS_OF_SERVICES.DEPOSIT_FUNDS']}
				textType="title"
				underline={true}
				className="w-100"
			/>
			<div className="mx-3">
				<div className="d-flex align-items-center my-4">
					<ReactSVG src={ICONS['XHT_FAQ']} className="funds-svg" />
					<div className="ml-2 font-weight-bold">
						{STRINGS.formatString(
							STRINGS['TERMS_OF_SERVICES.READ_FAG'],
							<BlueLink
								href="https://hollaex.com/docs/faq.html"
								text={'https://hollaex.com/docs/faq.html'}
							/>
						)}
					</div>
				</div>
				<div className="d-flex align-items-center my-4">
					<ReactSVG src={ICONS['XHT_DOCS']} className="funds-svg" />
					<div className="ml-2 font-weight-bold">
						{STRINGS.formatString(
							STRINGS['TERMS_OF_SERVICES.READ_DOCUMENTATION'],
							<BlueLink
								href="https://hollaex.com/docs/whitepaper.html"
								text={'https://hollaex.com/docs/whitepaper.html'}
							/>
						)}
					</div>
				</div>
				<div className="d-flex align-items-center my-4">
					<ReactSVG src={ICONS['XHT_PDF']} className="funds-svg" />
					<div className="ml-2 font-weight-bold">
						{STRINGS.formatString(
							STRINGS['TERMS_OF_SERVICES.DOWNLOAD_BUY_XHT'],
							<BlueLink
								href="https://hollaex.com/docs/guideline.pdf"
								text={STRINGS['TERMS_OF_SERVICES.HOW_TO_BUY']}
							/>
						)}
					</div>
				</div>
				<div className="d-flex align-items-center my-4">
					<ReactSVG src={ICONS['XHT_EMAIL']} className="funds-svg" />
					<div className="ml-2 font-weight-bold">
						{STRINGS.formatString(
							STRINGS['TERMS_OF_SERVICES.CONTACT_US'],
							<BlueLink
								href="mailto:support@hollaex.com"
								text={'support@hollaex.com'}
							/>
						)}
					</div>
				</div>
			</div>
			<Button
				label={STRINGS['USER_VERIFICATION.GOTO_WALLET'].toUpperCase()}
				onClick={props.gotoWallet}
			/>
		</div>
	);
};

export default withConfig(DepositFunds);
