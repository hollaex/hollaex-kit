import React from 'react';
import { isMobile } from 'react-device-detect';
import { Input } from 'antd';

import classnames from 'classnames';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import icons from 'config/icons/dark';
import { Button, EditWrapper, Image } from 'components';
import { isLoggedIn } from 'utils/token';

const MainSection = ({
	style = {},
	onClickTrade,
	onClickDemo,
	signupEmail,
	setSignupEmail,
	icons: ICONS,
}) => {
	const onHandlenavigate = () => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		onClickDemo();
		if (!emailRegex.test(signupEmail)) {
			setSignupEmail(null);
		}
	};

	return (
		<div className={classnames('section_1-content')} style={style}>
			<div className={classnames('title-description')}>
				<div className="home-title text-capitalize">
					<EditWrapper stringId="HOME.MAIN_TITLE">
						{STRINGS['HOME.MAIN_TITLE']}
					</EditWrapper>
				</div>
				<div className="text-section mt-4">
					<EditWrapper stringId="HOME.MAIN_TEXT">
						{STRINGS['HOME.MAIN_TEXT']}
					</EditWrapper>
				</div>
				{isMobile && (
					<div className="home-page-icon-wrapper">
						<Image
							iconId="HOME_PAGE_TRADE_ICON"
							icon={icons['HOME_PAGE_TRADE_ICON']}
							wrapperClassName="home-page-icon"
						/>
					</div>
				)}
				{!isLoggedIn() ? (
					<div
						className={classnames('buttons-section', 'signup-field-wrapper')}
					>
						<Input
							className="signup-field"
							placeholder={STRINGS['HOME.EMAIL_TEXT']}
							onChange={(e) => setSignupEmail(e.target.value)}
							value={signupEmail}
						/>
						<Button
							label={STRINGS['SIGNUP_TEXT'].toUpperCase()}
							onClick={onHandlenavigate}
							className="signup-btn"
						/>
					</div>
				) : (
					<div
						className={`text-section text-center btn-wrapper ${
							isMobile ? '' : 'w-50'
						}`}
					>
						<EditWrapper stringId="HOME.TRADE_CRYPTO">
							<span
								onClick={onClickTrade}
								className={classnames(
									'main-section_button',
									'no-border',
									'start-trade-btn',
									{
										pointer: onClickTrade,
									}
								)}
							>
								{STRINGS['HOME.TRADE_CRYPTO']}
							</span>
						</EditWrapper>
					</div>
				)}
			</div>
			{!isMobile && (
				<div className="home-page-icon-wrapper">
					<Image
						iconId="HOME_PAGE_TRADE_ICON"
						icon={icons['HOME_PAGE_TRADE_ICON']}
						wrapperClassName="home-page-icon"
					/>
				</div>
			)}
		</div>
	);
};

export default withConfig(MainSection);
