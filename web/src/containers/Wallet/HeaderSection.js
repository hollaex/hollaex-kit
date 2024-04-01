import React from 'react';
import { Link } from 'react-router';
import { EditWrapper, Image } from 'components';
import STRINGS from 'config/localizedStrings';

const HeaderSection = ({ icons: ICONS }) => {
	return (
		<div className="header-wrapper">
			<div className="header-title">
				<EditWrapper stringId="ACCORDIAN.ACCORDIAN_ASSETS">
					{STRINGS['ACCORDIAN.ACCORDIAN_ASSETS']}
				</EditWrapper>
			</div>
			<div className="sub-header link-separator">
				<Link to="assets">
					<EditWrapper stringId="ACCORDIAN.ACCORDIAN_INFO">
						{STRINGS['ACCORDIAN.ACCORDIAN_INFO']}
					</EditWrapper>
				</Link>
			</div>
			<div className="d-flex">
				<div className="sub-header">
					<Link to="transactions">
						<EditWrapper stringId="ACCORDIAN.ACCORDIAN_HISTORY">
							{STRINGS['ACCORDIAN.ACCORDIAN_HISTORY']}
						</EditWrapper>
					</Link>
				</div>
				<div className="image-Wrapper">
					<Image
						iconId={'CLOCK'}
						icon={ICONS['CLOCK']}
						alt={'text'}
						svgWrapperClassName="action_notification-svg"
					/>
				</div>
			</div>
		</div>
	);
};

export default HeaderSection;
