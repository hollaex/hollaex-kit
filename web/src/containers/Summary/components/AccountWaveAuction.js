import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Table } from '../../../components';
import { getWaveAuction } from '../../../actions/appActions';
import { generateWaveHeaders } from './utils';
import STRINGS from '../../../config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

class AccountWaveAuction extends Component {
	constructor(props) {
		super(props);
		this.state = {
			waveData: [],
			headers: [],
			phase: [],
			currentPhase: 1,
		};
	}

	componentDidMount() {
		this.props.getWaveAuction();
		this.constructData();
	}

	componentDidUpdate(prevProps, prevState) {
		if (JSON.stringify(prevProps.wave) !== JSON.stringify(this.props.wave)) {
			this.constructData();
		}
	}

	constructData = () => {
		const { icons: ICONS } = this.props;
		let phase = [];
		let defaultWave = {
			amount: 'TBA',
			created_at: 'TBA',
			filled: 'TBA',
			floor: 'TBA',
			id: 'TBA',
			low: 'TBA',
			no: 'TBA',
			phase: 'TBA',
			status: 'TBA',
			updated_at: 'TBA',
		};
		this.props.wave.forEach((data) => {
			if (!phase.includes(data.phase)) {
				phase = [...phase, data.phase];
			}
		});
		phase.sort((a, b) => a - b);
		let waveData = [];
		phase.forEach((key) => {
			let filteredData = this.props.wave.filter((data) => data.phase === key);
			filteredData.sort((a, b) => a.no - b.no);
			if (filteredData.length < 10) {
				let count = 10 - filteredData.length;
				while (count > 0) {
					filteredData = [...filteredData, defaultWave];
					count--;
				}
			} else if (filteredData.length > 10) {
				filteredData = filteredData.slice(0, 10);
			}
			waveData = [...waveData, ...filteredData];
		});
		const headers = generateWaveHeaders(ICONS);
		this.setState({ waveData, headers, phase, currentPhase: phase[0] || 1 });
	};

	handlePhase = (size, page) => {
		this.setState({ currentPhase: this.state.phase[page] });
	};

	render() {
		const { headers, waveData, currentPhase } = this.state;
		return (
			<div className="summary-section_2">
				<div className="summary-content-txt mb-2">
					<div>{STRINGS['SUMMARY.XHT_WAVE_DESC_1']}</div>
					<div>{STRINGS['SUMMARY.XHT_WAVE_DESC_2']}</div>
					<div>{STRINGS['SUMMARY.XHT_WAVE_DESC_3']}</div>
					<a
						className="blue-link"
						target="blank"
						href="https://hollaex.com/docs/wave-auction.pdf"
					>
						{STRINGS['SUMMARY.LEARN_MORE_WAVE_AUCTION']}
					</a>
				</div>
				<div className="wave-action-phase">
					<div className="summary-block-title my-1">
						{STRINGS.formatString(
							STRINGS['SUMMARY.WAVE_AUCTION_PHASE'],
							currentPhase
						)}
					</div>
					<Table
						rowKey={(data) => {
							return data.id;
						}}
						headers={headers}
						data={waveData}
						count={waveData.length}
						handleNext={this.handlePhase}
						handlePrevious={this.handlePhase}
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	wave: state.app.wave,
});

const mapDispatchToProps = (dispatch) => ({
	getWaveAuction: bindActionCreators(getWaveAuction, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(AccountWaveAuction));
