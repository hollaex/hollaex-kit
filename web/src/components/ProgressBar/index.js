import React from 'react';
import mathjs from 'mathjs';
import { calcPercentage } from 'utils/math';
import { ClockCircleFilled } from '@ant-design/icons';

const ProgressBar = ({ partial, total }) => {
	const percent = calcPercentage(partial, total);
	const color = mathjs.largerEq(percent, 100) ? 'completed' : 'in-progress';
	const fillClassName = `progress-fill progress-fill-${color}`;
	const fillStyle = {
		backgroundSize: `${percent}% 100%`,
	};

	return (
		<div className="d-flex align-center">
			<div className="progressbar mr-2">
				<div className={fillClassName} style={fillStyle} />
			</div>
			<ClockCircleFilled className={`progressbar-icon ${color}`} />
		</div>
	);
};

export default ProgressBar;
