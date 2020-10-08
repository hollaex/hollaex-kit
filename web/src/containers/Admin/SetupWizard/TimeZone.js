import React from 'react';
import ReactSVG from 'react-svg';
import { Select, Form, Button } from 'antd';

import { minimalTimezoneSet } from '../Settings/Utils';
import LANGUAGES from '../../../config/languages';
import { ICONS } from '../../../config/constants';

const { Item } = Form;
const { Option } = Select;

const renderOptions = (values = []) => (
    values.map((value, index) => (
        <Option key={index} value={value.value}>{value.label}</Option>
    ))
);

const TimeZone = ({ initialValues, handleNext, updateConstants }) => {
    const handleSubmit = (values) => {
        const formValues = {};
        if (values.language) {
            formValues.defaults = {
                language: values.language
            }
        }
        if (values.timezone) {
            formValues.timezone = values.timezone;
        }
        updateConstants({ kit: formValues}, () => handleNext(1));
    };
    return (
        <div>
            <ReactSVG path={ICONS.TIMEZONE_WORLD_MAP} wrapperClassName="world-map" />
            <div className="form-wrapper">
                <Form
                    name='timezone'
                    initialValues={initialValues}
                    onFinish={handleSubmit}
                >
                    <div className="setup-field-wrapper setup-field-content">
                        <div className="setup-field-label">Time zone</div>
                        <Item
                            name="timezone"
                        >
                            <Select>
                                {renderOptions(minimalTimezoneSet)}
                            </Select>
                        </Item>
                        <div className="setup-field-label">Language</div>
                        <Item
                            name="language"
                        >
                            <Select>
                                {renderOptions(LANGUAGES)}
                            </Select>
                        </Item>
                    </div>
                    <div className="btn-container">
                        <Button htmlType='submit'>Proceed</Button>
                    </div>
                    <span
                        className="step-link"
                        onClick={() => handleNext(1)}
                    >
                        Skip this step
                    </span>
                </Form>
            </div>
        </div>
    );
}

TimeZone.defaultProps = {
    initialValues: {
        timezone: 'UTC',
        language: 'en'
    }
}

export default TimeZone;
