import React from 'react';
import { useRemoteComponent } from 'useRemoteComponent';
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

export const RemoteComponent = ({
	showLoader,
	loaderClassName,
	errorClassName,
	url,
	...props
}) => {
	const [loading, err, Component] = useRemoteComponent(url);

	if (showLoader && loading) {
		return (
			<div className={loaderClassName}>
				<LoadingOutlined />
			</div>
		);
	}

	if (err) {
		return (
			<div className={errorClassName}>
				<ExclamationCircleOutlined />
				<div className="pl-2">{`Unknown Error: ${err.toString()}`}</div>
			</div>
		);
	}

	return <Component {...props} />;
};
