import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import { Checkbox, Button } from 'antd';

import { toggleTool } from 'actions/toolsAction';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

class ToolsSelector extends Component {
	resetLayout = () => {
		const event = new Event('resetlayout');
		document.dispatchEvent(event);
	};

	render() {
		const { tools, toggleTool } = this.props;

		return (
			<div className={classnames('app-bar-add-tab-menu', 'narrow')}>
				<div className="app-bar-add-tab-content">
					{Object.entries(tools).map(([key, { is_visible, is_enabled }]) => {
						const stringId = `TOOLS.${key.toUpperCase()}`;
						return (
							<div className="d-flex pl-2 pointer">
								<Checkbox
									checked={is_visible}
									disabled={!is_enabled}
									onChange={() => toggleTool(key)}
								>
									{STRINGS[stringId]}
								</Checkbox>
							</div>
						);
					})}
					<div className="d-flex justify-content-center p-3">
						<Button className="important-text" onClick={this.resetLayout} ghost>
							Reset Layout
						</Button>
					</div>
				</div>
			</div>
		);
	}
}
const mapStateToProps = (state) => ({
	tools: state.tools,
});

const mapDispatchToProps = (dispatch) => ({
	toggleTool: bindActionCreators(toggleTool, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(ToolsSelector));
