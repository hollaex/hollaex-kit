import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MobileDropdown } from '../../../components';
import { changePair } from '../../../actions/appActions';

class MobileDropdownWrapper extends Component {
	onChangePair = (event) => {
		const { goToPair } = this.props;
		const p = event.target.value.replace('/', '-');
		goToPair(p);
	};

	render() {
		const { pair, pairs } = this.props;
		const { pair_base } = pairs[pair];
		const pairsArray = Object.keys(pairs).map((key) =>
			key.toString().replace('-', '/')
		);
		pairsArray.unshift(pair.replace('-', '/'));

		const uniqArray = [...new Set(pairsArray)]; //remove duplicates

		return (
			<MobileDropdown
				onChange={(e) => this.onChangePair(e)}
				options={uniqArray}
				pairs={pairs}
				pair={pair_base}
				className="mobile-drop-down"
			/>
		);
	}
}

const mapStateToProps = (store) => ({
	pair: store.app.pair,
	pairs: store.app.pairs,
});

const mapDispatchToProps = (dispatch) => ({
	changePair: bindActionCreators(changePair, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MobileDropdownWrapper);
