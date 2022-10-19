import React, { Component } from 'react';
import { Tabs } from 'antd';
import { ListUsers } from '.';

const TabPane = Tabs.TabPane;

class PendingUsers extends Component {
	render() {
		return (
			<div className="app_container-content user-container">
				<Tabs>
					<TabPane tab="Pending Ids" key="PendingIds">
						<div className="m-top">
							<ListUsers
								requestUser={this.props.requestUserData}
								handleDownload={this.props.requestUsersDownload}
								columns={this.props.columns}
								type="id"
							/>
						</div>
					</TabPane>
					<TabPane tab="Pending Banks" key="Pendingbanks">
						<div className="m-top">
							<ListUsers
								requestUser={this.props.requestUserData}
								handleDownload={this.props.handleDownload}
								columns={this.props.columns}
								type="bank"
							/>
						</div>
					</TabPane>
				</Tabs>
			</div>
		);
	}
}

export default PendingUsers;
