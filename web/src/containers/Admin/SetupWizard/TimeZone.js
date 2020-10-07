import React from 'react';
import ReactSVG from 'react-svg';
import { Select, Form, Button } from 'antd';

import { ICONS } from '../../../config/constants';

const { Item } = Form;
const { Option } = Select;

const TimeZone = () => {
    const handleSubmit = () => {
    }
    return (
        <div>
            <ReactSVG path={ICONS.TIMEZONE_WORLD_MAP} wrapperClassName="world-map" />
            <div className="form-wrapper">
                <Form name='timezone' onFinish={handleSubmit}>
                    <div className="setup-field-wrapper setup-field-content">
                        <div className="setup-field-label">Time zone</div>
                        <Item
                            name="timezone"
                        >
                            <Select>
                                <Option value="">Coordinated Universal Time (UTC)</Option>
                            </Select>
                        </Item>
                        <div className="setup-field-label">Language</div>
                        <Item
                            name="language"
                        >
                            <Select>
                                <Option value="en">English</Option>
                                <Option value="ko">Korean</Option>
                            </Select>
                        </Item>
                    </div>
                    <div className="btn-container">
                        <Button htmlType='submit'>Proceed</Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default TimeZone;
