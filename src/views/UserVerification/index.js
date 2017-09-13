import React, { Component } from 'react';
import { Link } from 'react-router'
import { connect } from 'react-redux';
import VerifiedStatus from './VerifiedStatus'
import Identity from './Identity'
import BankDetails from './BankDetails'
import { userIdentity } from '../../actions/userAction'

import './styles/verification.css'

const STEPS = [
	'LEVEL 1 - EMAIL',
	'LEVEL 2 - IDENTITY',
	'LEVEL 3 - BANK DETAILS'
];

class UserVerification extends Component {
	state = {
		activeStep: 1,
	}

	componentWillMount() {
		const { params, user } = this.props;
		this.setActiveStep(user.verification_level - 1 || params.level && params.level - 1);
	}

	setActiveStep = (activeStep = 0) => {
		this.setState({ activeStep })
	}

	renderButtons = () => {
		return STEPS.map((step, index) => {
			return (
				<div  className="col-lg-4 text-center" key={index}>
					<button
						onClick={() => this.setActiveStep(index)}
						className={this.state.activeStep === index ? 'activeButton' : 'normalButton'}>
							 {step}
					</button>
				</div>
			)
		})
	}

	renderComponent = (activeStep, verification_level) => {
		let component;
		switch (activeStep) {
			case 0:
				component = <VerifiedStatus
					verify="EMAIL"
					level={1}
					email={this.props.user.email}
					nextLevel={() => this.setActiveStep(1)}
				/>
				break;
			case 1:
				component = verification_level > activeStep ?
					<VerifiedStatus
						verify="IDENTITY"
						level={2}
						nextLevel={() => this.setActiveStep(2)}
					/>
					: <Identity />
				break;
			case 2:
				component = verification_level > activeStep ?
					<VerifiedStatus
						verify="BANK DETAILS"
						level={3}
					/>
					: <BankDetails />
				break;
			default:
				component = <div>Loading</div>
		}

		return (
			<div className="col-lg-10 offset-1 " >
				{component}
			</div>
		)
	}

	render() {
		const { user } = this.props
		if (!user) {
			return <div>Loading</div>
		}
		return (
			<div>
				<div className='text-center mt-5 pt-3 '><h3>VERIFICATION</h3></div>

				<div><Link to='/dashboard' style={{ textDecoration: 'none' }}>skip</Link></div>
				<div className=" ml-5 mr-5 mt-5 ">
					<div className="tradeBorder">
						<div className="row mt-4" style={{position:'relative',top:'-3rem'}}>
							{this.renderButtons()}
						</div>
						{this.renderComponent(this.state.activeStep, user.verification_level)}
					</div>
				</div>
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => ({
	 userIdentity: (values) => dispatch(userIdentity(values)),
})

const mapStateToProps = (state, ownProps) => ({
    user: state.user,
})

export default connect(mapStateToProps, mapDispatchToProps)(UserVerification);
