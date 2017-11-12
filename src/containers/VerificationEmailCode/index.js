import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { isUUID } from 'validator';
import { verifyVerificationCode, checkVerificationCode } from '../../actions/authAction';

import { IconTitle, Loader, Button } from '../../components';
import { FLEX_CENTER_CLASSES } from '../../config/constants';
import { TEXTS } from './constants';

class VerifyEmailCode extends Component {
  state = {
    success: false,
    errorMessage: '',
  }

  componentWillMount() {
    const { code } = this.props.params;
    if (isUUID(code)) {
      this.props.checkVerificationData({ verification_code: code });
    } else {
      this.setError(TEXTS.ERROR_UUID);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.hasValidData && !this.props.data.hasValidData) {
      this.props.verifyCode(nextProps.data.data)
    }
  }

  setError = (errorMessage = '') => {
    this.setState({ errorMessage });
  }

  onClickLogin = () => {
    this.props.router.replace('login');
  }
  render() {
    const { data: { fetching, fetched, error } } = this.props;
    const { errorMessage } = this.state;

    let childProps = {};

    if (fetching || (!fetched && !errorMessage)) {
      childProps = {
        loading: true,
        child: <Loader relative={true} background={false} />,
      };
    } else if (error || errorMessage) {
      childProps = {
        titleSection: {
          iconPath: TEXTS.ERROR.ICON,
          text: TEXTS.ERROR.TITLE,
        },
        child: (
          <div>{error || errorMessage}</div>
        )
      };
    } else {
      childProps = {
        titleSection: {
          iconPath: TEXTS.SUCCESS.ICON,
          text: TEXTS.SUCCESS.TITLE,
        },
        child: (
          <div className="text-center w-100">
            <div>{TEXTS.SUCCESS.TEXT_1}</div>
            <div>{TEXTS.SUCCESS.TEXT_2}</div>
            <Button
              label={TEXTS.SUCCESS.BUTTON}
              className="button-margin"
              onClick={this.onClickLogin}
            />
          </div>
        )
      };
    }

    return (
      <div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'f-1')}>
        <div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'w-100', { 'auth_wrapper': !childProps.loading })}>
          <IconTitle
            textType="title"
            className="w-100"
            {...childProps.titleSection}
          />
          <div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'w-100', { 'auth_form-wrapper': !childProps.loading })}>
            {childProps.child}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.auth.verification,
});

const mapDispatchToProps = (dispatch) => ({
  checkVerificationData: bindActionCreators(checkVerificationCode, dispatch),
  verifyCode: bindActionCreators(verifyVerificationCode, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmailCode);
