import React from 'react';
import { reduxForm } from 'redux-form';

import renderFields from 'components/Form/factoryFields';

class AssetsBlockForm extends React.Component {
  render() {
    const {
      handleCheck,
    } = this.props;

    const AssetsBlockFields = {
      ZeroBalance: {
        type: 'checkbox',
        label: 'Hide zero balance',
        onChange: handleCheck,
        name: 'ZeroBalance',
        reverse: true
      }
    };

    return renderFields(AssetsBlockFields);
  }
}

export default reduxForm({
  form: 'AssetsBlockForm',
  initialValues: { ZeroBalance: true },
})(AssetsBlockForm);
