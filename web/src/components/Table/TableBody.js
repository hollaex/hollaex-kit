import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import classnames from 'classnames';

const RENDER_CELL = (row, key, cellIndex) => (
	<td key={cellIndex}>{row[key]}</td>
);

class TableRow extends Component {
	constructor(props) {
		super(props);
		const {
			expandable: { defaultExpanded },
			row,
			rowIndex,
		} = this.props;
		this.state = {
			isExpanded: defaultExpanded(row, rowIndex),
		};
	}

	setIsExpanded = () => {
		this.setState((prevState) => ({
			...prevState,
			isExpanded: !prevState.isExpanded,
		}));
	};

	onExpand = () => {
		const {
			expandable: { rowExpandable },
			row,
			handleExpand,
		} = this.props;
		handleExpand(row.order_id, true);
		const isExpandable = rowExpandable(row);
		if (isExpandable) {
			this.setIsExpanded();
		}
	};

	render() {
		const {
			expandable: { rowExpandable, expandedRowRender },
			cancelDelayData,
			row,
			rowIndex,
			headers,
			activeTheme,
		} = this.props;
		const { isExpanded } = this.state;
		const isRemoveData = cancelDelayData.filter((data) => data === row.id);
		const isExpandable = rowExpandable(row);
		const subTrClsName =
			activeTheme === 'white' ? 'sub-tr-bg-white' : 'sub-tr-bg';

		return (
			<Fragment>
				<tr
					className={classnames(
						'table_body-row',
						`${isExpandable && isExpanded ? subTrClsName : ''}`,
						{
							'cancel-row-color': !!isRemoveData.length,
							pointer: isExpandable,
						}
					)}
					key={`row_${rowIndex}`}
					onClick={this.onExpand}
				>
					{headers.map(({ key, renderCell = RENDER_CELL }, cellIndex) =>
						renderCell(row, key, cellIndex, isExpandable, isExpanded)
					)}
				</tr>
				{isExpandable && isExpanded && (
					<tr
						className={`sub-tr ${subTrClsName}`}
						key={`expandable_row_${rowIndex}`}
					>
						<td colSpan={headers.length}>
							<div>{expandedRowRender(row)}</div>
						</td>
					</tr>
				)}
			</Fragment>
		);
	}
}

const TableBody = ({
	withIcon,
	data,
	headers,
	cancelDelayData,
	expandable,
	cssTransitionClassName,
	rowKey,
	handleExpand,
	activeTheme,
}) => (
	<tbody
		className={classnames('table_body-wrapper', {
			with_icon: withIcon || false,
		})}
	>
		{cssTransitionClassName ? (
			<TransitionGroup component={null}>
				{data.map((row, rowIndex) => {
					const index = row.id || rowIndex;
					return (
						<CSSTransition
							key={index}
							timeout={500}
							classNames={cssTransitionClassName}
						>
							<TableRow
								headers={headers}
								cancelDelayData={cancelDelayData}
								expandable={expandable}
								row={row}
								rowIndex={index}
								activeTheme={activeTheme}
							/>
						</CSSTransition>
					);
				})}
			</TransitionGroup>
		) : (
			<Fragment>
				{data.map((row, rowIndex) => (
					<TableRow
						key={rowKey(row)}
						headers={headers}
						cancelDelayData={cancelDelayData}
						expandable={expandable}
						row={row}
						rowIndex={rowIndex}
						handleExpand={handleExpand}
						activeTheme={activeTheme}
					/>
				))}
			</Fragment>
		)}
	</tbody>
);

const mapStateToProps = (store) => ({
	activeTheme: store.app.theme,
});

export default connect(mapStateToProps)(TableBody);
