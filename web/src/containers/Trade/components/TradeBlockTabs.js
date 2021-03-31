import React, { Component } from 'react';
import classnames from 'classnames';
import EventListener from 'react-event-listener';
import TradeBlock from './TradeBlock';
import { isLoggedIn } from '../../../utils/token';
import { EditWrapper } from 'components';

class TradeBlockTabs extends Component {
	state = {
		activeTab: 0,
	};

	setWrapperRef = (el) => {
		if (el) {
			this.wrapper = el;
			this.setState({ height: this.wrapper.offsetHeight || 0 });
		}
	};

	setActiveTab = (activeTab = 0) => () => {
		this.setState({ activeTab });
	};

	handleResize = () => {
		if (this.wrapper) {
			this.setState({ height: this.wrapper.offsetHeight || 0, activeTab: 0 });
		}
	};

	renderTitles = (active = 0, content = []) => {
		return (
			<div className="trade_block-title">
				<div className="trade_block-title-items">
					{content.map((item, index) => (
						<EditWrapper key={index} stringId={item.stringId}>
							<div
								className={classnames('pointer', { active: active === index })}
								onClick={this.setActiveTab(index)}
							>
								{item.title}
							</div>
						</EditWrapper>
					))}
				</div>
				{content[active].titleAction}
			</div>
		);
	};

	renderContent = (maxHeight) => {
		const { content, overflowY } = this.props;
		const { activeTab, height } = this.state;
		return height < maxHeight && false ? (
			<div className="trade_block-wrapper trade_block_tabs-wrapper d-flex flex-column">
				{this.renderTitles(activeTab, content)}
				<div
					className={classnames(
						'trade_block-content',
						isLoggedIn() ? 'd-flex' : '',
						{
							'overflow-y': overflowY,
						}
					)}
				>
					{content[activeTab].children}
				</div>
			</div>
		) : (
			<div className="d-flex flex-column f-1 trade_block-column-wrapper">
				{content.map(({ title, titleAction, children, stringId }, index) => (
					<TradeBlock
						title={title}
						action={titleAction}
						stringId={stringId}
						key={index}
					>
						{React.cloneElement(children, {
							...this.props,
							height: this.state.height,
						})}
					</TradeBlock>
				))}
			</div>
		);
	};

	render() {
		const { maxHeight } = this.props;

		return (
			<div ref={this.setWrapperRef} className="d-flex h-100">
				<EventListener target="window" onResize={this.handleResize} />
				{this.renderContent(maxHeight)}
			</div>
		);
	}
}

TradeBlockTabs.defaultProps = {
	maxHeight: Infinity,
	overflowY: false,
};
export default TradeBlockTabs;
