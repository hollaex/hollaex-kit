import React, { Component } from 'react';
import { TabController, CheckTitle } from '../../components';

const TABS = [
	{ title: <CheckTitle title="Email" status="completed" /> },
	{ title: <CheckTitle title="User Information" status="pending" /> },
	{ title: <CheckTitle title="Bank Information" /> },
];

class UserVerification extends Component {
	state = {
		activeTab: 0
	};

	setActiveTab = (activeTab) => {
		this.setState({ activeTab });
	}

	render() {
		const { activeTab } = this.state;
		return (
			<div>
				<TabController
					tabs={TABS}
					activeTab={activeTab}
					setActiveTab={this.setActiveTab}
				/>
			</div>
		);
	}
}

export default UserVerification;
