import React, { Component } from 'react';
import { Link } from 'react-router';

export default class VerifiedStatus extends Component {
	render() {
		return (
			<div className='text-center mt-5 mb-5'>
				<h3>
					<div className="">LEVEL {this.props.level}</div>
					<div className="mt-3">{this.props.verify} VERIFIED</div>
				</h3>
				{this.props.verify=='EMAIL'?
					<div>
						<div className="mt-5">
						<label className=" tradeBorder pl-2 pt-2 pb-2 pr-2">Email Address : <span className="ml-5 mr-5"> Ram.356@gmail.com </span></label>
						</div>
						<div className="mt-5" ><a  href='#' onClick={this.nextLevel}>PROCEED TO LEVEL 2 - IDENTITY VERIFICATION</a></div>
					</div>
					:this.props.verify=='IDENTITY'?
						<div>
							<div className="mt-5" ><Link to='#'>PROCEED TO LEVEL 3 - BANK DETAILS VERIFICATION</Link></div>
							<div className="mt-3">
								Want to change identity details?
								<a href='support'>Contact customer support.</a>
							</div>
						</div>
					:this.props.verify=='BANK DETAILS'?
						<div className="mt-5">
							<a href='support'>Contact customer support.</a>
							if you want to change bank account details
						</div>
					:null
				}
				
			</div>
		);
	}
	nextLevel=()=>{
		 this.props.nextLevel();
	}
}
