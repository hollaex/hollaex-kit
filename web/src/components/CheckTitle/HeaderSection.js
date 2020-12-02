import React from 'react';
import Image from 'components/Image';

import STRINGS from '../../config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { ActionNotification } from '../../components';
import { EditWrapper } from 'components';

const HeaderSection = ({
	title,
	children,
	openContactForm,
	icon,
	iconId,
	stringId,
	icons: ICONS,
}) => {
	return (
		<div className="header_title-wrapper d-flex flex-column w-100 f-1">
			<div className="d-flex">
				{!!icon && (
					<div className="mr-2">
						<Image icon={icon} wrapperClassName="header_title-icon" />
					</div>
				)}
				<div>
					<div className="d-flex justify-content-between w-100 f-1">
						<EditWrapper stringId={stringId} iconId={iconId}>
							<div className="header_title-text font-weight-bold">{title}</div>
						</EditWrapper>
						{!!openContactForm && (
							<div className="header_title-action">
								<ActionNotification
									stringId="NEED_HELP_TEXT"
									text={STRINGS['NEED_HELP_TEXT']}
									status="information"
									iconId="BLUE_QUESTION"
									iconPath={ICONS['BLUE_QUESTION']}
									onClick={openContactForm}
								/>
							</div>
						)}
					</div>
					{children && <div className="header_title-children">{children}</div>}
				</div>
			</div>
		</div>
	);
};

export default withConfig(HeaderSection);
