import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tag, Modal } from 'antd';
import { bindActionCreators } from 'redux';
import { SubmissionError } from 'redux-form';

import PluginForm from './pluginForm';
import { updatePlugins } from './action';
import { allPluginsData } from './Utils';
import { setConfig } from '../../../actions/appActions';

class PluginServices extends Component {
    constructor(props) {
        super(props)
        this.state = {
            services: '',
            formService: '',
            isOpenConfirm: false,
            title: '',
            connectStatus: false,
            initialValues: {}
        };
    }

    componentDidMount() {
        if (this.props.params)
            this.getServices(this.props.params.services);
        this.getConnectionStatus(this.props.params.services);
    }

    componentDidUpdate(prevProps) {
        if ((JSON.stringify(this.props.params) !== JSON.stringify(prevProps.params)
            || JSON.stringify(this.props.constants) !== JSON.stringify(prevProps.constants))
            && this.props.params.services) {
            this.getServices(this.props.params.services);
            this.getConnectionStatus(this.props.params.services);
        }
    }

    getServices = (services = '') => {
        const pluginData = allPluginsData[services] || {}
        const title = pluginData.title ? pluginData.title : '';
        this.setState({ services, title });
    };

    handleDeactivate = () => {
        this.setState({ isOpenConfirm: !this.state.isOpenConfirm });
    };

    handleSubmitPlugins = (formProps, service, status) => {
        const { plugins = { enabled: '', configuration: {} }, secrets = { plugins: {} } } = this.props.constants;
        const enabled = !plugins.enabled.includes(service)
            ? `${plugins.enabled},${service}` : plugins.enabled;
        let formValues = {
            plugins: {
                ...plugins,
                enabled
            },
            secrets: {
                ...secrets,
            }
        };
        if (service === 'vault') {
            let vaultData = formProps;
            if (!formValues.secrets[service] || !formValues.secrets[service].connected_coins) {
                vaultData.connected_coins = [];
            }
            formValues.secrets[service] = vaultData;
        } else if (service !== 'bank' && service !== 'chat' && service !== 'zendesk') {
            const { key, secret, auth, ...rest } = formProps;
            const pluginData = allPluginsData[service] || {};
            if (pluginData.key === 's3') {
                formValues.plugins.configuration[pluginData.key] = rest;
                formValues.secrets.plugins[pluginData.key] = {
                    key: { read: key, write: key },
                    secret: { read: secret, write: secret }
                };
            } else if (pluginData.key === 'freshdesk') {
                formValues.plugins.configuration[pluginData.key] = rest;
                formValues.secrets.plugins[pluginData.key] = { key, auth };
            } else {
                formValues.plugins.configuration[pluginData.key] = rest;
                formValues.secrets.plugins[pluginData.key] = { key, secret };
            }
        }
        return this.updateConstants(formValues);
    };

    disconnectService = (service) => {
        const { plugins = { configuration: {} }, secrets = { plugins: {} } } = this.props.constants;
        let enabled = plugins.enabled;
        if (plugins.enabled.includes(service)) {
            let temp = plugins.enabled.split(',');
            enabled = temp.filter(val => val !== service).join(',');
        }
        let formValues = {
            plugins: {
                ...plugins,
                enabled,
                configuration: {}
            },
            secrets: {
                ...secrets,
                plugins: {}
            }
        }
        if (service === 'vault') {
            const { vault, ...rest } = secrets;
            formValues.secrets = rest;
        } else {
            const pluginData = allPluginsData[service] || {};
            Object.keys(plugins.configuration).forEach(config => {
                if (config !== pluginData.key) {
                    formValues.plugins.configuration[config] = plugins.configuration[config];
                }
            });
            Object.keys(secrets.plugins).forEach(config => {
                if (config !== pluginData.key) {
                    formValues.secrets.plugins[config] = secrets.plugins[config];
                }
            });
        }
        this.updateConstants(formValues, true);
        this.handleDeactivate();
    };

    updateConstants = (formProps, disableError = false) => {
        return updatePlugins(formProps)
            .then((data) => {
                this.props.setConfig(data);
            })
            .catch((error) => {
                const _error = error.data ? error.data.message : error.message;
                if (!disableError) {
                    throw new SubmissionError({ _error });
                }
            });
    };

    getConnectionStatus = (service) => {
        const { secrets = {}, plugins = {} } = this.props.constants;
        const pluginData = allPluginsData[service] || {};

        let connectStatus = false;
        let initialValues = {}
        if (service === 'vault' && secrets[service]) {
            connectStatus = true;
            initialValues = secrets[service];
        } else if ((service === 'bank' || service === 'chat') && plugins.enabled) {
            if (plugins.enabled.includes(service)) {
                connectStatus = true;
                initialValues = {};
            }
        } else {
            if (pluginData.key &&
                plugins.configuration &&
                plugins.configuration[pluginData.key]
            ) {
                initialValues = {
                    ...plugins.configuration[pluginData.key]
                }
                if (secrets.plugins &&
                    secrets.plugins[pluginData.key]) {
                        connectStatus = true;
                        let temp = secrets.plugins[pluginData.key];
                        initialValues = {
                            ...initialValues,
                            ...secrets.plugins[pluginData.key]
                        }
                        if (pluginData.key === 's3' && Object.keys(temp).length) {
                            Object.keys(temp).forEach(data => {
                                initialValues = {
                                    ...initialValues,
                                    [data]: temp[data].write ? temp[data].write : temp[data].read
                                }
                            })
                        }
                }
            }
        }
        this.setState({ connectStatus, initialValues });
    };

    render() {
        const { title, services, connectStatus, initialValues } = this.state;
        return (
            <div className="app_container-content">
                <div className="d-flex align-items-center">
                    <h1>{title}</h1>
                    <div className="mx-4">
                        <Tag color={connectStatus ? 'green' : 'red'}>
                            {connectStatus ? 'Activated' : 'Deactivated'}
                        </Tag>
                    </div>
                </div>
                <PluginForm
                    connectStatus={connectStatus}
                    initialValues={initialValues}
                    services={services}
                    handleSubmitPlugins={this.handleSubmitPlugins}
                    handleDeactivate={this.handleDeactivate}
                />
                <Modal
                    title={`Deactivate ${title}`}
                    visible={this.state.isOpenConfirm}
                    onOk={() => this.disconnectService(services)}
                    onCancel={this.handleDeactivate}
                >
                    <div>Do you really want to Deactivate?</div>
                </Modal>
            </div>
        )
    }
};

const mapStateToProps = (state) => ({
    constants: state.app.constants
});

const mapDispatchToProps = (dispatch) => ({
    setConfig: bindActionCreators(setConfig, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(PluginServices);
