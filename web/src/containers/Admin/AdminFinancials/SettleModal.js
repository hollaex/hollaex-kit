import React, { Component } from 'react';
import { Button, message } from 'antd';
import { getSettle } from '../AdminFees/action';
import moment from 'moment';

export class SettleModal extends Component {
	settleFee = () => {
		const { toggleVisibility, requestFees } = this.props;

		getSettle()
			.then((response) => {
				message.success('Successfully Settled');
				requestFees();
			})
			.catch((error) => {
				const error_msg = error.data ? error.data.message : error.message;
				message.error(error_msg);
			});
		toggleVisibility();
	};
	render() {
		const { toggleVisibility, earningsData } = this.props;
		return (
			<div className="settle-modal-page">
				<div className="d-flex align-items-center">
					<div className="dollar-icon text-center">$</div>
					<div className="heading">Settle trading fees</div>
				</div>
				<div className="margin-top-bottom">
					Click settle below to calculate the trading fees generated from your
					users from the last settlement date until today.
				</div>
				<div className="margin-top-bottom">
					The settled earning amounts will be freely accessible to use.
				</div>
				<div className="modal-content">
					<span className="legend title-content text-center">
						Calculate earning dates
					</span>
					<div>
						<div className="title-content margin-top-bottom">
							From last settlement:
						</div>
						<div>
							{earningsData[0] && earningsData[0].date
								? moment(earningsData[0].date).format('YYYY-MM-DD')
								: 'N/A'}
						</div>
					</div>
					<div>
						<div className="title-content margin-top-bottom">
							Until current todays date:
						</div>
						<div>{moment().format('YYYY-MM-DD')}</div>
					</div>
				</div>
				<div className="d-flex justify-content-around">
					<Button className="modal-button" onClick={toggleVisibility}>
						Back
					</Button>
					<Button className="modal-button" onClick={this.settleFee}>
						Settle
					</Button>
				</div>
			</div>
		);
	}
}
