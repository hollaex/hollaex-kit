import React from 'react';
import { EditWrapper, IconTitle, Image } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const ConnectViaDesktop = ({ icons: ICONS }) => {
	return (
		<div className="connectViaDesktop_wrapper">
			<IconTitle
				stringId="CONNECT_VIA_DESKTOP.TITLE"
				text={STRINGS['CONNECT_VIA_DESKTOP.TITLE']}
				textType="title"
				underline={false}
				className="w-100 holla-logo"
				subtitle={STRINGS['CONNECT_VIA_DESKTOP.SUBTITLE']}
			/>
			<Image
				iconId="CONNECT_DESKTOP"
				icon={ICONS['CONNECT_DESKTOP']}
				wrapperClassName="connect_desktop_img"
			/>
			<div className="connect_desktop_footer">
				<EditWrapper stringId="CONNECT_VIA_DESKTOP.TEXT">
					{STRINGS['CONNECT_VIA_DESKTOP.TEXT']}
				</EditWrapper>
			</div>
		</div>
	);
};

export default withConfig(ConnectViaDesktop);
