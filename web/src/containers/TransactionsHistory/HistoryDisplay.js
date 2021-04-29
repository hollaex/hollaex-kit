import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { TABLE_PAGE_SIZE } from './constants';
import {
	ActionNotification,
	Table,
	// CsvDownload,
	Loader,
	Dialog,
} from '../../components';
import classnames from 'classnames';
import { SubmissionError } from 'redux-form';

import STRINGS from '../../config/localizedStrings';
import { EditWrapper } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';
import { STATIC_ICONS } from 'config/icons';
import { searchTransaction } from 'actions/walletActions';
import CheckDeposit from '../../components/CheckDeposit';

const HistoryDisplay = (props) => {
	const {
		stringId,
		title,
		headers,
		filters,
		data: { data, count, loading },
		// filename,
		withIcon,
		handleNext,
		jumpToPage,
		handleDownload,
		icons: ICONS,
		activeTab,
	} = props;

	const [dialogIsOpen, setDialogOpen] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [statusMessage, setMessage] = useState('');
	const [initialValue, setInitialValues] = useState({});

	const requestDeposit = (params = {}) => {
		setLoading(true);
		setInitialValues(params);
		setMessage('');
		return searchTransaction(params)
			.then((res) => {
				setLoading(false);
				if (res) {
					setMessage(STRINGS['DEPOSIT_STATUS.SEARCH_SUCCESS']);
				}
			})
			.catch((err) => {
				let _error = err && err.data ? err.data.message : err.message;
				setLoading(false);
				throw new SubmissionError({ _error });
			});
	};

	const openDialog = () => {
		setDialogOpen(true);
	};

	const onCloseDialog = () => {
		setDialogOpen(false);
		setMessage('');
	};

	return (
		<div className="history_block-wrapper">
			{!isMobile && (
				<div className="title text-capitalize">
					<EditWrapper stringId={stringId}>{title}</EditWrapper>
					{count > 0 && (
						<ActionNotification
							stringId="TRANSACTION_HISTORY.TEXT_DOWNLOAD"
							text={STRINGS['TRANSACTION_HISTORY.TEXT_DOWNLOAD']}
							iconId="DATA"
							iconPath={ICONS['DATA']}
							className="csv-action"
							onClick={handleDownload}
						/>
					)}
					{activeTab === 2 ? (
						<ActionNotification
							stringId="DEPOSIT_STATUS.CHECK_DEPOSIT_STATUS"
							text={STRINGS['DEPOSIT_STATUS.CHECK_DEPOSIT_STATUS']}
							iconId="SEARCH"
							iconPath={STATIC_ICONS.SEARCH}
							className={count > 0 ? 'check-deposit-txt' : ''}
							onClick={openDialog}
						/>
					) : null}
				</div>
			)}
			{filters}
			{loading ? (
				<Loader />
			) : (
				<Table
					className="transactions-history-table"
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
			<Dialog
				isOpen={dialogIsOpen}
				label="check-deposit-modal"
				className={classnames('app-dialog', 'app-dialog-flex')}
				onCloseDialog={onCloseDialog}
				shouldCloseOnOverlayClick={false}
				style={{ 'z-index': 100 }}
			>
				<CheckDeposit
					onCloseDialog={onCloseDialog}
					onSubmit={requestDeposit}
					message={statusMessage}
					isLoading={isLoading}
					initialValues={initialValue}
					props={props}
				/>
			</Dialog>
		</div>
	);
};

export default withConfig(HistoryDisplay);
