import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import {renderText,renderTextArea,renderSelect } from './ReduxFields';

const validate = formProps => {
  const errors = {}
  if (!formProps.emailAddr) {
    errors.emailAddr = 'Required'
  }
  if (!formProps.category) {
    errors.category = 'Required'
  }
  if (!formProps.subject) {
    errors.subject = 'Required'
  }
  if (!formProps.descrption) {
    errors.descrption = 'Required'
  }
   if (!formProps.attachments) {
    errors.attachments = 'Required'
  }
   if (!formProps.userpic) {
    errors.userpic = 'Required'
  }
  return errors
}
class CustomerSupport extends Component {

	render() {
		const { handleSubmit } = this.props;
		const onSubmit = formProps => {
             console.log('formProps',formProps);
	     }
		return (
			<div className="col-lg-12  mt-5 ml-5 pl-5" >
				<form onSubmit={ handleSubmit(onSubmit)}>
					<h3>Submit a request</h3>
			        <Field
			            name="emailAddr"
			            component={ renderText }
			            type="text"
			            label="YOUR EMAIL ADDRESS:"
			        />
					<Field
			            name="category"
			            component={ renderText }
			            type="text"
			            label="CATEGORY"
			        />
			        <Field
			            name="subject"
			            component={ renderText }
			            type="text"
			            label="SUBJECT"
			        />
			        <Field
			            name="descrption"
			            component={ renderTextArea }
			            type="text"
			            label="DESCRIPTION"
			        />
			        <div className="mt-2" style={{width:'35%',fontSize:'0.7rem'}}>
			        	Please enter the detail of your request.A member of our support staff will respond as soon as possible.
			        </div>
			         <div className="mt-3">
						<div>ATTACHMENTS</div>
						<div className="mt-1">
							<input type="file" name="attachments" />
						</div>
					</div> 
			        <div className="mt-5">
			        	<button type="submit" className="activeButton" style={{width:'15%'}} >
			        		SUBMIT
			        	</button>
			        </div>
			    </form>    
			</div>
		);
	}
}
const mapDispatchToProps = dispatch => ({
	 
})
const mapStateToProps = (store, ownProps) => ({
	 
})
const form = reduxForm({
	form: 'CustomerSupport',
	validate
});
export default connect(mapStateToProps, mapDispatchToProps)(form(CustomerSupport));