import React, { Component } from 'react';
import classnames from 'classnames';
import ReactSVG from 'react-svg';

import MessageDisplay from '../../components/Dialog/MessageDisplay';
import { Button, Loader } from '../../components';
import { performConfirmWithdrawal } from '../../actions/walletActions';
import { FLEX_CENTER_CLASSES, ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

class ConfirmWithdrawal extends Component {
    state = {
        is_success: false,
        error_txt: '',
        loading: false
    };

    componentDidMount() {
        if (this.props.routeParams.token) {
            this.confirmWithdrawal(this.props.routeParams.token);
        } else {
            // TODO: this text is dummy will change to en.js after approval.
            this.setState({ error_txt: 'Invalid token Please try again.' });
        }
    }

    confirmWithdrawal = token => {
        this.setState({ loading: true });
        return performConfirmWithdrawal(token)
            .then((response) => {
                this.setState({ is_success: true, error_txt: '', loading: false });
                return response;
            })
            .catch((err) => {
                this.setState({ is_success: false, error_txt: err.message, loading: false });
                throw err;
            })
    };

    handleTransaction = () => {
        this.props.router.push('/transactions?tab=2');
    };

    render() {
        const { is_success, error_txt, loading } = this.state;
        if (loading) {
            return <Loader />;
        }
        return (
            <div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'f-1', 'withdrawal-confirm-warpper')}>
                {!is_success && error_txt 
                ? <MessageDisplay
                    iconPath={ICONS.RED_WARNING}
                    onClick={this.handleTransaction}
                    text={error_txt}
                    buttonLabel={STRINGS.WITHDRAW_PAGE.GO_WITHDRAWAL_HISTORY} />
                : <div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'f-1')}>
                    <ReactSVG
                        path={ICONS.COIN_WITHDRAW_BTC}
                        wrapperClassName="withdrawal-confirm--image"
                    />
                    <div className='withdrawal-confirm-title'>
                        {STRINGS.SUCCESS_TEXT}
                    </div>
                    <div className='text-center mb-4'>
                        <div>{STRINGS.WITHDRAW_PAGE.WITHDRAW_CONFIRM_SUCCESS_1}</div>
                        <div>{STRINGS.WITHDRAW_PAGE.WITHDRAW_CONFIRM_SUCCESS_2}</div>
                    </div>
                    <Button className='w-50' label={STRINGS.WITHDRAW_PAGE.GO_WITHDRAWAL_HISTORY} onClick={this.handleTransaction} />
                </div>
                }
            </div>
        );
    }
}

export default ConfirmWithdrawal;
