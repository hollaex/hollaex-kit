import React, { Component } from 'react';
import { message } from 'antd';

import { getPlugin } from '../Plugins/action';
import { TOKEN_KEY, PLUGIN_URL } from '../../../config/constants';

class PluginConfig extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            myPlugins: [],
        };
    }

    componentDidMount() {
        window.plugin_key = TOKEN_KEY;
        window.plugin_url = PLUGIN_URL;
        this.getMyPlugins();
    };

    componentDidUpdate(prevProps) {
        if (this.props.params !== prevProps.params) {
            this.getMyPlugins();
        }
    }

    getMyPlugins = () => {
        const { params = {} } = this.props;
        return getPlugin(params)
            .then((res) => {
                if (res) {
                    this.setState({ myPlugins: res });
                }
            })
            .catch((err) => {
                let error = err && err.data ? err.data.message : err.message;
                message.error(error);
            });
    };

    render() {
        const { myPlugins } = this.state;
        return (
            <div className="w-100 mt-5 pb-5">
                <div className="mt-5 h-100">
                    <iframe
                        title="test"
                        srcDoc={myPlugins.admin_view}
                        className="plugin-script-container w-100 h-100"
                    />
                </div>
            </div>
        );
    }
}

export default PluginConfig;
