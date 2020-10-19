import React from 'react';
import { isMobile } from 'react-device-detect';
import { TABLE_PAGE_SIZE } from './constants';
import {
	ActionNotification,
	Table,
	// CsvDownload,
	Loader
} from '../../components';

import STRINGS from '../../config/localizedStrings';
import { EditWrapper } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';

const HistoryDisplay = (props) => {
	const {
		stringId,
		title,
		headers,
		data: { data, count, loading },
		// filename,
		withIcon,
		handleNext,
		jumpToPage,
		handleDownload,
		icons: ICONS,
	} = props;

	return (
		<div className="history_block-wrapper">
			{!isMobile && (
				<div className="title text-capitalize">
					<EditWrapper stringId={stringId}>
            {title}
					</EditWrapper>
					{count > 0 && (
						<ActionNotification
							stringId="TRANSACTION_HISTORY.TEXT_DOWNLOAD"
							text={STRINGS["TRANSACTION_HISTORY.TEXT_DOWNLOAD"]}
							iconId="DATA"
							iconPath={ICONS["DATA"]}
							className="csv-action"
							onClick={handleDownload}
						/>
					)}
				</div>
			)}
			{loading ? (
				<Loader />
			) : (
				<Table
					data={data}
					count={count}
					headers={headers}
					withIcon={withIcon}
					pageSize={TABLE_PAGE_SIZE}
					rowKey={(data) => {
						return data.id;
					}}
					title={title}
					handleNext={handleNext}
					jumpToPage={jumpToPage}
				/>
			)}
		</div>
	);
};

export default withConfig(HistoryDisplay);
