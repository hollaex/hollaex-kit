import React, { Component } from 'react';
import classnames from 'classnames';
import { ReCaptcha } from 'react-recaptcha-v3';
import { connect } from 'react-redux';

import { IconTitle, Button, Loader } from '../../components';
import { performConfirmWithdrawal } from '../../actions/walletActions';
import { FLEX_CENTER_CLASSES, ICONS, CAPTCHA_SITEKEY, DEFAULT_LANGUAGE } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

class ConfirmWithdrawal extends Component {
    state = {
        is_success: false,
        error_txt: '',
        loading: false,
        captcha: '',
        is_called: false
    };

    componentDidMount() {
        if (this.props.routeParams.token && this.state.captcha) {
            this.confirmWithdrawal(this.props.routeParams.token, this.state.captcha);
        } else if (!this.props.routeParams.token) {
            // TODO: this text is dummy will change to en.js after approval.
            this.setState({ error_txt: 'Invalid token Please try again.' });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.captcha !== this.state.captcha
            && this.state.captcha
            && this.props.routeParams.token
            && !this.state.is_called) {
                this.confirmWithdrawal(this.props.routeParams.token, this.state.captcha);
        } else if (!this.props.routeParams.token) {
            // TODO: this text is dummy will change to en.js after approval.
            this.setState({ error_txt: 'Invalid token Please try again.' });
        }
    }

    confirmWithdrawal = (token, captcha) => {
        this.setState({ loading: true, is_called: true });
        return performConfirmWithdrawal(token, captcha)
            .then((response) => {
                this.setState({ is_success: true, error_txt: '', loading: false });
                return response;
            })
            .catch((err) => {
                this.setState({ is_success: false, error_txt: err.response.data.message || err.message, loading: false });
            })
    };

    handleTransaction = () => {
        this.props.router.push('/transactions?tab=2');
    };

    setRef = (el) => {
		this.captcha = el;
	};

	onVerifyCallback = (data) => {
		this.setState({ captcha: data });
	};

	onExpiredCallback = () => {
		this.setState({ captcha: '' });
		this.captcha.execute();
	};

    render() {
        const { is_success, error_txt, loading, is_called } = this.state;
        let childProps = {};
        if (!is_called || loading) {
            childProps = {
                loading,
                child: <Loader relative={true} background={false} />
            }
        } else if (!is_success && error_txt) {
            childProps = {
                titleSection: {
                    iconPath: ICONS.RED_WARNING,
                    text: STRINGS.ERROR_TEXT
                },
                child: <div className='text-center mb-4'>
                        <div>{error_txt}</div>
                    </div>
            }
        } else {
            childProps = {
                titleSection: {
                    iconPath: ICONS.GREEN_CHECK,
                    text: STRINGS.SUCCESS_TEXT
                },
                useSvg: true,
                child: <div className='text-center mb-4'>
                    <div>{STRINGS.WITHDRAW_PAGE.WITHDRAW_CONFIRM_SUCCESS_1}</div>
                    <div>{STRINGS.WITHDRAW_PAGE.WITHDRAW_CONFIRM_SUCCESS_2}</div>
                </div>
            }
        }
        return (
            <div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'f-1', 'withdrawal-confirm-warpper')}>
                <div
                    className={classnames(
                        ...FLEX_CENTER_CLASSES,
                        'flex-column',
                        'w-100',
                        { "auth_wrapper": !loading}
                    )}
                >
                    <IconTitle
                        textType="title"
                        className="w-100"
                        {...childProps.titleSection}
                    />
                    {childProps.child}
                    {!loading && is_called &&
                        <Button
                            className='w-50'
                            label={STRINGS.WITHDRAW_PAGE.GO_WITHDRAWAL_HISTORY}
                            onClick={this.handleTransaction}
                        />
                    }
                    <ReCaptcha
						ref={this.setRef}
						sitekey={CAPTCHA_SITEKEY}
						verifyCallback={this.onVerifyCallback}
						expiredCallback={this.onExpiredCallback}
						lang={this.props.language || DEFAULT_LANGUAGE}
					/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    language: state.app.language,
});

export default connect(mapStateToProps)(ConfirmWithdrawal);
