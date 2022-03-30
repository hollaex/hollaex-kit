import moment from 'moment';
import mathjs from 'mathjs';
import { DATETIME_FORMAT } from 'utils/date';
import STRINGS from 'config/localizedStrings';

const ESTIMATED_TIME_PER_BLOCK = 13000;
const TIME_KEYS = ['years', 'months', 'days', 'hours', 'minutes', 'seconds'];

export const roundDuration = (estimatedTime) => {
	const [duration, unit] = estimatedTime;

	if (unit.includes('hour')) {
		const day = mathjs.round(mathjs.divide(duration, 24));

		if (mathjs.larger(day, 0)) {
			return [day, 'day'];
		}
	} else if (unit.includes('day')) {
		const month = mathjs.round(mathjs.divide(duration, 30));
		const week = mathjs.round(mathjs.divide(duration, 7));

		if (mathjs.larger(month, 0)) {
			return [month, 'month'];
		} else if (mathjs.larger(week, 0)) {
			return [week, 'week'];
		}
	} else if (unit.includes('month')) {
		const year = mathjs.round(mathjs.divide(duration, 12));

		if (mathjs.larger(year, 0)) {
			return [year, 'year'];
		}
	}

	return [duration, unit];
};

export const getEstimatedRemainingTime = (remainingBlock) => {
	const totalRemainigTime = mathjs.multiply(
		remainingBlock,
		ESTIMATED_TIME_PER_BLOCK
	);
	const duration = moment.duration(totalRemainigTime);

	let estimatedLeftover = 0;
	let leftoverKey = '';
	for (const key of TIME_KEYS) {
		if (duration[key]() !== 0) {
			estimatedLeftover = duration[key]();
			leftoverKey = key;
			break;
		}
	}

	if (estimatedLeftover === 1) {
		leftoverKey = leftoverKey.slice(0, -1);
	}

	return [estimatedLeftover, leftoverKey];
};

export const calculateEsimatedDate = (
	block,
	currentBlock,
	showEstimatedText = true
) => {
	if (block && currentBlock) {
		const now = moment();
		const isPassed = mathjs.largerEq(currentBlock, block);
		const duration = moment.duration(
			mathjs.abs(
				mathjs.multiply(
					mathjs.subtract(currentBlock, block),
					ESTIMATED_TIME_PER_BLOCK
				)
			)
		);
		let estimatedDataObject;
		if (isPassed) {
			estimatedDataObject = now.subtract(duration);
		} else {
			estimatedDataObject = now.add(duration);
		}

		return showEstimatedText
			? `${STRINGS['STAKE.ESTIMATED']} ${estimatedDataObject.format(
					DATETIME_FORMAT
			  )}`
			: estimatedDataObject.format(DATETIME_FORMAT);
	} else {
		return '';
	}
};

export const dotifyString = (account = '', first = 5, last = 4) => {
	const length = account.length;
	if (length > first + last) {
		return `${account.slice(0, first)}...${account.slice(
			last * -1
		)}`.toUpperCase();
	} else {
		return account;
	}
};
