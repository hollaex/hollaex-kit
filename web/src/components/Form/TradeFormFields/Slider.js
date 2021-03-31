import React from 'react';
import { Slider } from 'antd';

// todo: connect antd slider to redux form

const marks = {
	0: {},
	25: {
		label: '25%',
		style: {
			transform: 'translateX(-66%)',
		},
	},
	50: {
		label: '50%',
		style: {
			transform: 'translateX(-66%)',
		},
	},
	75: {
		label: '75%',
		style: {
			transform: 'translateX(-66%)',
		},
	},
	100: {
		label: '100%',
		style: {
			transform: 'translateX(-66%)',
		},
	},
};

const SizeSlider = (props) => {
	const { onClick } = props;

	return (
		<div className="size-slider px-1 pb-2">
			<Slider
				marks={marks}
				step={null}
				defaultValue={0}
				tooltipVisible={false}
				onAfterChange={onClick}
			/>
		</div>
	);
};

export default SizeSlider;
