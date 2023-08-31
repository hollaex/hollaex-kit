import React, { useEffect, useState, useCallback } from 'react';
import moment from 'moment';
import { isMobile } from 'react-device-detect';
import {
	Table,
	Loader,
	HeaderSection,
	EditWrapper,
	ActionNotification,
} from 'components';
import LoginData from './LoginData';
import LoginFilters from './LoginFilters';
import STRINGS from 'config/localizedStrings';
import { getLogins, downloadLogins } from 'actions/userAction';
import { generateHeaders } from './LoginHeaders';
import withConfig from 'components/ConfigProvider/withConfig';
import { STATIC_ICONS } from 'config/icons';

const INITIAL_LOGINS_STATE = {
	count: 0,
	data: [],
	page: 1,
	isRemaining: false,
	title: '',
};
const RECORD_LIMIT = 20;

const Logins = ({ icons: ICONS }) => {
	const [logins, setLogins] = useState(INITIAL_LOGINS_STATE);
	const [fetching, setFetching] = useState(false);
	const [params, setParams] = useState({});
	const [jumpToPage, setJumpToPage] = useState(0);

	const requestLogins = useCallback((page = 1, params) => {
		setFetching(true);
		getLogins({ page, limit: RECORD_LIMIT, ...params })
			.then(({ data: { count, data } }) => {
				setLogins((prevLogins) => ({
					count,
					data: prevLogins.data.concat(data),
					page,
					isRemaining: count > page * RECORD_LIMIT,
					title: `login-attempts-table-${JSON.stringify(params)}`,
				}));
				setFetching(false);
			})
			.catch(() => {
				setFetching(false);
			});
	}, []);

	useEffect(() => {
		setJumpToPage(0);
		setLogins(INITIAL_LOGINS_STATE);
		requestLogins(1, params);
	}, [requestLogins, params]);

	const refresh = () => {
		setParams({ ...params });
	};

	const handleNext = (pageCount, pageNumber) => {
		const pageTemp = pageNumber % 2 === 0 ? 2 : 1;
		const apiPageTemp = Math.floor((pageNumber + 1) / 2);

		if (
			RECORD_LIMIT === pageCount * pageTemp &&
			apiPageTemp >= logins.page &&
			logins.isRemaining
		) {
			requestLogins(logins.page + 1, params);
			setJumpToPage(pageNumber);
		}
	};

	const onSearch = useCallback(({ range, ...rest }) => {
		const [startDate, endDate] = range || [];
		const start_date = startDate ? moment.utc(startDate).format() : undefined;
		const end_date = endDate ? moment.utc(endDate).format() : undefined;
		setParams({
			start_date,
			end_date,
			...rest,
		});
	}, []);

	return (
		<div className="mt-4 mb-4 apply_rtl dev-section-wrapper login-history-section-wrapper">
			<HeaderSection
				stringId="LOGINS_HISTORY.CONTENT.TITLE"
				title={STRINGS['LOGINS_HISTORY.CONTENT.TITLE']}
				notification={
					<div className="action_notification-container">
						{!isMobile && (
							<ActionNotification
								stringId="LOGINS_HISTORY.CONTENT.DOWNLOAD_HISTORY"
								text={STRINGS['LOGINS_HISTORY.CONTENT.DOWNLOAD_HISTORY']}
								iconId="DATA"
								iconPath={ICONS['DATA']}
								className="blue-icon"
								onClick={() => downloadLogins(params)}
								disable={fetching || logins.count <= 0}
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
					<EditWrapper stringId="LOGINS_HISTORY.CONTENT.SUBTITLE">
						{STRINGS['LOGINS_HISTORY.CONTENT.SUBTITLE']}
					</EditWrapper>
				</div>
			</HeaderSection>
			<LoginFilters onSearch={onSearch} formName="login-attempts" />
			<div>
				<Table
					title={logins.title}
					rowClassName="pt-2 pb-2"
					showHeaderNoData={true}
					headers={generateHeaders()}
					data={logins.data}
					rowKey={(data) => {
						return data.timestamp;
					}}
					count={logins.count}
					expandable={{
						rowExpandable: () => true,
						defaultExpanded: () => false,
						expandedRowRender: (record) => <LoginData {...record} />,
					}}
					handleNext={handleNext}
					pageSize={RECORD_LIMIT / 2}
					displayPaginator={!fetching}
					noData={fetching && <Loader relative={true} background={false} />}
					jumpToPage={jumpToPage}
				/>
				{fetching && !!logins.count && (
					<Loader relative={true} background={false} />
				)}
			</div>
		</div>
	);
};

export default withConfig(Logins);
