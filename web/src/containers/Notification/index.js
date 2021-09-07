import React, { useEffect, useState } from 'react';
import querystring from 'query-string';

import { Dialog, SuccessDisplay } from '../../components';

const CustomNotification = ({ location, router }) => {
	const [paramsData, setParamsData] = useState('');

	useEffect(() => {
		const qs = querystring.parse(location.search);
		const { status, message } = qs;

		if (status === 'false' && message) {
			setParamsData({ status: false, message });
		} else if (message) {
			setParamsData({ status: true, message });
		}
	}, [location]);

	const handleBack = () => {
		router.goBack();
	};

	return (
		<div className="presentation_container apply_rtl">
			<Dialog isOpen={true} onCloseDialog={handleBack}>
				<SuccessDisplay
					onClick={handleBack}
					text={paramsData.message}
					success={paramsData.status}
					iconPath={null}
				/>
			</Dialog>
		</div>
	);
};

export default CustomNotification;
