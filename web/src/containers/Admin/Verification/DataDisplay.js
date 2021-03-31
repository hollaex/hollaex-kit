import React, { Fragment } from 'react';
import { isDate } from 'moment';
import classnames from 'classnames';
import { formatTimestampGregorian, DATETIME_FORMAT } from '../../../utils/date';
export const KEYS_TO_HIDE = [
	// 'email',
	'id',
	'activated',
	'otp_enabled',
	'crypto_wallet',
	'access_token',
	'bank_account',
];

export const renderRowImages = ([key, value]) => (
	<div key={key} className="verification_block">
		<div className="block-title">{key}</div>
		{value ? (
			<Fragment>
				{/* <a href={value} target="_blank" rel="noopener noreferrer">
					{key}
				</a> */}
				<img src={value} alt={key} className="verification_img" key={key} />
			</Fragment>
		) : (
			'(No data)'
		)}
	</div>
);

export const renderRowInformation = ([key, value]) =>
	KEYS_TO_HIDE.indexOf(key) === -1 && renderJSONKey(key, value);

export const renderJSONKey = (key, value) => {
	let valueText = '';
	if (key === 'dob' && isDate(new Date(value))) {
		valueText = `${formatTimestampGregorian(value, DATETIME_FORMAT)}`;
	} else if (key === 'settings') {
		valueText = Object.entries(value).map(([key, val]) => {
			return (
				<div key={`${key}_`}>
					{key} : {JSON.stringify(val)}
				</div>
			);
		});
	} else if (typeof value === 'object' && value !== null) {
		valueText = Object.entries(value).map(([key, val]) => {
			return typeof val === 'boolean' ? (
				<div key={`${key}_1`}>
					{key} : {JSON.stringify(val)}
				</div>
			) : (
				<div key={`${key}_2`}>
					{key} : {val}
				</div>
			);
		});
	} else if (typeof value === 'boolean') {
		valueText = value ? 'TRUE' : 'FALSE';
	} else {
		valueText = value;
	}
	return (
		<div key={key} className="jsonkey-wrapper">
			<strong>{key}</strong>: <pre>{valueText}</pre>
		</div>
	);
};
export default ({ className = '', renderRow, title, data = {} }) => (
	<div className={classnames('verification_data_container-data', className)}>
		{title ? <h2>{title}</h2> : null}
		{data.message ? (
			<div>{data.message}</div>
		) : (
			Object.entries(data).map(renderRow)
		)}
	</div>
);
