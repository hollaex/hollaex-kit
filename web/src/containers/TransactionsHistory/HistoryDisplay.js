import React from 'react';
import { isMobile } from 'react-device-detect';
import { TABLE_PAGE_SIZE } from './constants';
import { ICONS } from '../../config/constants';
import {
	ActionNotification,
	Table,
	// CsvDownload,
	Loader
} from '../../components';

import STRINGS from '../../config/localizedStrings';

const HistoryDisplay = (props) => {
	const {
		title,
		headers,
		data: { data, count, loading },
		// filename,
		withIcon,
		handleNext,
		jumpToPage,
		handleDownload
	} = props;

	return (
		<div className="history_block-wrapper">
			{!isMobile && (
				<div className="title text-capitalize">
					{title}
					{count > 0 && (
						<ActionNotification
							text={STRINGS["TRANSACTION_HISTORY.TEXT_DOWNLOAD"]}
							iconPath={ICONS.DATA}
							useSvg={true}
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

export default HistoryDisplay;
