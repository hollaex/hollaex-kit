import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IconTitle, EditWrapper, Button, ActionNotification } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { openHelpdesk } from 'actions/appActions';

const ConfigureApps = ({
	onClose,
	icons: ICONS,
	openHelpdesk,
	onRemove = () => {},
}) => {
	const [showRemove, setShowRemove] = useState(false);
	const openNewForm = () => {
		onClose();
		openHelpdesk({ category: 'bug' });
	};

	return showRemove ? (
		<div className="help-wrapper">
			<IconTitle
				iconId="APPS_REMOVE"
				iconPath={ICONS['APPS_REMOVE']}
				stringId="USER_APPS.REMOVE.TITLE"
				text={STRINGS['USER_APPS.REMOVE.TITLE']}
				textType="title"
				underline={true}
				className="w-100"
				subtitle={STRINGS['USER_APPS.REMOVE.SUBTITLE']}
			/>
			<div>
				<div className="my-5 mx-3">
					<div>
						<EditWrapper stringId="USER_APPS.REMOVE.TEXT">
							{STRINGS['USER_APPS.REMOVE.TEXT']}
						</EditWrapper>
					</div>
				</div>

				<div className="d-flex">
					<div className="w-50">
						<EditWrapper stringId="USER_APPS.REMOVE.BACK" />
						<Button
							label={STRINGS['USER_APPS.REMOVE.BACK']}
							onClick={() => setShowRemove(false)}
						/>
					</div>
					<div className="separator" />
					<div className="w-50">
						<EditWrapper stringId="USER_APPS.REMOVE.CONFIRM" />
						<Button
							label={STRINGS['USER_APPS.REMOVE.CONFIRM']}
							onClick={onRemove}
						/>
					</div>
				</div>
			</div>
		</div>
	) : (
		<div className="help-wrapper">
			<IconTitle
				iconId="APPS_CONFIGURE"
				iconPath={ICONS['APPS_CONFIGURE']}
				stringId="USER_APPS.CONFIGURE.TITLE"
				text={STRINGS['USER_APPS.CONFIGURE.TITLE']}
				textType="title"
				underline={true}
				className="w-100"
				subtitle={STRINGS['USER_APPS.CONFIGURE.SUBTITLE']}
			/>
			<div>
				<div className="my-5 mx-3">
					<ActionNotification
						stringId="USER_APPS.CONFIGURE.REMOVE"
						text={STRINGS['USER_APPS.CONFIGURE.REMOVE']}
						iconId="CANCEL_CROSS_ACTIVE"
						iconPath={ICONS['CANCEL_CROSS_ACTIVE']}
						onClick={() => setShowRemove(true)}
						status="information"
						textPosition="left"
						className="remove-action"
					/>
				</div>

				<div className="my-5 mx-3">
					<div>
						<EditWrapper stringId="USER_APPS.CONFIGURE.TEXT">
							{STRINGS['USER_APPS.CONFIGURE.TEXT']}
						</EditWrapper>
					</div>
				</div>

				<div className="d-flex">
					<div className="w-50">
						<EditWrapper stringId="USER_APPS.CONFIGURE.BACK" />
						<Button
							label={STRINGS['USER_APPS.CONFIGURE.BACK']}
							onClick={onClose}
						/>
					</div>
					<div className="separator" />
					<div className="w-50">
						<EditWrapper stringId="USER_APPS.CONFIGURE.HELP" />
						<Button
							label={STRINGS['USER_APPS.CONFIGURE.HELP']}
							onClick={openNewForm}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
	openHelpdesk: bindActionCreators(openHelpdesk, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(ConfigureApps));
