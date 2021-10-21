import React, { Component } from 'react';
import Pickr from '@simonwep/pickr';

import '@simonwep/pickr/dist/themes/nano.min.css';
import './index.css';

class ColorPicker extends Component {
	state = {
		isOpen: false,
		background: this.props.value || '#22194D',
	};

	componentDidMount() {
		this.pickr = Pickr.create({
			el: '.color-picker',
			theme: 'nano', // or 'monolith', or 'nano'
			swatches: [
				'rgba(244, 67, 54, 1)',
				'rgba(233, 30, 99, 1)',
				'rgba(156, 39, 176, 1)',
				'rgba(103, 58, 183, 1)',
				'rgba(63, 81, 181, 1)',
				'rgba(33, 150, 243, 1)',
				'rgba(3, 169, 244, 1)',
				'rgba(0, 188, 212, 1)',
				'rgba(0, 150, 136, 1)',
				'rgba(76, 175, 80, 1)',
				'rgba(139, 195, 74, 1)',
				'rgba(205, 220, 57, 1)',
				'rgba(255, 235, 59, 1)',
				'rgba(255, 193, 7, 1)',
			],
			default: this.state.background,
			components: {
				preview: true,
				opacity: false,
				lockOpacity: true,
				hue: true,
				interaction: {
					input: true,
					save: true,
				},
			},
		});
		this.pickr.on('save', this.handleChangeComplete);
	}

	handleClick = () => {
		const isOpen = !this.state.isOpen;
		if (isOpen) {
			this.pickr.show();
		} else {
			this.pickr.hide();
		}
		this.setState({ isOpen });
	};

	handleChangeComplete = (color) => {
		const { onChange } = this.props;
		this.setState(
			{ background: color.toHEXA().toString(), isOpen: false },
			() => {
				if (onChange) {
					onChange(this.state.background);
				}
				this.pickr.hide();
			}
		);
	};

	render() {
		const { background } = this.state;
		return (
			<div className="color_picker-container">
				<div className="picker-wrapper" onClick={this.handleClick}>
					<div className="color-picker"></div>
					<div>{background}</div>
				</div>
			</div>
		);
	}
}

export default ColorPicker;
