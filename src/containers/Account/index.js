import React, { Component} from 'react';
import { connect } from 'react-redux';
import { TabController, CheckTitle } from '../../components';

const TABS = [
  {
    title: (
      <CheckTitle
        title="Verification"
        icon={`${process.env.PUBLIC_URL}/assets/icons/111-04.png`}
        notification={true}
      />
    ),
    content: (
      <div>Verification</div>
    )
  },
  {
    title: (
      <CheckTitle
        title="Security"
        icon={`${process.env.PUBLIC_URL}/assets/icons/111-05.png`}
      />
    ),
    content: (
      <div>Security</div>
    )
  },
  {
    title: (
      <CheckTitle
        title="Notifications"
        icon={`${process.env.PUBLIC_URL}/assets/icons/111-03.png`}
      />
    ),
    content: (
      <div>Notifications</div>
    )
  },
];

class Account extends Component {
  state = {
    activeTab: 0,
    tabs: TABS,
  }

  setActiveTab = (activeTab) => {
    this.setState({ activeTab });
  }

  renderContent = (tabs, activeTab) => tabs[activeTab].content;

  render() {
    const { activeTab, tabs } = this.state;

    return (
      <div className="presentation_container">
        <TabController
          activeTab={activeTab}
          setActiveTab={this.setActiveTab}
          tabs={tabs}
          title="Account"
          titleIcon={`${process.env.PUBLIC_URL}/assets/icons/google.png`}
        />
        <div className="inner_container">{this.renderContent(tabs, activeTab)}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(Account);
