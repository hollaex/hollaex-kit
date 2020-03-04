import React, { Component } from 'react';
import { Tabs, Row, Spin, Alert } from 'antd';

import { GeneralSettingsForm, EmailSettingsForm, SecuritySettingsForm } from './SettingsForm';
import { getConstants, updatePlugins } from './action';
import { generateAdminSettings } from './Utils';

const TabPane = Tabs.TabPane;

export default class Settings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: '',
            loading: false,
            error: '',
            constants: {},
            initialGeneralValues: {},
            initialEmailValues: {},
            initialSecurityValues: {}
        };
    }

    componentDidMount() {
        this.getConstantData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(prevState.constants) !== JSON.stringify(this.state.constants)) {
            this.getSettingsValues();
        }
    }    
    
    tabChange = (activeTab) => {
        this.setState({ activeTab });
    };

    getConstantData = () => {
        this.setState({ loading: true, error: '' });
        getConstants()
            .then((res) => {
                this.setState({ loading: false, constants: res.constants });
            })
            .catch((error) => {
                const message = error.data ? error.data.message : error.message;
                this.setState({ loading: false, error: message });
            });
    };

    getSettingsValues = () => {
        const result = generateAdminSettings();
        let initialGeneralValues = {};
        const {
            defaults = {},
            emails = {},
            secrets = { smtp: {}, captcha: {} },
            accounts = {},
            allowed_domains,
            captcha = {}
        } = this.state.constants;
        const initialEmailValues = { ...emails, ...secrets.smtp, ...accounts };
        Object.keys(result).forEach(utilsValue => {
            if (this.state.constants[utilsValue]) {
                if (utilsValue === 'valid_languages'
                    && typeof this.state.constants.valid_languages === 'string') {
                    initialGeneralValues[utilsValue] = this.state.constants[utilsValue].split(',');
                } else {
                    initialGeneralValues[utilsValue] = this.state.constants[utilsValue];
                }
            }
        });
        initialGeneralValues = { ...initialGeneralValues, ...defaults };

        let initialSecurityValues = {
            ...captcha,
            ...secrets.captcha
        }
        if (allowed_domains) {
            initialSecurityValues.allowed_domains = allowed_domains.join(',');
        }
        this.setState({ initialGeneralValues, initialEmailValues, initialSecurityValues })
    };

    submitSettings = (formProps, formKey) => {
        let formValues = {};
        if (formKey === 'general') {
            formValues = {default: {}};
            Object.keys(formProps).forEach((val) => {
                if (val === 'theme' || val === 'language' || val === 'country') {
                    formValues.default[val] = formProps[val];
                } else if (val === 'valid_languages' && typeof formProps[val] !== 'string') {
                    formValues[val] = formProps[val].join(',');
                } else if (val === 'new_user_is_activated') {
                    if (formProps[val] === 'true')
                        formValues[val] = true;
                    else
                        formValues[val] = false;
                } else {
                    formValues[val] = formProps[val];
                }
            });
        } else if (formKey === 'email') {
            formValues = { emails: {}, accounts: {}, secrets: { smtp: {} }};
            Object.keys(formProps).forEach((val) => {
                if (val === 'sender' || val === 'timezone') {
                    formValues.emails[val] = formProps[val];
                } else if (val === 'admin' || val === 'support') {
                    formValues.accounts[val] = formProps[val];
                } else if (val === 'port') {
                    formValues.secrets.smtp[val] = parseInt(formProps[val], 10);
                } else {
                    formValues.secrets.smtp[val] = formProps[val];
                }
            });
        } else if (formKey === 'security') {
            formValues = { captcha: {}, secrets: { captcha: {} }};
            Object.keys(formProps).forEach((val) => {
                if (val === 'site_key') {
                    formValues.captcha[val] = formProps[val];
                } else if (val === 'secret_key') {
                    formValues.secrets.captcha[val] = formProps[val];
                } else {
                    formValues[val] = formProps[val];
                }
            });
        }
        this.setState({ loading: true, error: '' });
        updatePlugins(formValues)
            .then((res) => {
                this.setState({ loading: false, constants: res });
            })
            .catch((error) => {
                const message = error.data ? error.data.message : error.message;
                this.setState({ loading: false, error: message });
            });
    };

    render() {
        const { loading, error, initialGeneralValues, initialEmailValues, initialSecurityValues } = this.state;
        return (
            <div className="app_container-content">
                <h1>Settings</h1>
                {error && (
					<Alert
						message="Error"
						className="m-top"
						description={error}
						type="error"
						showIcon
					/>
				)}
                {loading ? (
                    <Spin size="large" />
                ) : (
                    <Tabs onChange={this.tabChange}>
                        <TabPane tab={'General'} key={'general'}>
                            <Row>
                                <GeneralSettingsForm
                                    initialValues={initialGeneralValues}
                                    handleSubmitSettings={this.submitSettings} />
                            </Row>
                        </TabPane>
                        <TabPane tab={'Email'} key={'email'}>
                            <Row>
                                <EmailSettingsForm
                                    initialValues={initialEmailValues}
                                    handleSubmitSettings={this.submitSettings} />
                            </Row>
                        </TabPane>
                        <TabPane tab={'Security'} key={'security'}>
                            <Row>
                                <SecuritySettingsForm
                                    initialValues={initialSecurityValues}
                                    handleSubmitSettings={this.submitSettings} />
                            </Row>
                        </TabPane>
                    </Tabs>
                )}
            </div>
        )
    }
}
