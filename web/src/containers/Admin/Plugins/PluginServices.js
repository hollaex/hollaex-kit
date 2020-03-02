import React, { Component } from 'react';
import { connect } from 'react-redux';

import ServiceDisplay from './ServiceDisplay';
import { updatePlugins } from './action';
import { allPluginsData, getPluginsForm } from './Utils';
import { ModalForm } from '../../../components';

const Form = ModalForm('PLUGINS_UPDATE_FORM');

class PluginServices extends Component {
    constructor(props) {
		super(props)
		this.state = {
            services: '',
            formService: '',
            isFormOpen: false,
            title: ''
		};
	}
    
    componentDidMount() {
        if (this.props.params)
            this.getServices(this.props.params.services);
    }

    componentDidUpdate(prevProps) {
        if ((JSON.stringify(this.props.params) !== JSON.stringify(prevProps.params)
                || JSON.stringify(this.props.constants) !== JSON.stringify(prevProps.constants))
            && this.props.params.services) {
            this.getServices(this.props.params.services);
        }
    }

    getServices = (services = '') => {
        const pluginData = allPluginsData[services] || {}
        const title = pluginData.title ? pluginData.title : '';
        const formData = getPluginsForm('', true);
        if (!Object.keys(formData).includes(services)) {
            this.props.router.push('/admin/plugins');
        }
        this.setState({ services, title });
    };

    handleSubmitPlugins = (key) => (formProps) => {
        const plugins = this.props.constants && this.props.constants.plugins
            ? this.props.constants.plugins
            : { configuration: {} };
		let formValues = {
			plugins: {
                ...plugins,
				configuration: {
                    ...plugins.configuration,
					[key]: formProps
				}
			}
		};
		updatePlugins(formValues)
			.then((data) => {
				console.log('data', data);
			})
			.catch((error) => {
				console.log('error', error);
			});
    };
    
    handleForm = (service) => {
        this.setState({ isFormOpen: !this.state.isFormOpen });
    };

    disconnectService = () => {
        console.log('disconnect');
    };
    
    render() {
        const { isFormOpen, title, services } = this.state;

        return (
            <div className="app_container-content">
				<h1>Plugins</h1>
                <ServiceDisplay
                    title={title}
                    constants={this.props.constants}
                    services={services}
                    handleForm={this.handleForm}
                    disconnectService={this.disconnectService} />
                <Form
					visible={isFormOpen}
					title={title}
					okText="Save"
					fields={getPluginsForm(services)}
					onSubmit={this.handleSubmitPlugins(services)}
					onCancel={this.handleForm}
				/>
            </div>
        )
    }
};

const mapStateToProps = (state) => ({
	constants: state.app.constants
});

export default connect(mapStateToProps)(PluginServices);
