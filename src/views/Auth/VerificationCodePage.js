import React, { Component } from 'react';
import { Link } from 'react-router'

export default class VerificationCodePage extends Component {
  componentWillMount() {
    this.props.checkVerification({ verification_code: this.props.code });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.hasValidData && !this.props.data.hasValidData) {
      this.props.verifyCode(nextProps.data.data)
    }
  }

  render() {
    const { fetching, error, fetched, data } = this.props.data;
    if (fetching) {
      return <div className='text-center'>Loading</div>
    }

    return (
      <div className='text-center'>
        {error && <div className='text-center'>{error}</div>}
        {fetched &&  <div className='text-center'>Verification completed</div>}
        <div><Link to='/login'>Go to Login</Link></div>
      </div>
    );
  }
}
