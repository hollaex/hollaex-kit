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

import STRINGS from '../../config/localizedStrings';
import { EditWrapper } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';
import { STATIC_ICONS } from 'config/icons';
import { searchUserDeposits } from 'actions/walletActions';
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
		setDeposit = () => {},
		setDepositStatusPage = () => {},
	} = props;

	const [dialogIsOpen, setDialogOpen] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [message, setMessage] = useState('');

	const requestDeposit = (params = {}) => {
		setLoading(true);
		searchUserDeposits(params)
			.then((res) => {
				setLoading(false);
				if (res.data.data.length === 0) {
					setMessage(STRINGS['DEPOSIT_STATUS.SEARCH_ERROR']);
				} else if (res && res.data && res.data.data && res.data.data.length) {
					let statusTempData = res.data.data[0];
					setDeposit({ ...statusTempData, is_new: true });
					setDepositStatusPage(statusTempData.transaction_id);
					setMessage(STRINGS['DEPOSIT_STATUS.SEARCH_SUCCESS']);
				}
			})
			.catch((err) => {
				setLoading(false);
			});
	};

	const handleSearch = (values) => {
		if (values && values.transaction_id) {
			const filterData = data.filter(
				(item) => item.transaction_id === values.transaction_id
			);
			if (filterData.length !== 0) {
				setDepositStatusPage(values.transaction_id);
				setMessage(STRINGS['DEPOSIT_STATUS.SEARCH_SUCCESS']);
			} else {
				requestDeposit(values);
			}
		}
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
					requestDeposit={requestDeposit}
					isLoading={isLoading}
					message={message}
					successMsg={STRINGS['DEPOSIT_STATUS.SEARCH_SUCCESS']}
					error={STRINGS['DEPOSIT_STATUS.SEARCH_ERROR']}
					handleSearch={handleSearch}
					props={props}
				/>
			</Dialog>
		</div>
	);
};

export default withConfig(HistoryDisplay);
