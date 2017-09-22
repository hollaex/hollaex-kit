import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TabController, CheckTitle } from '../../components';

const TABS = [
  {
    title: (
      <CheckTitle
        title="Balance"
        icon={`${process.env.PUBLIC_URL}/assets/icons/111-03.png`}
        notification={true}
      />
    ),
    content: (
      <div>Balance</div>
    )
  },
  {
    title: (
      <CheckTitle
        title="Orders"
        icon={`${process.env.PUBLIC_URL}/assets/icons/111-03.png`}
      />
    ),
    content: (
      <div>Orders</div>
    )
  },
  {
    title: (
      <CheckTitle
        title="Trades"
        icon={`${process.env.PUBLIC_URL}/assets/icons/111-03.png`}
      />
    ),
    content: (
      <div>Trades</div>
    )
  },
];

class Wallet extends Component {
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
          tabs={TABS}
          title="Wallet"
          titleIcon={`${process.env.PUBLIC_URL}/assets/icons/google.png`}
        />
        <div className="inner_container">{this.renderContent(tabs, activeTab)}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(Wallet);
