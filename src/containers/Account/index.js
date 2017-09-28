import React, { Component} from 'react';
import { connect } from 'react-redux';
import { TabController, CheckTitle } from '../../components';
import { UserVerification, UserSecurity } from '../';

class Account extends Component {
  state = {
    activeTab: -1,
    tabs: [],
  }

  componentDidMount() {
    if (this.props.id) {
      this.updateTabs(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.updateTabs(this.props);
    }
  }

  updateTabs = ({ verification_level, otp_enabled }) => {
    const activeTab = this.state.activeTab > -1 ? this.state.activeTab : 0;
    const tabs = [
      {
        title: (
          <CheckTitle
            title="Verification"
            icon={`${process.env.PUBLIC_URL}/assets/acounts/account-icons-02.png`}
            notifications={verification_level < 3 ? '!' : ''}
          />
        ),
        content: <UserVerification />
      },
      {
        title: (
          <CheckTitle
            title="Security"
            icon={`${process.env.PUBLIC_URL}/assets/acounts/account-icons-03.png`}
            notifications={!otp_enabled ? '!' : ''}
          />
        ),
        content: (
          <UserSecurity />
        )
      },
      {
        title: (
          <CheckTitle
            title="Notifications"
            icon={`${process.env.PUBLIC_URL}/assets/acounts/account-icons-04.png`}
          />
        ),
        content: (
          <div>Notifications</div>
        )
      },
    ];

    this.setState({ tabs, activeTab });
  }

  setActiveTab = (activeTab) => {
    this.setState({ activeTab });
  }

  renderContent = (tabs, activeTab) => tabs[activeTab].content;

  render() {
    const { id } = this.props;

    if (!id) {
      return <div>Loading</div>;
    }

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
        <div className="inner_container">{activeTab > -1 && this.renderContent(tabs, activeTab)}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  verification_level: state.user.verification_level,
  otp_enabled: state.user.userData.otp_enabled || false,
  id: state.user.id,
});

export default connect(mapStateToProps)(Account);
