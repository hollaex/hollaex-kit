import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { browserHistory } from 'react-router';
import { TABLE_PAGE_SIZE } from './constants';
import {
	ActionNotification,
	Table,
	// CsvDownload,
	Loader,
	Dialog,
	EditWrapper,
} from 'components';
import classnames from 'classnames';
import { SubmissionError } from 'redux-form';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { STATIC_ICONS } from 'config/icons';
import { searchTransaction } from 'actions/walletActions';
import CheckDeposit from 'components/CheckDeposit';

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
		refetchData,
		icons: ICONS,
		activeTab,
		rowKey,
		expandableRow,
		expandableContent,
		isFromWallet,
		onHandleView = () => {},
		isDepositFromWallet,
	} = props;

	const [dialogIsOpen, setDialogOpen] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [statusMessage, setMessage] = useState('');
	const [initialValue, setInitialValues] = useState({});

	const requestDeposit = (params = {}) => {
		setLoading(true);
		setInitialValues(params);
		setMessage('');
		const address = params.address.trim();

		return searchTransaction({
			...params,
			address: params.destination_tag
				? `${address}:${params.destination_tag}`
				: address,
			network: params.network ? params.network : params.currency,
		})
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
		setInitialValues({});
	};

	return (
		<div className="history_block-wrapper">
			{!loading && (
				<div className="d-flex justify-content-between title text-capitalize">
					<div className="history-title">
						<EditWrapper stringId={stringId}>{title}</EditWrapper>
					</div>
					<div className="action_notification-container">
						{!isMobile && !isFromWallet && activeTab === 3 && (
							<ActionNotification
								stringId="REFRESH"
								text={STRINGS['ACCORDIAN.WITHDRAW']}
								className="blue-icon"
								onClick={() => browserHistory.push('wallet/withdraw')}
							/>
						)}
						{!isMobile && activeTab !== 3 && !isDepositFromWallet && (
							<ActionNotification
								stringId="ACCORDIAN.DEPOSIT"
								text={STRINGS['ACCORDIAN.DEPOSIT']}
								className="blue-icon"
								onClick={() => browserHistory.push('wallet/deposit')}
							/>
						)}
						{!isMobile && (
							<ActionNotification
								stringId="ACCORDIAN.VOLUME"
								text={STRINGS['ACCORDIAN.VOLUME']}
								className="blue-icon"
								onClick={() => browserHistory.push('wallet/volume')}
							/>
						)}
						{!isMobile && count > 0 && !isFromWallet && (
							<ActionNotification
								stringId="TRANSACTION_HISTORY.TEXT_DOWNLOAD"
								text={STRINGS['TRANSACTION_HISTORY.TEXT_DOWNLOAD']}
								iconId="DATA"
								iconPath={ICONS['DATA']}
								className="blue-icon"
								onClick={handleDownload}
							/>
						)}
						{activeTab === 2 && !isDepositFromWallet && (
							<ActionNotification
								stringId="DEPOSIT_STATUS.CHECK_DEPOSIT_STATUS"
								text={STRINGS['DEPOSIT_STATUS.CHECK_DEPOSIT_STATUS']}
								iconId="SEARCH"
								iconPath={STATIC_ICONS.SEARCH}
								className="blue-icon"
								onClick={openDialog}
							/>
						)}
						{!isFromWallet && (!isMobile || activeTab === 2) && (
							<ActionNotification
								stringId="REFRESH"
								text={STRINGS['REFRESH']}
								iconId="REFRESH"
								iconPath={STATIC_ICONS['REFRESH']}
								className="blue-icon"
								onClick={refetchData}
							/>
						)}
						{isFromWallet && (
							<ActionNotification
								stringId="HOLLAEX_TOKEN.VIEW"
								text={STRINGS['HOLLAEX_TOKEN.VIEW']}
								iconId="HOLLAEX_TOKEN.VIEW"
								iconPath={STATIC_ICONS['HOLLAEX_TOKEN.VIEW']}
								className="blue-icon"
								onClick={onHandleView}
								isFromWallet={isFromWallet}
							/>
						)}
					</div>
				</div>
			)}
			{!isFromWallet && filters}
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
					rowKey={rowKey}
					title={title}
					handleNext={handleNext}
					jumpToPage={jumpToPage}
					noData={props.noData}
					expandable={expandableRow && expandableContent()}
					displayPaginator={!isFromWallet}
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
				{dialogIsOpen && (
					<CheckDeposit
						onCloseDialog={onCloseDialog}
						onSubmit={requestDeposit}
						message={statusMessage}
						isLoading={isLoading}
						initialValues={initialValue}
						props={props}
					/>
				)}
			</Dialog>
		</div>
	);
};

export default withConfig(HistoryDisplay);
