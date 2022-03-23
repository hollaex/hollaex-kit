import React from 'react';
import { reduxForm } from 'redux-form';

import renderFields from 'components/Form/factoryFields';

const isHide = localStorage.getItem('isZeroBalanceHidden');

class AssetsBlockForm extends React.Component {
	render() {
		const { handleCheck, label } = this.props;
		const isZeroBalanceHidden = isHide === 'false' ? false : true;

		const AssetsBlockFields = {
			ZeroBalance: {
				type: 'toggle',
				label,
				onChange: handleCheck,
				name: 'ZeroBalance',
				reverse: true,
				// isHideToggleText: true,
				isZeroBalanceHidden
			},
		};

		return renderFields(AssetsBlockFields);
	}
}
const AssetsBlockWrapper = reduxForm({
	form: 'AssetsBlockForm',
})(AssetsBlockForm);

AssetsBlockWrapper.defaultProps = {
	initialValues: {
		ZeroBalance: false,
	},
};

export default AssetsBlockWrapper;
