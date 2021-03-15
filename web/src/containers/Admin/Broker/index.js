import React, { useEffect, useState, Fragment } from 'react';
import { Spin, Alert, Switch, Divider, Modal, Card } from 'antd';
import math from 'mathjs';

import BrokerForm from './BrokerForm';
import { getConstants, updatePlugins } from '../Plugins/action';
import { getFees } from '../Fees/actions';
import { validateRequired } from '../../../components/AdminForm/validations';
import { formatCurrency } from '../../../utils/currency';

const generateForm = () => ({
	trade_master_account_id: {
		type: 'number',
		label: 'Broker Account (User ID of your broker account in the system)',
		placeholder: 'Set the user id for broker account',
		validate: [validateRequired],
		min: 1,
	},
	quick_trade_rate: {
		type: 'number',
		label: 'Broker Rate (%)',
		placeholder: 'Set your broker rate in percentage',
		min: 0,
		max: 100,
		validate: [validateRequired],
	},
});

const Broker = () => {
	const [loading, setLoading] = useState(false);
	const [serviceLoading, setServiceLoading] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);
	const [error, setError] = useState('');
	const [constants, setConstants] = useState({ secrets: {} });
	const [initialValues, setInitialValues] = useState({ quick_trade_rate: 3 });
	const [feesData, setFees] = useState({});
	useEffect(() => {
		setLoading(true);
		getConstants()
			.then((res) => {
				setConstants(res.constants);
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				const message = error.data ? error.data.message : error.message;
				setError(message);
			});
		getFees()
			.then((res) => {
				if (res) setFees(res);
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				setError(message);
			});
	}, []);

	useEffect(() => {
		const { secrets = { broker: {} } } = constants;
		let initialData = {};
		if (secrets.broker) {
			initialData = { ...secrets.broker };
			if (initialData.quick_trade_rate) {
				initialData.quick_trade_rate = math.multiply(
					initialData.quick_trade_rate,
					100
				);
			}
			setInitialValues(initialData);
		}
	}, [constants]);

	const handleSwitch = (checked) => {
		if (checked) {
			handleBroker(checked);
		} else {
			handleDeactivate();
		}
		setServiceLoading(true);
	};

	const handleBroker = (checked) => {
		let formValues = {
			broker_enabled: checked,
		};
		updateConstants(formValues);
	};

	const disableBroker = () => {
		handleBroker(false);
		handleDeactivate();
	};

	const updateConstants = (formProps) => {
		setError('');
		return updatePlugins(formProps)
			.then((data) => {
				setConstants(data);
				setServiceLoading(false);
				setLoading(false);
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				setError(message);
				setServiceLoading(false);
				setLoading(false);
			});
	};

	const handleDeactivate = () => {
		setOpenDialog(!openDialog);
		setServiceLoading(false);
	};

	const handleSubmitBroker = (formProps) => {
		const { secrets = { broker: {} } } = constants;
		let formValues = { broker: { ...formProps } };
		if (formProps.quick_trade_rate) {
			formValues.broker.quick_trade_rate = math.divide(
				formProps.quick_trade_rate,
				100
			);
		}
		if (secrets.broker && secrets.broker.quick_trade_expiration_time) {
			formValues.broker.quick_trade_expiration_time =
				secrets.broker.quick_trade_expiration_time;
		}
		if (formProps.trade_master_account_id) {
			formValues.broker.trade_master_account_id = parseInt(
				formProps.trade_master_account_id,
				10
			);
		}
		setLoading(true);
		updateConstants({ secrets: formValues });
	};

	const { broker_enabled = false } = constants;
	return (
		<div className="app_container-content">
			{error && (
				<Alert
					message="Error"
					className="m-top"
					description={error}
					type="error"
					showIcon
				/>
			)}
			{loading ? (
				<Spin size="large" />
			) : (
				<div>
					<div className="d-flex align-items-center">
						<h1>Broker</h1>
						<div className="mx-4">
							<Switch
								loading={serviceLoading}
								checked={broker_enabled}
								onChange={handleSwitch}
							/>
						</div>
					</div>
					<Divider />
					{broker_enabled ? (
						<Fragment>
							<BrokerForm
								initialValues={initialValues}
								fields={generateForm()}
								handleSubmitBroker={handleSubmitBroker}
							/>
							{Object.keys(feesData).length ? (
								<Card
									className="card-title m-top"
									title="Quick Trades  Fees"
									style={{ textAlign: 'center' }}
								>
									{Object.entries(feesData).map(([currency, amount], index) => (
										<div
											key={index}
											className="list-group-item list-group-item-action"
										>
											{currency.toUpperCase()} : {formatCurrency(amount)}
										</div>
									))}
								</Card>
							) : null}
						</Fragment>
					) : null}
					<Modal
						title={`Deactivate Broker`}
						visible={openDialog}
						onOk={disableBroker}
						onCancel={handleDeactivate}
					>
						<div>Do you really want to Disable Broker?</div>
					</Modal>
				</div>
			)}
		</div>
	);
};

export default Broker;
