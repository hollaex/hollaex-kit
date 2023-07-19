import React from 'react';
import classnames from 'classnames';

const DEFINITIONS = {
	EXTREME: {
		intensity: 5,
		className: 'extreme-intensity',
	},
	HIGH: {
		intensity: 4,
		className: 'high-intensity',
	},
	MEDIUM: {
		intensity: 3,
		className: 'medium-intensity',
	},
	LOW: {
		intensity: 2,
		className: 'low-intensity',
	},
	DEFAULT: {
		intensity: 0,
		className: '',
	},
};

const Bars = ({ intensity = 0, className = '' }) => {
	const mapper = Array.from({ length: intensity }, () => 0);
	return (
		<div className="d-flex align-center intensity-bar-container">
			{mapper.map(() => (
				<div className={classnames('single-intensity-bar', className)} />
			))}
		</div>
	);
};

const scaleIntensity = (count) => {
	if (count >= DEFINITIONS.EXTREME.intensity) {
		return DEFINITIONS.EXTREME;
	} else if (count >= DEFINITIONS.HIGH.intensity) {
		return DEFINITIONS.HIGH;
	} else if (count >= DEFINITIONS.MEDIUM.intensity) {
		return DEFINITIONS.MEDIUM;
	} else if (count >= DEFINITIONS.LOW.intensity) {
		return DEFINITIONS.LOW;
	} else {
		return DEFINITIONS.DEFAULT;
	}
};

const IntensityBar = ({ count }) => {
	const { intensity, className } = scaleIntensity(count);

	return <Bars intensity={intensity} className={className} />;
};

export default IntensityBar;
