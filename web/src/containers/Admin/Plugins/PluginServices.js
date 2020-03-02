import React, { Component } from 'react';

import { S3Form, SNSForm, Freshdesk } from './pluginForm';

export default class PluginServices extends Component {
    constructor(props) {
		super(props)
		this.state = {
            services: '',
            ServiceDisplay: null
		};
	}
    
    componentDidMount() {
        if (this.props.params)
            this.getServices(this.props.params.services);
    }

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(this.props.params) !== JSON.stringify(prevProps.params)
            && prevProps.params.services) {
            this.getServices(prevProps.params.services);
        }
    }

    getServices = (services = '') => {
        let ServiceDisplay = null;
        switch(services) {
            case 's3':
                ServiceDisplay = <S3Form handleSubmitVault={this.handleSubmitVault} />;
                break;
            case 'sns':
                ServiceDisplay = <SNSForm handleSubmitVault={this.handleSubmitVault} />;
                break;
            case 'freshdesk':
                ServiceDisplay = <Freshdesk handleSubmitVault={this.handleSubmitVault} />;
                break;
            default:
                ServiceDisplay = <div>{services}</div>;
        }
        this.setState({ services, ServiceDisplay });
    };
    
    render() {
        const { ServiceDisplay } = this.state;
        return (
            <div>
                {ServiceDisplay}
            </div>
        )
    }
};
