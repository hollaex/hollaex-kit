import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router'
import { renderText, renderTextArea, renderSelect } from './ReduxFields';
import country from './Country';
import { userIdentity } from '../../actions/userAction'

const validate = formProps => {
  const errors = {}
  if (!formProps.first_name) {
    errors.first_name = 'Required'
  }
  if (!formProps.last_name) {
    errors.last_name = 'Required'
  }
  return errors
}

export class Identity extends Component {
	render() {
		const { handleSubmit } = this.props;
		const onSubmit = formProps => {
            var userRequest={
            	first_name:formProps.first_name,
				last_name:formProps.last_name,
				gender: true,
				nationality:formProps.nationality,
				dob:  formProps.dob?formProps.dob+'T10:47:09.692Z':undefined,
				address:formProps.address,
				phone_number:formProps.phone_number,
				id_type:formProps.id_type,
				id_number: formProps.id_number,
            }
            this.props.userIdentity(userRequest)
	    }
		return (
			<div>
				{this.props.userData?
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
						<form onSubmit={ handleSubmit(onSubmit)}>
						<div>
							<div><h3>Personal Information</h3></div>
							<div className="mt-1">
								<span>IMPORTANT : </span>
								<span style={{fontSize:'0.7rem'}}> 
									Enter your name in to the fields exactly as it appears on your indentity document
									(full firstname, any middle names / initials and full last name(s))
								</span>
							</div>
							<div className="row">
								<div className="col-lg-4">
									<Field
							            name="first_name"
							            component={ renderText }
							            type="text"
							            label="FIRST NAME"
							            style={{width:'100%'}}
							        />
								</div>
								<div className="col-lg-4">
									<Field
							            name="last_name"
							            component={ renderText }
							            type="text"
							            label="LAST NAME"
							            style={{width:'100%'}}
							        />
								</div>
							</div>
							<div className="row">
								<div className="col-lg-4">
									<Field
							            name="gender"
							            component={ renderSelect }
							            label="GENDER"
							            options={['MALE','FEMALE']}
							        />
								</div>
							</div>
							<div className="row">
								<div className="col-lg-4">
									<Field
							            name="nationality"
							            component={ renderText }
							            type="text"
							            label="NATIONALITY"
							            style={{width:'100%'}}
							        />
								</div>
							</div>
							<div className="row">
								<div className="col-lg-4">
									<Field
							            name="dob"
							            component={ renderText }
							            type="date"
							            label="DATE OF BIRTH"
							            style={{width:'100%'}}
							        />
								</div>
							</div>
							<div className="row">
								<div className="col-lg-4">
									<Field
							            name="countryReside"
							            component={ renderSelect }
							            label="COUNTRY YOU RESIDE"
							            options={country}
							        />
								</div>
								<div className="col-lg-4">
									<Field
							            name="address"
							            component={ renderText }
							            type="text"
							            label="ADDRESS"
							            style={{width:'100%'}}
							        />
								</div>
							</div>
							<div className="row">
								<div className="col-lg-4">
									<Field
							            name="city"
							            component={ renderText }
							            type="text"
							            label="CITY"
							            style={{width:'100%'}}
							        />
								</div>
								<div className="col-lg-4">
									<Field
							            name="postal code"
							            component={ renderText }
							            type="text"
							            label="POSTAL CODE"
							            style={{width:'100%'}}
							        />
								</div>
							</div>
							<div className="mt-3">
								Are you a business? <Link to='/dashboard/support'>Contact customer support</Link> for a coporate account.
							</div>
						</div>
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
						<div>
							<div className="mt-3"><h3>ID Document</h3></div>
							<div className="mt-3" style={{fontSize:'0.8rem'}}>
								 Please make sure that your submitted documents are:
								 	<li>HIGH QUALITY(color images,300dpi resolution or higher).</li>
								 	<li>VISIBLE IN THEIR ENTIRITY(Watermarks are permitted).</li>
								 	<li>VALID, with the expiry date clearly visible</li>
								 <div className="mt-3" >
								 	<span style={{color:'#bf2932',backgroundColor:'#f1dbde'}}>
								 		Please do not submit the identity document as your proof of residense.
								 	</span>
								 </div>
								 <div style={{fontSize:'0.7rem'}}>
								 	Only a valid goverment-issued identification document;
								 	high quality photos or scanned images of these documents are acceptable:
								 </div>
							</div>
							 <div className="mt-3">
								<div>PHOTO ID Document:</div>
								<div className="mt-1">
									<input type="file" name="attachments" />
								</div>
							</div>
							<div className="mt-4">
								<div>Back Side Photo ID Document:</div>
								<div className="mt-1">
									<input type="file" name="attachments" />
								</div>
							</div>
							<div className="row">
								<div className="col-lg-4">
									<Field
							            name="issue"
							            component={ renderText }
							            type="date"
							            label="ID Document Issue Date"
							            style={{width:'100%'}}
							        />
								</div>
								<div className="col-lg-4">
									<Field
							            name="expiration"
							            component={ renderText }
							            type="date"
							            label="ID Document Expiration Date"
							            style={{width:'100%'}}
							        />
								</div>
							</div> 
							<div className="row">
								<div className="col-lg-4 row" >
									<div className="col-lg-6">
										<Field
								            name="id_number"
								            component={ renderText }
								            type="text"
								            label="ID Document Number"
								            style={{width:'118%'}}
								        />
									</div>
									<div className="col-lg-6">
										<Field
								            name="id_type"
								            component={ renderSelect }
								            label="ID Document Type"
								            options={['PASSPORT','NATIONAL ID','DRIVERS LICENCE','OTHER']}
								            style={{width:'120%'}}
								        />
									</div>
								</div>
							</div> 
						</div>
						<div className="mt-3">
							<div><h3>PROOF OF RECIDENCE DOCUMENT</h3></div>
							<div style={{fontSize:'0.7rem'}} className="mt-3">
								<div>To avoid delays when verifying your account,please make sure:</div>
								<div>Your NAME, ADDRESS, ISSUE DATE and ISSUER are clearly visible.</div>
								<div>The submitted proof of residence document is NOT OLDER THAN THREE MONTHS.</div>
								<div>You submit color photographs scanned images in HIGH QUALITY (at least 300DPI)</div>
								<div className="mt-3">
									AN ACCEPTABLE PROOF OF RECIDENCE IS:
									<li>A bank account statement</li>
									<li>A utility bill(electricity,water,internet,etc.).</li>
									<li>A goverment-issued document(tax statement, certificate of recidency,etc.).</li>
								</div>
							</div>
							 <div className="mt-3" >
							 	<span style={{color:'#bf2932',backgroundColor:'#f1dbde'}}>
							 		 We cannot accept the address on your submitted identity document as a valid proof of recidence.
							 	</span>
							 </div>
							 <div className="mt-4">
								<div className="">
									<input type="file" name="attachments" />
								</div>
							</div>
							<div><button type="submit" className="activeButton mt-4 " style={{width:'30%'}}>SUBMIT VERIFICATION REQUEST</button></div>
						</div>
						</form>
					</div>
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
	form: 'Identity',
	validate
});
export default connect(mapStateToProps, mapDispatchToProps)(form(Identity));