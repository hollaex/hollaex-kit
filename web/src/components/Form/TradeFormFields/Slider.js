import React from 'react';
import { Slider } from 'antd';

// todo: connect antd slider to redux form

const marks = {
	0: {},
	25: {},
	50: {},
	75: {},
	100: {},
};

const SizeSlider = (props) => {
	const { onClick } = props;

	return (
		<div className="size-slider px-1">
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
