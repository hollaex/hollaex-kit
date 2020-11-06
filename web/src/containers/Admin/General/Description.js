import React, { Component } from 'react';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { AdminHocForm } from '../../../components';
import { ICONS } from '../../../config/constants';

const DescriptionForm = AdminHocForm('DescriptionForm');
const FooterTextForm = AdminHocForm('FooterDescriptionForm');

class Description extends Component {

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
        const {
            descriptionFields,
            descriptionInitialValues,
            footerFields,
            footerInitialValues
        } = this.props;
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
                <DescriptionForm
                    initialValues={descriptionInitialValues}
                    fields={descriptionFields}
                    onSubmit={this.props.handleSubmitDescription}
                    buttonText="Save"
                    buttonClass="green-btn minimal-btn"
                />
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
                <FooterTextForm
                    initialValues={footerInitialValues}
                    fields={footerFields}
                    onSubmit={this.props.handleSubmitDescription}
                    buttonText="Save"
                    buttonClass="green-btn minimal-btn"
                />
            </div>
        );
    }
}

export default Description;
