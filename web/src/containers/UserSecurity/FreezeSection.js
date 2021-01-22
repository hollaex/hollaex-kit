import React from 'react';
import { FieldError } from '../../components/Form/FormFields/FieldWrapper';
import { Button } from '../../components';
import STRINGS from '../../config/localizedStrings';

export const FreezeSection = ({ handleSubmit }) => (
	<div>
		<div className="mb-2">
			{STRINGS.ACCOUNT_SECURITY.FREEZE.CONTENT.MESSAGE_1}
		</div>
		<div className="mb-2">
			<FieldError
				error={STRINGS.ACCOUNT_SECURITY.FREEZE.CONTENT.WARNING_1}
				displayError={true}
				className="input_block-error-wrapper apply_rtl warning_text"
			/>
			<div className="mb-4 mt-4 blue-link pointer">
				<Button onClick={handleSubmit} label={'PROCEED'} />
			</div>
		</div>
	</div>
);
