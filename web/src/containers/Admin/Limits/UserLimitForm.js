import React from 'react';

import renderFields from '../../../components/AdminForm/utils';
import { required } from '../../../components/Form/validations';
import STRINGS from '../../../config/localizedStrings';

const getCustomField = (key) => {
	return {
		[`${key}_custom`]: {
			type: 'text',
			validate: [required],
		},
	};
};

const UserLimitForm = ({ fields, customLevels }) => {
	return (
		<div>
			<div className="d-flex mb-2">
				<div className="verification_label">{STRINGS['USER_LEVEL']}</div>
				<div className="verification_content">{STRINGS['LIMIT_AMOUNT']}</div>
			</div>
			{Object.keys(fields).map((key, index) => {
				const levelFields = fields[key];
				let custom_Field = {};
				if (customLevels.includes(parseInt(key, 10))) {
					const customKey = Object.keys(levelFields).length
						? Object.keys(levelFields)[0]
						: key;
					custom_Field = getCustomField(customKey);
				}
				return (
					<div key={index} className="d-flex">
						<div className="verification_label">{key}</div>
						<div className="verification_content">
							{levelFields && renderFields(levelFields)}
						</div>
						<div className="verification_text">
							{customLevels.includes(parseInt(key, 10))
								? renderFields(custom_Field)
								: null}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default UserLimitForm;
