import React, { Component } from 'react';
import { oneOfType, object, func, bool, string, array, number } from 'prop-types';
import classnames from 'classnames';
import ReactSVG from 'react-svg';
import { isMobile } from 'react-device-detect';

import { Button } from 'components';
import STRINGS from 'config/localizedStrings';
import { ICONS, FLEX_CENTER_CLASSES } from 'config/constants';
import InputGroup from './InputGroup';

class QuickTrade extends Component {

	render() {
		const {
			targetAmount,
			sourceAmount,
			onSelectSource,
			onSelectTarget,
			onChangeSourceAmount,
			onChangeTargetAmount,
			onReviewQuickTrade,
			disabled,
			targetOptions,
			sourceOptions,
			selectedSource,
			selectedTarget
		} = this.props;

		return (
			<div className={classnames('quick_trade-wrapper', 'd-flex', 'flex-column')}>
				<div
					className={classnames(
						'quick_trade-section_wrapper',
						'quick_trade-bottom-padded',
						// ...GROUP_CLASSES
					)}
				>
					<ReactSVG path={ isMobile ? ICONS.SIDEBAR_QUICK_TRADING_INACTIVE: ICONS.QUICK_TRADE} wrapperClassName= {isMobile ?'quick_trade-tab-icon' :"quick_trade-icon"} />
					<div className={classnames("title text-capitalize", ...FLEX_CENTER_CLASSES)}>
						{STRINGS.QUICK_TRADE_COMPONENT.TITLE}
					</div>
				</div>
				<InputGroup
					name="convert"
					options={sourceOptions}
					inputValue={sourceAmount}
					selectValue={selectedSource}
					onSelect={onSelectSource}
					onInputChange={onChangeSourceAmount}
				/>
				<InputGroup
					name="to"
					options={targetOptions}
					inputValue={targetAmount}
					selectValue={selectedTarget}
					onSelect={onSelectTarget}
					onInputChange={onChangeTargetAmount}
				/>
				<div
					className={classnames(
						'quick_trade-section_wrapper',
						'quick_trade-bottom-padded',
						'my-5'
						// ...GROUP_CLASSES
					)}
				>
					<Button
						label={STRINGS.QUICK_TRADE_COMPONENT.BUTTON}
						onClick={onReviewQuickTrade}
						disabled={disabled}
						type="button"
					/>
				</div>
			</div>
		);
	}
}

QuickTrade.propTypes = {
	onReviewQuickTrade: func.isRequired,
	theme: string.isRequired,
	disabled: bool.isRequired,
  pairs: object.isRequired,
  coins: object.isRequired,
  orderLimits: object.isRequired,
	onSelectTarget: func.isRequired,
	onSelectSource: func.isRequired,
	targetOptions: array,
	sourceOptions: array,
	selectedSource: string,
	selectedTarget: string,
	targetAmount: oneOfType([
    number,
    string,
  ]),
	sourceAmount: oneOfType([
    number,
    string,
  ]),
	onChangeTargetAmount: func.isRequired,
  onChangeSourceAmount: func.isRequired,
}

QuickTrade.defaultProps = {
  targetOptions: [],
  sourceOptions: [],
	onReviewQuickTrade: () => {},
	disabled: false
};

export default QuickTrade;
