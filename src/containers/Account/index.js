import React, { Component} from 'react';
import { connect } from 'react-redux';
import { TabController, CheckTitle } from '../../components';
import { UserVerification } from '../'

const TABS = [
  {
    title: (
      <CheckTitle
        title="Verification"
        icon={`${process.env.PUBLIC_URL}/assets/acounts/account-icons-02.png`}
        notifications={1}
      />
    ),
    content: <UserVerification />
  },
  {
    title: (
      <CheckTitle
        title="Security"
        icon={`${process.env.PUBLIC_URL}/assets/acounts/account-icons-03.png`}
        notifications={1}
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
        icon={`${process.env.PUBLIC_URL}/assets/acounts/account-icons-04.png`}
        notifications={1}
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
          titleIcon={`${process.env.PUBLIC_URL}/assets/acounts/account-icons-01.png`}
        />
        <div className="inner_container">{this.renderContent(tabs, activeTab)}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(Account);
