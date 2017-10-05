import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TabController, CheckTitle } from '../../components';
import Withdraw from './Withdraw';
class Wallet extends Component {
  state = {
    activeTab: 0,
    tabs: [],
  }

  componentDidMount() {
    this.generateTabs(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.symbol !== this.props.symbol ||
      nextProps.balance[`${nextProps.symbol}_available`] !== this.props.balance[`${nextProps.symbol}_available`] ||
      nextProps.fee !== this.props.fee
    ) {
      this.generateTabs(nextProps);
    }
  }

  setActiveTab = (activeTab) => {
    this.setState({ activeTab });
  }

  generateTabs = ({ symbol, balance, fee }) => {
    const tabs = [
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
            title="Withdraw"
            icon={`${process.env.PUBLIC_URL}/assets/icons/111-03.png`}
          />
        ),
        content: (
          <Withdraw
            symbol={symbol}
            available={balance[`${symbol}_available`]}
            fee={fee}
            onSubmit={this.onSubmitWithdraw}
          />
        )
      },
    ];
    this.setState({ tabs });
  }

  renderContent = (tabs, activeTab) => tabs[activeTab].content;

  onSubmitWithdraw = (values) => {
    // TODO
    console.log(values)
  }

  render() {
    const { activeTab, tabs } = this.state;

    return (
      <div className="presentation_container">
        <TabController
          activeTab={activeTab}
          setActiveTab={this.setActiveTab}
          tabs={tabs}
          title="Wallet"
          titleIcon={`${process.env.PUBLIC_URL}/assets/icons/google.png`}
        />
        {tabs.length === 0 ?
          <div></div> :
          <div className="inner_container">{this.renderContent(tabs, activeTab)}</div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  symbol: state.orderbook.symbol,
  balance: state.user.balance,
  fee: state.user.fee,
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
