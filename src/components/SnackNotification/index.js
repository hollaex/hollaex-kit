import React, { Component } from 'react';
import ReactSVG from 'react-svg';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import { isMobile } from 'react-device-detect';

import { ICONS } from '../../config/constants';
import SnackDialog from './SnackDialog';
import { closeSnackNotification } from '../../actions/appActions';

let timeout = '';
let closeTimeOut = '';
class SnackNotification extends Component {
    state = {
        closeSnack: false
    }

    componentDidMount() {
        document.addEventListener('click', this.onOutsideClick);
    }

    onOutsideClick = event => {
        const element = document.getElementById('snack-dialog');
        if (element &&
            event.target !== element &&
            !element.contains(event.target)) {
            this.props.closeSnackNotification();
        }
    };
    
    componentWillReceiveProps(nextProps) {
        if (this.props.snackProps.showSnack !== nextProps.snackProps.showSnack
            && nextProps.snackProps.showSnack) {
                this.setState({ closeSnack: false });
                closeTimeOut = setTimeout(() => {
                    this.setState({ closeSnack: true });
                }, 1200);
                timeout = setTimeout(() => {
                    if (!nextProps.snackProps.isDialog)
                        this.props.closeSnackNotification();
                }, 2000);
        }
    }

    componentWillUnmount() {
        if (timeout) clearTimeout(timeout);
        if (closeTimeOut) clearTimeout(closeTimeOut);
    }
    
    render() {
        const { snackProps } = this.props;
        if (!snackProps.showSnack) {
            return null;
        }
        if (snackProps.isDialog) {
            return <div
                id="snack-dialog"
                className={
                    classnames(
                        "snack_dialog-wrapper",
                        "d-flex",
                        {
                            "snack_dialog_open": snackProps.showSnack,
                            "snack_dialog_close": this.state.closeSnack,
                        }
                    )
                }>
                <SnackDialog {...snackProps} />
                <div className="close-dialog pointer" onClick={this.props.closeSnackNotification}>
                    <ReactSVG
                        path={ICONS.CANCEL_CROSS_ACTIVE}
                        wrapperClassName="bar-icon-back"
                    />
                </div>
            </div>
        }
        return (
            <div className={
                classnames(
                    "snack_notification-wrapper",
                    "d-flex",
                    "align-items-center",
                    {
                        "mobile-notification": isMobile,
                        "snack_open": snackProps.showSnack,
                        "snack_close": this.state.closeSnack,
                    }
                )}>
                <div>
                    {snackProps.icon
                        ? snackProps.useSvg
                            ? <ReactSVG path={snackProps.icon} wrapperClassName="notification-icon mx-2" />
                            : <img src={snackProps.icon} className="notification-icon mx-2" alt="notification-icon" />
                        : null
                    }
                </div>
                <div className="notification-text mx-3">{snackProps.content}</div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    snackProps: state.app.snackNotification
});

const mapDispatchToProps = (dispatch) => ({
    closeSnackNotification: bindActionCreators(closeSnackNotification, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SnackNotification);