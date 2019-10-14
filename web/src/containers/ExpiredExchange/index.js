import React, { Component } from 'react';
import classnames from 'classnames';
import ReactSvg from 'react-svg';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import { ICONS, FLEX_CENTER_CLASSES, EXCHANGE_URL, EXCHANGE_EXPIRY_DAYS } from '../../config/constants';
import { getExchangeInfo } from '../../actions/appActions';
import STRINGS from '../../config/localizedStrings';
import { Button } from '../../components';

class Expired extends Component {
    
    componentDidMount() {
        this.props.getExchangeInfo();
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.info) !== JSON.stringify(prevProps.info)) {
            if ((this.props.info.is_trial && moment().diff(this.props.info.created_at, 'days') < EXCHANGE_EXPIRY_DAYS)
                || !this.props.info.is_trial) {
                this.props.router.replace('/account');
            }
        }
    }    
    
    render() {
        return (
            <div className={classnames("expired_exchange_wrapper", "h-100", "flex-column", ...FLEX_CENTER_CLASSES)}>
                <div>
                    <ReactSvg path={ICONS.EXPIRED_ICON} wrapperClassName="expired_img_icon" />
                </div>
                <div className="expired_text mt-5">
                    {STRINGS.EXPIRED_INFO_1}
                </div>
                <div className="expired_text">
                    {STRINGS.EXPIRED_INFO_2}
                </div>
                <div className="expired_button">
                    <a href={EXCHANGE_URL}>
                        <Button label={STRINGS.EXPIRED_BUTTON_TXT} />
                    </a>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store) => ({
    info: store.app.info
});

const mapDispatchToProps = (dispatch) => ({
    getExchangeInfo: bindActionCreators(getExchangeInfo, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Expired);