import React, { Component } from 'react';
import { Form, Input, Button, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { ICONS } from '../../../config/constants';

const { Item } = Form;
const { TextArea } = Input;

const DescriptionForm = ({ handleSubmit }) => {
    return (
        <Form onSubmit={handleSubmit}>
            <Item name="description">
                <div className="sub-title">Write description</div>
                <TextArea rows={3} placeholder="Write a short description or slogan..." />
            </Item>
            <Button block type="primary" htmlType="submit">
                Save
            </Button>
        </Form>
    );
};

const FooterTextForm = ({ handleSubmit }) => {
    return (
        <Form onSubmit={handleSubmit}>
            <Item name="footer_text">
                <div className="sub-title">Small text</div>
                <TextArea rows={3} placeholder="Write your small text filler" />
            </Item>
            <Button block type="primary" htmlType="submit">
                Save
            </Button>
        </Form>
    );
};

class Description extends Component {
    handleSubmitDescription = async (e) => {
        e.preventDefault();
    };
    
    handleSubmitFooter = async (e) => {
        e.preventDefault();
    };

    handleImg = (type) => {
        return (
             type === 'description'
                ? <img
                    src={ICONS.HELP_DESCRIPTION_POPUP} 
                    className="help-icon description_note"
                    alt="description_note"
                />
                : type === 'footer' 
                    ? <img
                        src={ICONS.HELP_FOOTER_POPUP} 
                        className="help-icon description_footer"
                        alt="footer"
                    />
                : null
        )  
    }
        
    render() {
        return (
            <div className="description-wrapper">
                <div>
                    <h3>
                        Exchange description{' '}
                        <Tooltip 
                            title={this.handleImg('description')}
                            placement="right"
                        >
                            <QuestionCircleOutlined style={{ color: '#ffffff' }} />
                        </Tooltip>
                    </h3>
                </div>
                <p>Write a short description or slogan for your project that will be displayed in the footer near your logo.</p>
                <DescriptionForm handleSubmit={this.handleSubmitDescription} />
                <div className="divider"></div>
                <div>
                    <h3>
                        Footer small text{' '}
                        <Tooltip 
                            title={this.handleImg('footer')}
                            placement="right"
                        >
                            <QuestionCircleOutlined style={{ color: '#ffffff' }} />
                        </Tooltip>
                    </h3>
                </div>
                <p>Small text often used for copywrite or other business data</p>
                <FooterTextForm handleSubmit={this.handleSubmitFooter} />
            </div>
        );
    }
}

export default Description;
