import React, { Fragment } from 'react';

const ZEROS = ['0', '.'];

const splitLeadingZeros = (number) => {
	const zeros = [];
	const numbers = [];
	let dividerFlag = false;
	const stringified = number.toString();
	const digits = stringified.split('');
	digits.forEach((digit) => {
		if (dividerFlag) {
			numbers.push(digit);
		} else {
			if (ZEROS.includes(digit)) {
				zeros.push(digit);
			} else {
				numbers.push(digit);
				dividerFlag = true;
			}
		}
	});

	return [zeros.join(''), numbers.join('')];
};

export const opacifyNumber = (
	number,
	{ zerosClassName, digitsClassName } = {
		zerosClassName: 'secondary-text',
		digitsClassName: 'important-text',
	}
) => {
	const [zeros, digits] = splitLeadingZeros(number);
	return (
		<Fragment>
			<span className={zerosClassName}>{zeros}</span>
			<span className={digitsClassName}>{digits}</span>
		</Fragment>
	);
};
