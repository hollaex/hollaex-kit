import React, { Component } from 'react';
import { Link } from 'react-router'
import VerifiedStatus from './VerifiedStatus'
import Identity from './Identity'
import BankDetails from './BankDetails'

import './styles/verification.css'

export default class UserVerification extends Component {
	state={
		buttonOne:true,
		buttonTwo:false,
		buttonThree:false
	}
	componentDidMount() {
		if(this.props.params.level==2){
			 this.setState({buttonOne:false,buttonTwo:true,buttonThree:false})
		}
		else if(this.props.params.level==3){
			 this.setState({buttonOne:false,buttonTwo:false,buttonThree:true})
		}
	}
	render() {
		return (
			<div>
				<div className='text-center mt-5 pt-3 '><h3>VERIFICATION</h3></div>
				 
				<div><Link to='/dashboard' style={{ textDecoration: 'none' }}>skip</Link></div>
				<div className=" ml-5 mr-5 mt-5 ">
					<div className="tradeBorder">
						<div className="row mt-4" style={{position:'relative',top:'-3rem'}}>
							<div className="col-lg-4 text-right">
								<button 
									onClick={this.openButtonOne}  
									className={this.state.buttonOne?`activeButton`:`normalButton`}>
										LEVEL 1 - EMAIL
								</button>
							</div>
							<div  className="col-lg-4 text-center">
								<button  
									onClick={this.openButtonTwo}
									className={this.state.buttonTwo?`activeButton`:`normalButton`}>
										 LEVEL 2 - IDENTITY
								</button>	
							</div>
							<div className="col-lg-4  ">
								<button  
									onClick={this.openButtonThree}
									className={this.state.buttonThree?`activeButton`:`normalButton`}>
										LEVEL 3 - BANK DETAILS
								</button>	
							</div>
						</div>
						{this.state.buttonOne?
							<div className="">	
								<VerifiedStatus verify="EMAIL" level="1" nextLevel={this.openButtonTwo}/>
							</div>
							: this.state.buttonTwo?
								<div className=" ">	
									<Identity />
								</div>
							: this.state.buttonThree?
								<div className="col-lg-10 offset-1 " >	
									<BankDetails />
								</div>
							:null
						}				
					</div>
				</div>
			</div>
		);
	}
	openButtonOne=()=>{
		this.setState({
			buttonOne:true,
			buttonTwo:false,
			buttonThree:false
		})
	}
	openButtonTwo=()=>{
		this.setState({
			buttonOne:false,
			buttonTwo:true,
			buttonThree:false
		})
	}
	openButtonThree=()=>{
		this.setState({
			buttonOne:false,
			buttonTwo:false,
			buttonThree:true
		})
	}
}
// <VerifiedStatus  verify="IDENTITY" level="2"/>