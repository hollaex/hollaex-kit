import React, { Component, Fragment } from 'react';
import { Transition } from 'react-transition-group';
import classnames from 'classnames';

class PriceChange extends Component {
	constructor(props) {
		super(props);
		const { market: { priceDifference = 0 } = {} } = this.props;
		this.state = {
			tickerDiff: priceDifference,
			inProp: false,
		};
	}

	UNSAFE_componentWillUpdate(nextProp) {
		const {
			market,
			market: { ticker },
		} = this.props;
		if (market && ticker && nextProp.market.ticker.close !== ticker.close) {
			const tickerDiff = nextProp.market.ticker.close - ticker.close;
			this.setState((prevState) => ({
				...prevState,
				tickerDiff,
				inProp: !prevState.inProp,
			}));
		}
	}

	getDirBasedClass = (diff, baseClassName = '') => {
		const direction = diff < 0 ? 'down' : diff > 0 ? 'up' : '';
		return baseClassName ? `${baseClassName}-${direction}` : direction;
	};

	render() {
		const {
			market: { priceDifference, priceDifferencePercent },
		} = this.props;
		const { inProp, tickerDiff } = this.state;

		return (
			<Fragment>
				<Transition in={inProp} timeout={1000}>
					{(state) => (
						<div className="price-change d-flex align-items-center justify-content-between">
							<div
								className={classnames(
									'title-font',
									'price-diff',
									state,
									this.getDirBasedClass(priceDifference),
									this.getDirBasedClass(tickerDiff, 'glance')
								)}
							>
								{priceDifferencePercent}
							</div>
						</div>
					)}
				</Transition>
			</Fragment>
		);
	}
}

export default PriceChange;
