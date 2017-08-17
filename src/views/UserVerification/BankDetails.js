import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router'
import VerifiedStatus from './VerifiedStatus'
import { renderText } from './ReduxFields';
import { userIdentity } from '../../actions/userAction'

const validate = formProps => {
  const errors = {}
  if (!formProps.bankName) {
    errors.bankName = 'Required'
  }
  if (!formProps.accountOwner) {
    errors.accountOwner = 'Required'
  }
  if (!formProps.accountNumber) {
    errors.accountNumber = 'Required'
  }
  if (!formProps.bsb) {
    errors.bsb = 'Required'
  }
   if (!formProps.content) {
    errors.content = 'Required'
  }
  return errors
}
class BankDetails extends Component {
	state={
		inProcess:true,
	}
	render() {
		const { handleSubmit } = this.props;
		const onSubmit = formProps => {
			var userRequest={
            	bank_name:formProps.bankName,
				bank_account_number:formProps.accountNumber,
            }
            this.props.userIdentity(userRequest)
            this.setState({
				inProcess:false
			})
	     }
		return (
			<div className="mb-5">
				{ this.state.inProcess?
					<form onSubmit={ handleSubmit(onSubmit)}>
				        <Field
				            name="bankName"
				            component={ renderText }
				            type="text"
				            label="BANK NAME"
				            style={{width:'35%'}}
				        />
						<Field
				            name="accountOwner"
				            component={ renderText }
				            type="text"
				            label="BANK ACCOUNT OWNER'S NAME"
				            style={{width:'35%'}}
				        />
				        <Field
				            name="accountNumber"
				            component={ renderText }
				            type="text"
				            label="BANK ACCOUNT NUMBER"
				            style={{width:'35%'}}
				        />
				        <Field
				            name="bsb"
				            component={ renderText }
				            type="text"
				            label="BSB"
				            style={{width:'35%'}}
				        />
				        <div className="mt-5">
				        	<button type="submit" className="activeButton" style={{width:'40%'}} >
				        		SUBMIT VERIFICATION REQUEST
				        	</button>
				        </div>
				        <div className="mt-4">
				        	Want to add an international bank account? 
				        	<Link to='/dashboard/support'>Contact customer support.</Link>
				        </div>
				    </form>    
				    :
				    <VerifiedStatus verify="BANK DETAILS" level="3"/>
				}
				
			</div>
		);
	}
}
const mapDispatchToProps = dispatch => ({
	 userIdentity: bindActionCreators(userIdentity, dispatch),    
})
const mapStateToProps = (state, ownProps) => ({
    userData: state.user.userData,
})
const form = reduxForm({
	form: 'BankDetails',
	validate
});
export default connect(mapStateToProps, mapDispatchToProps)(form(BankDetails));