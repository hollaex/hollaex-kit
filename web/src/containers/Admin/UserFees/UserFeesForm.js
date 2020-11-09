import React from 'react';

import renderFields from '../../../components/AdminForm/utils';
import STRINGS from '../../../config/localizedStrings';

const UserFeesForm = ({ fields }) => {
	return (
		<div>
			<div className="d-flex mb-2">
				<div className="verification_label">{STRINGS['USER_LEVEL']}</div>
				<div className="verification_content">{STRINGS['FEE_AMOUNT']}</div>
			</div>
			{Object.keys(fields).map((key, index) => {
				const levelFields = fields[key];
				return (
					<div key={index} className="d-flex">
						<div className="verification_label">{key}</div>
						<div className="verification_content">
							{levelFields && renderFields(levelFields)}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default UserFeesForm;
