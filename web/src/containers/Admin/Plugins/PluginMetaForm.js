import React from 'react';
import { Button } from 'antd';
import renderFields from 'components/AdminForm/utils';
import { reduxForm, reset, FormSection } from 'redux-form';


const Form = ({
    handleSubmit,
    onSaveMeta,
    publicMetaFields,
    metaFields,
    pristine,
    submitting,
    valid,
    error
}) => {
    const onSubmit = (formProps) => {
        return onSaveMeta(formProps);
    };
    return (
        <form>
            <div className="mt-5">
                <FormSection name="public_meta">
                    {Object.keys(publicMetaFields).length
                        ?
                        <div>
                            <div className="mb-2">Public</div>
                            {renderFields(publicMetaFields)}
                        </div>
                        : null
                    }
                </FormSection>
                <FormSection name="meta">
                    {Object.keys(metaFields).length
                        ?
                        <div>
                            <div className="config-content mb-2 mt-5">Private</div>
                            {renderFields(metaFields)}
                        </div>
                        : null
                    }
                </FormSection>
            </div>
            <Button
                type={'primary'}
                onClick={handleSubmit(onSubmit)}
                disabled={pristine || submitting || !valid || error}
                size="large"
                className={'green-btn w-100'}
            >
                Save
            </Button>
        </form>
    );
};

const PluginMetaForm = reduxForm({
    form: 'PluginMetaForm',
    onSubmitSuccess: (result, dispatch) =>
        dispatch(reset('PluginMetaForm')),
    enableReinitialize: true,
})(Form);

export default PluginMetaForm;