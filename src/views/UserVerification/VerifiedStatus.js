import React, { Component } from 'react';
import { Link } from 'react-router';

const VerifiedStatus = (props) => {
	let component;
	switch (props.level) {
		case 1:
			component = (
				<div className="mt-5">
					<label className=" tradeBorder pl-2 pt-2 pb-2 pr-2">Email Address : <span className="ml-5 mr-5">{props.email}</span></label>
					<div className="mt-5" >
						<a onClick={props.nextLevel}>PROCEED TO LEVEL 2 - IDENTITY VERIFICATION</a>
					</div>
				</div>
			);
			break;
		case 2:
			component = (
				<div className="mt-5">
					<div className="mt-5" >
						<a onClick={props.nextLevel}>PROCEED TO LEVEL 3 - BANK DETAILS VERIFICATION</a>
					</div>
					<div className="mt-3">
						Want to change identity details?
						<Link to='/dashboard/support'>Contact customer support</Link>
					</div>
				</div>
			);
			break;
		case 3:
			component = (
				<div className="mt-5">
					<Link to='/dashboard/support'>Contact customer support</Link>
					if you want to change bank account details
				</div>
			);
			break;
		default:
			component = <div className="mt-5">Invalid status</div>
	}

	return (
		<div className='text-center mt-5 mb-5'>
			<h3>
				<div className="">LEVEL {props.level}</div>
				<div className="mt-3">{props.verify} VERIFIED</div>
			</h3>
			<div>
				{component}
			</div>
		</div>
	)
}

VerifiedStatus.defaultProps = {
	nextLevel: () => {}
}

export default VerifiedStatus;
