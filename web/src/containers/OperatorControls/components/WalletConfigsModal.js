import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import classnames from 'classnames';
import { MenuOutlined, CloseCircleOutlined } from '@ant-design/icons';
import {
	pinnedAssetsSelector,
	selectAssetOptions,
} from 'containers/Wallet/utils';
import Modal from 'components/Dialog/DesktopDialog';
import { Button, Radio } from 'antd';
import { WALLET_SORT, WALLET_SORT_EXP } from 'actions/appActions';
import { handleUpgrade } from 'utils/utils';
import Coins from 'containers/Admin/Coins';

const { Group } = Radio;

const SortableItem = SortableElement(
	({ asset, order, onRemove, removeDisabled }) => (
		<tr className="sortable_section">
			<td>{order + 1}</td>
			<td>
				<MenuOutlined />
			</td>
			<td>
				<div className="caps">{asset}</div>
			</td>
			<td>
				<div
					onClick={removeDisabled ? () => {} : () => onRemove(asset)}
					className={classnames(
						'underline-text',
						{ pointer: !removeDisabled },
						{ 'secondary-text': removeDisabled }
					)}
				>
					<span>Remove</span>
					<CloseCircleOutlined className="mx-2" />
				</div>
			</td>
		</tr>
	)
);

const SortableList = SortableContainer(
	({ items, onRemove, removeDisabled }) => {
		return (
			<div className="mt-4 pinned-markets-table-wrapper">
				<table className="m-3 pinned-markets-table">
					<thead>
						<tr>
							<th>Order</th>
							<th>Move</th>
							<th>Asset</th>
							<th>Remove</th>
						</tr>
					</thead>
					<tbody>
						{items.map((asset, index) => (
							<SortableItem
								key={`item-${asset}`}
								index={index}
								asset={asset}
								order={index}
								onRemove={onRemove}
								removeDisabled={removeDisabled}
							/>
						))}
					</tbody>
				</table>
			</div>
		);
	}
);

const Upgrade = () => {
	return (
		<div className="d-flex align-items-center justify-content-between upgrade-section mt-2 mb-5">
			<div>
				<div className="font-weight-bold">Adjust asset ordering</div>
				<div>
					Get more visibility by displaying your token and major coins above the
					rest
				</div>
			</div>
			<div className="ml-5 button-wrapper">
				<a
					href="https://dash.bitholla.com/billing"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Button type="primary" className="w-100">
						Upgrade
					</Button>
				</a>
			</div>
		</div>
	);
};

const ConfigsModal = ({
	isOpen,
	onCloseDialog,
	default_wallet_sort,
	onConfirm,
	info,
	assets,
	pinned_assets,
}) => {
	const [isAddAsset, setIsAddAsset] = useState(false);
	const [sort, setSort] = useState(default_wallet_sort);
	const [items, setItems] = useState([...pinned_assets]);

	const handleSort = ({ target: { value } }) => {
		setSort(value);
	};

	const handleConfirm = () => {
		onConfirm({ pinned_assets: items, default_wallet_sort: sort });
		onCloseDialog();
	};

	const onClose = () => {
		return isAddAsset ? setIsAddAsset(false) : onCloseDialog();
	};

	const onSortEnd = ({ oldIndex, newIndex }) => {
		setItems(arrayMove(items, oldIndex, newIndex));
	};

	const handleRemove = (key = '') => {
		setItems(items.filter((asset) => asset !== key));
	};

	const isUpgrade = handleUpgrade(info);

	const options = assets
		.filter(({ key }) => !items.includes(key))
		.map(({ key, symbol, fullname }, index) => (
			<div
				key={index}
				className="coin-option pointer"
				onClick={() => {
					setItems([...items, key]);
					setIsAddAsset(false);
				}}
			>
				<div className="d-flex align-items-center">
					<div className="d-flex align-items-center f-1">
						<Coins type={symbol} small={true} isLight={true} />
						<span className="coin-full-name">{fullname}</span>
					</div>
				</div>
			</div>
		));

	return (
		<Modal
			isOpen={isOpen}
			label="operator-controls-modal"
			className="operator-controls__modal add-theme"
			onCloseDialog={onClose}
			shouldCloseOnOverlayClick={true}
			showCloseText={true}
			bodyOpenClassName="operator-controls__modal-open"
		>
			{isAddAsset ? (
				<Fragment>
					<div className="operator-controls__all-strings-header">
						<div className="operator-controls__modal-title">
							Select an asset
						</div>
					</div>

					<Fragment>
						<div className="my-4 bold">Assets</div>
						<div className="market-options-wrapper">{options}</div>
					</Fragment>
				</Fragment>
			) : (
				<Fragment>
					<div className="operator-controls__all-strings-header">
						<div className="operator-controls__modal-title">
							Asset list ordering
						</div>
					</div>

					<Fragment>
						<div className="my-4 bold">Default ordering</div>
						<div className="mb-4">
							<Group onChange={handleSort} value={sort}>
								{Object.entries(WALLET_SORT).map(([key, mode]) => (
									<Radio value={mode}>
										<span className="bold caps-first">{mode}</span>
										<span> </span>
										<span>({WALLET_SORT_EXP[key]})</span>
									</Radio>
								))}
							</Group>
						</div>
						<div className="my-4">
							<span className="bold">Note: </span>
							Ordering will be set from highest to lowest, however, users can
							toggle the asset list ordering. Pinned assets will still be placed
							on top.
						</div>
					</Fragment>

					<div className="divider" />

					{isUpgrade && <Upgrade />}

					<Fragment>
						<div className="my-4 bold">Pinned assets</div>
						<div className="mb-4">
							Apply an asset pin to the top of the list
						</div>
						<div className="my-4">
							<SortableList
								pressDelay={200}
								items={items}
								onSortEnd={onSortEnd}
								onRemove={handleRemove}
								removeDisabled={isUpgrade}
							/>
						</div>
						<div>
							<span
								onClick={isUpgrade ? () => {} : () => setIsAddAsset(true)}
								className={
									isUpgrade
										? 'secondary-text underline-text'
										: 'important-text underline-text pointer'
								}
							>
								Add asset
							</span>
						</div>
						<div className="my-4">
							<span className="bold">Note: </span>
							Assets after the pinned assets will continue to follow the
							ordering rule you've set above.
						</div>
					</Fragment>

					<div className="pt-3">
						<Button
							block
							type="primary"
							size="large"
							className="operator-controls__save-button"
							onClick={handleConfirm}
						>
							Save
						</Button>
					</div>
				</Fragment>
			)}
		</Modal>
	);
};

const mapStateToProps = (state) => ({
	default_wallet_sort: state.app.default_wallet_sort,
	pinned_assets: pinnedAssetsSelector(state),
	info: state.app.info,
	assets: selectAssetOptions(state),
});

export default connect(mapStateToProps)(ConfigsModal);
