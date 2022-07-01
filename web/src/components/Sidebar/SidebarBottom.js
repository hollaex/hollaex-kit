import React from 'react';
import classnames from 'classnames';
import STRINGS from 'config/localizedStrings';
import { ButtonLink, Image } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';

const SidebarButton = ({
	title = '',
	iconPath = '',
	active = false,
	onClick,
}) => {
	return (
		<div
			onClick={onClick}
			className={classnames('sidebar-bottom-button', { active })}
		>
			<Image icon={iconPath} wrapperClassName="sidebar-bottom-icon" />
			<div
				className={
					active ? 'bottom-text-acttive bottom-bar-text' : 'bottom-bar-text'
				}
			>
				{title}
			</div>
		</div>
	);
};

const ButtonsSection = () => (
	<div className="d-flex w-100 p-4">
		<div className="w-50">
			<ButtonLink
				link={'/signup'}
				type="button"
				label={STRINGS['SIGNUP_TEXT']}
			/>
		</div>
		<div className="separator" />
		<div className="w-50">
			<ButtonLink link={'/login'} type="button" label={STRINGS['LOGIN_TEXT']} />
		</div>
	</div>
);

const SidebarBottom = ({
	menuItems,
	activePath,
	isLogged,
	icons: ICONS = {},
	onMenuChange,
}) => {
	return isLogged ? (
		<div className="sidebar-bottom-wrapper d-flex">
			{menuItems.map(
				(
					{ path, icon_id, string_id, hide_from_bottom_nav, activePaths },
					index
				) => {
					return (
						!hide_from_bottom_nav && (
							<SidebarButton
								key={`bottom_nav_item_${index}`}
								path={path}
								title={STRINGS[string_id]}
								iconPath={ICONS[icon_id]}
								active={
									activePaths
										? activePaths.includes(activePath)
										: path === activePath
								}
								onClick={() => onMenuChange(path)}
							/>
						)
					);
				}
			)}
		</div>
	) : (
		<ButtonsSection />
	);
};

export default withConfig(SidebarBottom);
