import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { selectMarketOptions } from 'containers/Trade/utils';
import Modal from 'components/Dialog/DesktopDialog';
import { Button, Radio } from 'antd';
import { SORT, SORT_EXP } from 'actions/appActions';
import { handleUpgrade } from 'utils/utils';
import Coins from 'containers/Admin/Coins';

const { Group } = Radio;

const SortableItem = SortableElement(({ market, order, handleRemove }) => (
	<tr className="sortable_section">
		<td>{order + 1}</td>
		<td>
			<MenuOutlined />
		</td>
		<td>{market}</td>
		<td>
			<div onClick={() => handleRemove(market)} className="underline-text">
				Remove
			</div>
		</td>
	</tr>
));

const SortableList = SortableContainer(({ items, handleRemove }) => {
	return (
		<div className="mt-4 pinned-markets-table-wrapper">
			<table className="m-3 pinned-markets-table">
				<thead>
					<tr>
						<th>Order</th>
						<th>Move</th>
						<th>Market</th>
						<th>Remove</th>
					</tr>
				</thead>
				<tbody>
					{items.map((market, index) => (
						<SortableItem
							key={`item-${market}`}
							index={index}
							market={market}
							order={index}
							handleRemove={handleRemove}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
});

const Upgrade = () => {
	return (
		<div className="d-flex align-items-center justify-content-between upgrade-section mt-2 mb-5">
			<div>
				<div className="font-weight-bold">Adjust market ordering</div>
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
	sort: { mode: sortMode },
	onConfirm,
	info,
	markets,
}) => {
	const [isAddMarket, setIsAddMarket] = useState(false);
	const [sort, setSort] = useState(sortMode);
	const [items, setItems] = useState(['XHT/BTC', 'ETH/USDT']);

	const handleSort = ({ target: { value } }) => {
		setSort(value);
	};

	const handleConfirm = () => {
		onCloseDialog();
	};

	const onSortEnd = ({ oldIndex, newIndex }) => {
		setItems(arrayMove(items, oldIndex, newIndex));
	};

	const isUpgrade = handleUpgrade(info);

	const options = markets
		.filter(({ key }) => !items.includes(key))
		.map(({ key, pairBase, pair2 }, index) => (
			<div
				key={index}
				className="coin-option pointer"
				onClick={() => {
					setItems([...items, key]);
					setIsAddMarket(false);
				}}
			>
				<div className="d-flex align-items-center">
					<div className="d-flex align-items-center f-1">
						<Coins type={pairBase.symbol} small={true} />
						<span className="coin-full-name">{pairBase.fullname}</span>
					</div>
					<CloseOutlined style={{ fontSize: '24px', margin: '0px 15px' }} />
					<div className="d-flex align-items-center f-1">
						<Coins type={pair2.symbol} small={true} />
						<span className="coin-full-name">{pair2.fullname}</span>
					</div>
				</div>
			</div>
		));

	return (
		<Modal
			isOpen={isOpen}
			label="operator-controls-modal"
			className="operator-controls__modal add-theme"
			disableTheme={true}
			onCloseDialog={onCloseDialog}
			shouldCloseOnOverlayClick={true}
			showCloseText={true}
			bodyOpenClassName="operator-controls__modal-open"
		>
			{isAddMarket ? (
				<Fragment>
					<div className="operator-controls__all-strings-header">
						<div className="operator-controls__modal-title">
							Select a market
						</div>
					</div>

					<Fragment>
						<div className="my-4 bold">Markets</div>
						<div className="market-options-wrapper">{options}</div>
					</Fragment>
				</Fragment>
			) : (
				<Fragment>
					<div className="operator-controls__all-strings-header">
						<div className="operator-controls__modal-title">
							Market list ordering
						</div>
					</div>

					<Fragment>
						<div className="my-4 bold">Default ordering</div>
						<div className="mb-4">
							<Group onChange={handleSort} value={sort}>
								{Object.entries(SORT).map(([key, mode]) => (
									<Radio value={mode}>
										<span className="bold caps-first">{mode}</span>
										<span> </span>
										<span>({SORT_EXP[key]})</span>
									</Radio>
								))}
							</Group>
						</div>
						<div className="my-4">
							<span className="bold">Note: </span>
							Ordering will be set from highest to lowest, however, users can
							toggle the market list ordering. Pinned orders will still be
							placed on top.
						</div>
					</Fragment>

					<div className="divider" />

					{isUpgrade && <Upgrade />}

					<Fragment>
						<div className="my-4 bold">Pinned markets</div>
						<div className="mb-4">
							Apply a market pin to the top of the list
						</div>
						<div className="my-4">
							<SortableList items={items} onSortEnd={onSortEnd} />
						</div>
						<div>
							<span
								onClick={() => setIsAddMarket(true)}
								className="important-text underline-text pointer"
							>
								Add market
							</span>
						</div>
						<div className="my-4">
							<span className="bold">Note: </span>
							Markets after the pinned markets will continue to follow the
							ordering you've set above.
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
	sort: state.app.sort,
	info: state.app.info,
	markets: selectMarketOptions(state),
});

export default connect(mapStateToProps)(ConfigsModal);
