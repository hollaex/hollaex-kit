import React, { useEffect, Fragment } from 'react';
import { message } from 'antd';
import { isDate } from 'moment';
import classnames from 'classnames';
import _map from 'lodash/map';
import moment from 'moment';
import { DATETIME_FORMAT } from '../../../utils/date';
import { ZoomInOutlined } from '@ant-design/icons';
export const KEYS_TO_HIDE = [
	// 'email',
	'id',
	'activated',
	'otp_enabled',
	'crypto_wallet',
	'access_token',
	'bank_account',
];

export const displayNestedValues = (value) => {
	return typeof value === 'object' && value !== null
		? _map(value, (nestVal, index) => (
				<div className="ml-3" key={index}>
					{' '}
					{index}: {displayNestedValues(nestVal)}
				</div>
		  ))
		: value;
};

export const renderRowImages = ([key, value]) => (
	<div key={key} className="verification_block">
		<div className="block-title">{key}</div>
		<Fragment>
			{value.icon ? (
				<div
					className="verification_img"
					style={{ backgroundImage: `url(${value.icon})` }}
					onClick={() => value.onZoom(value.icon)}
				>
					<ZoomInOutlined className="search_icon" key={key} />
				</div>
			) : (
				'(No data)'
			)}
		</Fragment>
	</div>
);

export const renderRowInformation = ([key, value]) =>
	KEYS_TO_HIDE.indexOf(key) === -1 && renderJSONKey(key, value);

export const renderJSONKey = (key, value) => {
	let valueText = '';
	if (key === 'dob' && isDate(new Date(value))) {
		valueText = `${moment.parseZone(value).format(DATETIME_FORMAT)}`;
	} else if (key === 'wallet') {
		valueText = _map(value, (wallet, index) => {
			return (
				<div key={index}>
					{index}:
					{_map(wallet, (walletData, index) => (
						<div key={index}>
							{' '}
							{index}: {walletData}
						</div>
					))}
				</div>
			);
		});
	} else if (key === 'settings') {
		valueText = Object.entries(value).map(([key, val]) => {
			return (
				<div key={`${key}_`}>
					{key} :
					<div>
						{_map(val, (data, keyItem) => {
							return typeof data === 'boolean' ? (
								<div key={`${keyItem}_1`} className="pl-3">
									{keyItem} : {JSON.stringify(data)}
								</div>
							) : (
								<div key={`${keyItem}_2`} className="pl-3">
									{keyItem} : {data}
								</div>
							);
						})}
					</div>
				</div>
			);
		});
	} else if (key === 'id_data') {
		valueText = _map(value, (id_val, index) => {
			return (
				<div key={index}>
					{index}: {displayNestedValues(id_val)}
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
					{key} : {typeof val === 'object' ? JSON.stringify(val) : val}
				</div>
			);
		});
	} else if (typeof value === 'boolean') {
		valueText = value ? 'TRUE' : 'FALSE';
	} else {
		valueText = value;
	}
	return (
		<div
			key={key}
			className={
				typeof valueText === 'object' ? 'json_wrapper' : 'jsonkey-wrapper'
			}
		>
			<strong>{key}</strong>: <pre>{valueText}</pre>
		</div>
	);
};

const DataDisplay = ({
	className = '',
	renderRow,
	title,
	data = {},
	popError = false,
}) => {
	useEffect(() => {
		if (popError && data.message) {
			message.error(JSON.stringify(data.message));
		}

		//  TODO: Fix react-hooks/exhaustive-deps
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className={classnames('verification_data_container-data', className)}>
			{title ? <h2>{title}</h2> : null}
			{data.message ? (
				<div>{JSON.stringify(data.message)}</div>
			) : (
				Object.entries(data).map(renderRow)
			)}
		</div>
	);
};

export default DataDisplay;
