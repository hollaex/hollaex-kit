import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form';
import { getMe, processWithdraw } from '../../actions/userAction'

const validate = formProps => {
  const errors = {}
  if (!formProps.address) {
    errors.address = 'Required'
  }
  if (!formProps.amount) {
    errors.amount = 'Required'
  }
  return errors
}
const renderInput = ({ input, label, type, meta: {touched, invalid, error }}) => (
 	<div className="row mt-2">
		<div className="col-lg-6">
			<p>{label}</p>
		</div>
		<div className="col-lg-6">
			<div><input  {...input} type={type} placeholder={label}/></div>
			<div style={{color: 'red'}}>
		      { touched ? error : '' }
		    </div>
		</div>
	</div>
);
const mapDispatchToProps = dispatch => ({
	getMe: bindActionCreators(getMe, dispatch),   
	processWithdraw: bindActionCreators(processWithdraw, dispatch),   
})
class Withdraw extends Component {
	state={
		isBitcoin:true,
	}
	componentDidMount() {
		 this.props.getMe();
	}
	render() {
		const { handleSubmit } = this.props;
		const onSubmit = formProps => {
            this.props.processWithdraw({address:formProps.address,amount:parseInt(formProps.amount)});
	     }
		return (
			<div>
				<div className='text-center mt-5 pt-3'><h3>WITHDRAW</h3></div>			 
				<div className="col-lg-8 offset-2 mt-5 ">
					<div className="tradeBorder" style={{height:'26rem'}}>
						<div className="row mt-4" style={{position:'relative',top:'-3rem'}}>
							<div className="col-lg-6 text-right pr-5">
								<button 
									onClick={this.openBitcoin}  
									className={this.state.isBitcoin?`activeButton`:`normalButton`}>
										Withdraw Bitcoins
								</button>
							</div>
							<div className="col-lg-6 text-left pl-5">
								<button  
									onClick={this.closeBitcoin}
									className={this.state.isBitcoin?`normalButton`:`activeButton`}>
										Withdraw Dollars
								</button>	
							</div>
						</div>
						{this.state.isBitcoin?
							<div className="mt-5 row">	
								<div className="col-lg-6 offset-3">
									<form onSubmit={ handleSubmit(onSubmit)}>
										 <div>
									         <Field
									            name="address"
									            component={ renderInput }
									            type="text"
									            label="Bitcoin address:"
									         />       
								        </div>
								        <div>
									        <Field
									            name="amount"
									            component={ renderInput }
									            type="text"
									            label="amount to withdraw"
									         />       
								        </div>
										<p style={{color:'rgb(154, 166, 176)'}}>transactions fee: 0.0001 ($0.10)</p>
										<div>
											<button className="boxButton mt-5" style={{height:'2rem'}}>
												SUBMIT WITHDRAW REQUEST 
												<span className=" " style={{marginLeft:'9rem'}}>></span>
											</button>
										</div>
									</form>
								</div>
							</div>
							:
							<div className="col-lg-8 offset-2">
								<div style={{borderBottom:'2px solid #4c5b71'}}>	
									<div className="col-lg-10 offset-1">	
									 	<div className="mb-3">With draw to this bank account:</div>
									 	<div style={{color:'rgb(50, 188, 235)'}}>
									 		<p>johonny cash</p>
									 		<p>bank of iran</p>
											<p>23193931913</p>
											<p>3413-32</p>
											<p>message code: 239321FF</p>
									 	</div>
									</div>
								</div>
								<div className="col-lg-10 offset-1">
									<div className="row mt-2">
										<div className="col-lg-6">
											<p>amount to withdraw</p>
										</div>
										<div className="col-lg-6">
											<div><input type="text" name="Bitcoinaddr" style={{width:'100%'}}/></div>
										</div>
									</div>	
								 	 <button className="boxButton mt-1 " style={{height:'2rem'}}>
										SUBMIT WITHDRAW REQUEST 
										<span className=" " style={{marginLeft:'rem'}}>></span>
									</button>
								</div>
							</div>
						}					
					</div>
				</div>
			</div>
		);
	}
	closeBitcoin=()=>{
		this.setState({
			isBitcoin:false
		})
	}
	openBitcoin=()=>{
		this.setState({
			isBitcoin:true
		})
	}
}
const mapStateToProps = (store, ownProps) => ({
	user: store.user
})
const form = reduxForm({
	form: 'withdraw',
	validate
});
export default connect(mapStateToProps, mapDispatchToProps)(form(Withdraw));