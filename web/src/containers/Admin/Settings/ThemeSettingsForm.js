import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';
import { Button } from 'antd';

import renderFields from '../../../components/AdminForm/utils';
import { getThemeFields } from './Utils';

const ThemeHocForm = (formName = 'THEME_COMMON_FORM') => {
	const ThemeForm = ({
		themeKey = 'miscellaneous',
		handleSubmit,
		handleSubmitSettings,
		error,
		pristine,
		submitting,
		valid,
		formValues,
		coins = {},
	}) => {
		const renderPrefix = (value = '#ffffff') => {
			return (
				<div
					style={{
						width: '1rem',
						height: '1rem',
						border: '1px solid',
						backgroundColor: value,
					}}
				/>
			);
		};
		let fields = getThemeFields(formValues, renderPrefix, themeKey, coins);
		const onSubmit = (formProps) => handleSubmitSettings(formProps, themeKey);

		return (
			<div>
				<form>
					{fields &&
						Object.keys(fields).map((key, index) => {
							let field = fields[key] ? fields[key] : {};
							return (
								<div key={index} className="d-flex">
									{renderFields(field)}
								</div>
							);
						})}
					{error && (
						<div>
							<strong>{error}</strong>
						</div>
					)}
					<Button
						type={'primary'}
						onClick={handleSubmit(onSubmit)}
						disabled={(fields && pristine) || submitting || !valid || error}
						size="large"
						className={'w-100'}
					>
						Save
					</Button>
				</form>
			</div>
		);
	};

	const ThemeSettingsForm = reduxForm({
		form: formName,
		enableReinitialize: true,
	})(ThemeForm);

	const mapStateToProps = (state) => ({
		formValues: getFormValues(formName)(state),
		coins: state.app.coins,
	});

	return connect(mapStateToProps)(ThemeSettingsForm);
};

export default ThemeHocForm;
