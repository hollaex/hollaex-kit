import React from 'react';
import STRINGS from 'config/localizedStrings';
import { EditWrapper } from 'components';

const Clear = (props) => {
	const { onClick } = props;

	return (
		<div className="d-flex justify-content-end mb-0">
			<span className="pointer text-uppercase blue-link" onClick={onClick}>
				<EditWrapper stringId="CLEAR">{STRINGS['CLEAR']}</EditWrapper>
			</span>
		</div>
	);
};

export default Clear;
