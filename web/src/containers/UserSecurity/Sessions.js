import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import { setNotification, setSnackNotification } from 'actions/appActions';
import {
	Table,
	Loader,
	HeaderSection,
	EditWrapper,
	Dialog,
	Button,
	IconTitle,
	ActionNotification,
} from 'components';
import SessionData from './SessionData';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import {
	revokeSession,
	getSessions,
	downloadSessions,
} from 'actions/userAction';
import { NOTIFICATIONS } from 'actions/appActions';
import { generateHeaders } from './SessionHeaders';
import { STATIC_ICONS } from 'config/icons';

const INITIAL_SESSIONS_STATE = {
	count: 0,
	data: [],
	page: 1,
	isRemaining: false,
};
const RECORD_LIMIT = 20;

const Sessions = ({ icons: ICONS, setSnackNotification, setNotification }) => {
	const [sessions, setSessions] = useState(INITIAL_SESSIONS_STATE);
	const [fetching, setFetching] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [sessionId, setSessionId] = useState();
	const [pending, setPending] = useState(false);

	const closeModal = () => {
		setIsOpen(false);
		setSessionId();
	};

	const onError = (err) => {
		closeModal();
		const message =
			err.response && err.response.data && err.response.data.message
				? err.response.data.message
				: err.message || JSON.stringify(err);
		setNotification(NOTIFICATIONS.ERROR, message);
	};

	const onClickRevokeSession = (sessionId) => {
		setSessionId(sessionId);
		setIsOpen(true);
	};

	const onRevokeSession = () => {
		setPending(true);
		return revokeSession(sessionId)
			.then(({ data: { id: removedId } }) => {
				setSessions(({ count, data, page, isRemaining }) => ({
					count: count - 1,
					data: data.filter(({ id }) => id !== removedId),
					page,
					isRemaining: count - 1 > page * RECORD_LIMIT,
				}));
				closeModal();
				setSnackNotification({
					icon: ICONS.COPY_NOTIFICATION,
					content: STRINGS['SESSIONS.CONTENT.NOTIFICATION'],
				});
			})
			.catch(onError)
			.finally(() => {
				setPending();
				setSessionId();
			});
	};

	const requestSessions = useCallback((page = 1, limit = RECORD_LIMIT) => {
		setFetching(true);
		getSessions({ page, limit })
			.then(({ data: { count, data } }) => {
				setSessions((prevSessions) => ({
					count,
					data: prevSessions.data.concat(data),
					page,
					isRemaining: count > page * limit,
				}));
				setFetching(false);
			})
			.catch(() => {
				setFetching(false);
			});
	}, []);

	useEffect(() => {
		requestSessions();
	}, [requestSessions]);

	const refresh = () => {
		setSessions(INITIAL_SESSIONS_STATE);
		requestSessions();
	};

	const handleNext = (pageCount, pageNumber) => {
		const pageTemp = pageNumber % 2 === 0 ? 2 : 1;
		const apiPageTemp = Math.floor((pageNumber + 1) / 2);

		if (
			RECORD_LIMIT === pageCount * pageTemp &&
			apiPageTemp >= sessions.page &&
			sessions.isRemaining
		) {
			requestSessions(sessions.page + 1, RECORD_LIMIT);
		}
	};

	return (
		<div className="mt-4 mb-4 apply_rtl dev-section-wrapper login-history-section-wrapper">
			<HeaderSection
				stringId="SESSIONS.CONTENT.TITLE"
				title={STRINGS['SESSIONS.CONTENT.TITLE']}
				notification={
					<div className="action_notification-container">
						{!isMobile && (
							<ActionNotification
								stringId="SESSIONS.CONTENT.DOWNLOAD"
								text={STRINGS['SESSIONS.CONTENT.DOWNLOAD']}
								iconId="DATA"
								iconPath={ICONS['DATA']}
								className="blue-icon"
								onClick={downloadSessions}
								disable={fetching || sessions.count <= 0}
							/>
						)}
						<ActionNotification
							stringId="REFRESH"
							text={STRINGS['REFRESH']}
							iconId="REFRESH"
							iconPath={STATIC_ICONS['REFRESH']}
							className="blue-icon"
							onClick={refresh}
							disable={fetching}
						/>
					</div>
				}
			>
				<div className="header-content">
					<EditWrapper stringId="SESSIONS.CONTENT.SUBTITLE.TEXT,SESSIONS.CONTENT.SUBTITLE.LINK">
						{STRINGS.formatString(
							STRINGS['SESSIONS.CONTENT.SUBTITLE.TEXT'],
							<span>
								"
								<span className="underline-text">
									{STRINGS['SESSIONS.CONTENT.SUBTITLE.LINK']}
								</span>
								"
							</span>
						)}
					</EditWrapper>
				</div>
			</HeaderSection>

			<div>
				<Table
					rowClassName="pt-2 pb-2"
					headers={generateHeaders(onClickRevokeSession)}
					showHeaderNoData={true}
					data={sessions.data}
					rowKey={(data) => {
						return data.id;
					}}
					count={sessions.count}
					expandable={{
						rowExpandable: () => true,
						defaultExpanded: () => false,
						expandedRowRender: (record) => <SessionData {...record} />,
					}}
					handleNext={handleNext}
					pageSize={RECORD_LIMIT / 2}
					displayPaginator={!fetching}
					noData={fetching && <Loader relative={true} background={false} />}
				/>
				{fetching && !!sessions.count && (
					<Loader relative={true} background={false} />
				)}
			</div>

			<Dialog isOpen={isOpen} label="session-modal" onCloseDialog={closeModal}>
				<div className="session-dialog-content margin-auto">
					<IconTitle
						iconId="REVOKE_SESSION"
						iconPath={ICONS['REVOKE_SESSION']}
						stringId="SESSIONS.CONTENT.MODAL.TITLE,SESSIONS.CONTENT.MODAL.PROMPT"
						text={STRINGS['SESSIONS.CONTENT.MODAL.TITLE']}
						subtitle={STRINGS['SESSIONS.CONTENT.MODAL.PROMPT']}
						textType="title"
						className="w-100 pb-3"
					/>
					<div className="d-flex mt-4 pt-4">
						<div className="w-50">
							<EditWrapper stringId="SESSIONS.CONTENT.MODAL.BACK" />
							<Button
								label={STRINGS['SESSIONS.CONTENT.MODAL.BACK']}
								onClick={closeModal}
							/>
						</div>
						<div className="separator" />
						<div className="w-50">
							<EditWrapper stringId="SESSIONS.CONTENT.MODAL.CONFIRM" />
							<Button
								label={STRINGS['SESSIONS.CONTENT.MODAL.CONFIRM']}
								onClick={onRevokeSession}
								disabled={pending}
							/>
						</div>
					</div>
				</div>
			</Dialog>
		</div>
	);
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
	setSnackNotification: bindActionCreators(setSnackNotification, dispatch),
	setNotification: bindActionCreators(setNotification, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(Sessions));
