import React from 'react';
import moment from 'moment';
import 'moment-timezone';

class Timer extends React.Component {
	constructor(prop) {
		super(prop);
		let date = this.getTimeString();
		this.state = {
			time: date,
		};
	}

	componentDidMount() {
		this.timer = setInterval(() => {
			const date = this.getTimeString();
			this.setState({
				time: date,
			});
		}, 1000);
	}

	getTimeString() {
		let date = moment().format('hh:mm:ssA');
		if (this.props.isHover) {
			date =
				moment().format('DD/MMM/YYYY, hh:mm:ssA ').toUpperCase() +
				moment.tz.guess(true) +
				' ' +
				new Date().toTimeString().slice(9);
		}
		return date;
	}

	componentWillUnmount() {
		if (this.timer) {
			clearInterval(this.timer);
		}
	}

	render() {
		return <div>{this.state.time}</div>;
	}
}

export default Timer;
