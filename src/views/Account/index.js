import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AccountBalance from './AccountBalance';
import AccountSetup from './AccountSetup';
import SecuritySetup from './SecuritySetup';
import TradeOrders from './TradeOrders';
import TradeHistory from './TradeHistory';
import BTCHistory from './BTCHistory';
import USDHistory from './USDHistory';
import './styles/account.css'

const IMG_WIDTH = '40';
const IMG_HEIGHT = '40';
const IMG_USER = require('./images/user.png');
const IMG_SUCCESS = require('./images/success.png');
const TABS = [
  { component: <AccountBalance /> },
  { component: <AccountSetup /> },
  { component: <SecuritySetup /> },
  { component: <TradeOrders /> },
  { component: <TradeHistory /> },
  { component: <USDHistory /> },
  { component: <BTCHistory /> },
];

class AccountModify extends Component {
	state = {
    activeTab: 0,
	}

  setActiveTab = (activeTab = 0) => {
    this.setState({ activeTab });
  }

  renderActiveContent = (step) => {
    return TABS[step].component;
  }

	render() {
    const { activeTab } = this.state;

		return (
			<div className='mt-5'>
		    <div className="mt-5  text-center">
		    	<div><h3>My Account</h3></div>
		    </div>
		    <div className="tradeBorder mt-5 accountContainer d-flex flex-column" >
          <div className="row justify-content-center" style={{marginTop:'-1.8rem'}}>
            {TABS.map((tab, index) => {
              return (
                <div className="p-2" key={index}>
                  <button
                    onClick={() => this.setActiveTab(index)}
                    className={activeTab === index ? 'accountActive' : 'notActive'}
                  >
                    <img
                      src={activeTab === index ? IMG_SUCCESS : IMG_USER}
                      width={IMG_WIDTH}
                      height={IMG_HEIGHT}
                      alt="tab icon"
                    />
                  </button>
                </div>
              )
            })}
          </div>
          <div className="col-xs-12 mt-5 ">
          {this.renderActiveContent(activeTab)}
          </div>
				</div>
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => ({

})

const mapStateToProps = (store, ownProps) => ({
	user: store.user
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountModify);
