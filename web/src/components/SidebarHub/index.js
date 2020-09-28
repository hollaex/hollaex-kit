import React, { Component } from 'react';
import classnames from 'classnames';
import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import { IconTitle, Accordion } from '../../components';

import { ButtonLink, Wallet } from '../';

class SidebarHub extends Component {
	render() {
		const { activePath, isLogged, theme } = this.props;
		const values = [{
			accordionClassName: 'sidebar_hub-section-content f-1',
			title: STRINGS["WALLET_TITLE"],
			icon: ICONS.SIDEBAR_WALLET_ACTIVE,
			content: <Wallet />
		}];
		return (
			<div
				className={classnames(
					'd-flex flex-column sidebar_hub-wrapper',
					`active-${activePath}`
				)}
			>
				<div className="d-flex sidebar_hub-content d-flex flex-column">
					{isLogged ? (
						<div>
							<Accordion sections={values} />
						</div>
					) : (
						<div>
							<IconTitle
								iconPath={
									theme === 'white'
										? ICONS.DEMO_LOGIN_ICON_LIGHT
										: ICONS.DEMO_LOGIN_ICON_DARK
								}
								textType="title"
								className="w-100"
								useSvg={true}
							/>

							<ButtonLink
								label={STRINGS["SIGN_IN"].toUpperCase()}
								className={'log_in-btn'}
								disabled={isLogged}
								link={`/login`}
							/>
							<div className="text-center mt-3 mb-3">{STRINGS["OR_TEXT"]}</div>

							<ButtonLink
								label={STRINGS["SIGNUP_TEXT"].toUpperCase()}
								className={'sign_up-btn mb-5'}
								disabled={isLogged}
								link={`/signup`}
							/>
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default SidebarHub;
