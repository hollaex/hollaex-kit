import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';
import moment from 'moment';

import { getWaveAuction } from '../../../actions/appActions';
import STRINGS from '../../../config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

class UpComingWave extends Component {
	constructor(props) {
		super(props);
		this.state = {
			waveData: {},
			lastWave: {},
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
		const { wave = [] } = this.props;
		var now = moment(new Date());
		let lastWave = wave.length > 1 ? wave[1] : defaultWave;
		if (lastWave.updated_at && lastWave.updated_at !== 'TBA') {
			const lastWaveDifference = moment.duration(
				now.diff(moment(lastWave.updated_at))
			);
			const lastWaveTime = lastWaveDifference.format('hh[h]:mm[m]:ss[s]');
			lastWave = { ...lastWave, updated_at: lastWaveTime };
		}
		this.setState({ waveData: wave.length ? wave[0] : defaultWave, lastWave });
	};

	render() {
		const { icons: ICONS } = this.props;
		return (
			<div className="trade_orderbook-headers d-flex">
				<div>
					<ReactSVG src={ICONS['INCOMING_WAVE']} className="waves-icon" />
				</div>
				<div className="ml-3">
					<div className=" f-1 trade_orderbook-cell mb-2">
						<span className="wave-header mr-2">
							{`${STRINGS['WAVES.NEXT_WAVE']}:`}
						</span>
						<span className="wave-content">{this.state.waveData.no}</span>
					</div>
					<div className=" f-1 trade_orderbook-cell mb-2">
						<span className="wave-header mr-2">
							{`${STRINGS['WAVES.WAVE_AMOUNT']}:`}
						</span>
						<span className="wave-content">
							{`${this.state.waveData.amount} ${this.props.pairBase}`}
						</span>
					</div>
					<div className=" f-1 trade_orderbook-cell mb-2">
						<span className="wave-header mr-2">
							{`${STRINGS['WAVES.FLOOR']}:`}
						</span>
						<span className="wave-content">{this.state.waveData.floor}</span>
					</div>
					<div className=" f-1 trade_orderbook-cell mb-2">
						<span className="wave-header mr-2">
							{`${STRINGS['WAVES.LAST_WAVE']}:`}
						</span>
						<span className="wave-content">
							{this.state.lastWave.updated_at}
						</span>
					</div>
					<div className=" f-1 trade_orderbook-cell mb-3">
						<a
							href={
								'https://info.hollaex.com/hc/en-us/articles/360040098633-What-is-the-Wave-Auction-'
							}
							target="_blank"
							rel="noopener noreferrer"
							className="blue-link pointer"
						>
							{STRINGS['HOME.SECTION_1_BUTTON_1']}
						</a>
					</div>
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
)(withConfig(UpComingWave));
