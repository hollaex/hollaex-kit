import React, { useEffect, useState } from 'react';
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

const SizeSlider = ({ onClick, value, setRef }) => {
	const [val, setVal] = useState(0);

	useEffect(() => {
		if (setRef) {
			setRef({
				reset: () => {
					setVal(0);
				},
			});
		}
	}, [setRef]);

	return (
		<div className="size-slider px-1 pb-2">
			<Slider
				marks={marks}
				step={null}
				defaultValue={0}
				tooltipVisible={false}
				onAfterChange={onClick}
				value={val}
				onChange={setVal}
			/>
		</div>
	);
};

export default SizeSlider;
