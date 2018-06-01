import React from 'react';

import { TABLE_PAGE_SIZE } from './constants';
import { ICONS } from '../../config/constants';
import {
	ActionNotification,
	Table,
	CsvDownload,
	Loader
} from '../../components';

import STRINGS from '../../config/localizedStrings';

const HistoryDisplay = (props) => {
	const { title, headers, data: { data, count, loading }, filename } = props;

	return (
		<div className="history_block-wrapper">
			<div className="title text-capitalize">
				{title}
				{count > 0 && (
					<CsvDownload data={data} headers={headers} filename={filename}>
						<ActionNotification
							text={STRINGS.TRANSACTION_HISTORY.TEXT_DOWNLOAD}
							iconPath={ICONS.DATA}
							useSvg={true}
							className="csv-action"
						/>
					</CsvDownload>
				)}
			</div>
			{loading ? (
				<Loader />
			) : (
				<Table
					data={data}
					count={count}
					headers={headers}
					withIcon={true}
					pageSize={TABLE_PAGE_SIZE}
					title={title}
				/>
			)}
		</div>
	);
};

export default HistoryDisplay;
