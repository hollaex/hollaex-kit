import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router'
import { renderText, renderTextArea, renderSelect } from './ReduxFields';
import country from './Country';
import { userIdentity, uploadFile } from '../../actions/userAction'

import UserIdentityForm from './UserIdentityForm';
import ProofOfIdentityForm from './ProofOfIdentityForm';

export class Identity extends Component {
  submitUserInformation = (values) => {
    if (values.gender === 'MALE') {
      values.gender = true;
    } else if (values.gender === 'FEMALE') {
      values.gender = false;
    }
    values.dob = new Date(values.dob)
    this.props.updateUserInformation(values);
  }

  submitProofOfIdentity = (values) => {
    this.props.uploadProofOfIdentity(values)
  }

	render() {
		const { handleSubmit, userData, fetching } = this.props;

		// const onSubmit = formProps => {
    //         var userRequest={
    //         	first_name:formProps.first_name,
		// 		last_name:formProps.last_name,
		// 		gender: true,
		// 		nationality:formProps.nationality,
		// 		dob:  formProps.dob?formProps.dob+'T10:47:09.692Z':undefined,
		// 		address:formProps.address,
		// 		phone_number:formProps.phone_number,
		// 		id_type:formProps.id_type,
		// 		id_number: formProps.id_number,
    //         }
    //         this.props.userIdentity(userRequest)
	  //   }
		return (
			<div>
				{ false ? //this.props.userData?
					<div className='text-center ml-5 mr-5 mb-5'>
						<h3>STATUS: PENDING</h3>
						<div className='mt-5'>
							<h4>
								DUE TO INCREASE IN USER REQUEST MAY TAKE MORE THAN 24 HOURS
								<p className='pt-3'>TO RESOLVE. THANK YOU FOR UNDERSTANDING.</p>
							</h4>
							<div className='mt-5' >
								We are reviewing your request.Once your request is reviewed,
								you will be notified about the result via email.
							</div>
						</div>
					</div>
				:
					<div className="ml-5 mr-5 mb-5">
            <UserIdentityForm
              onSubmit={this.submitUserInformation}
              fetching={fetching}
            />
						<form>

  						<div>
  							<div className="mt-3"><h3>Phone</h3></div>
  							<div className="row">
  								<div className="col-lg-4">
  									<Field
  							            name="country"
  							            component={ renderSelect }
  							            label="COUNTRY"
  							            options={country}
  							        />
  								</div>
  							</div>
  							<div className="row">
  								<div className="col-lg-4 ml-1 row">
  									<Field
  							            name="phone_number"
  							            component={ renderText }
  							            type="text"
  							            label="PHONE NUMBER"
  							            style={{width:'130%'}}
  							        />
  							       <div className="ml-4 mt-4 pl-3 pt-3">
  							       		<button className="activeButton"  style={{width:'100%',fontSize:'0.6rem',height:'1.56rem'}}>
  							       			SEND SMS CODE
  							       		</button>
  							       	</div>
  								</div>
  							</div>
  							<div className="row">
  								<div className="col-lg-4 ml-1 row">
  									<Field
  							            name="smscode"
  							            component={ renderText }
  							            type="text"
  							            label="SMS CODE"
  							            style={{width:'130%'}}
  							        />
  							       <div className="ml-4 mt-4 pl-3 pt-3">
  							       		<button className="activeButton"  style={{width:'118%',fontSize:'0.6rem',height:'1.54rem'}}>
  							       			 SUBMIT CODE
  							       		</button>
  							       	</div>
  								</div>
  							</div>
  							<div className="mt-3" style={{fontSize:'0.7rem'}}>
  								A 4 digit sms code was sent to you, please type it in the field above before 5 minites.
  							</div>
  						</div>
            </form>

            <ProofOfIdentityForm
              onSubmit={this.submitProofOfIdentity}
            />
					</div>

			 	}
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => ({
  updateUserInformation: bindActionCreators(userIdentity, dispatch),
  uploadProofOfIdentity: bindActionCreators(uploadFile, dispatch),
})

const mapStateToProps = (state, ownProps) => ({
  userData: state.user.userData,
  fetching: state.user.fetching,
})

const form = reduxForm({
	form: 'Identity',
});

export default connect(mapStateToProps, mapDispatchToProps)(form(Identity));
