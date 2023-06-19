import React, { useState } from 'react';
import {
	Button,
	Input,
	Modal,
	Select,
	message,
	Slider,
	Switch,
	DatePicker,
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const UseFilters = ({
	displayFilterModel,
	setDisplayFilterModel,
	applyFilters,
}) => {
	const { Option } = Select;
	const fieldKeyValue = {
		id: { type: 'string', label: 'User ID' },
		email: { type: 'string', label: 'Email' },
		username: { type: 'string', label: 'User Name' },
		full_name: { type: 'string', label: 'Full Name' },
		pending: { type: 'boolean', label: 'Pending' },
		pending_type: {
			type: 'dropdown',
			label: 'Pending Type',
			value: 'id',
			options: [
				{ label: 'id', value: 'id' },
				{ label: 'bank', value: 'bank' },
			],
		},
		start_date: { type: 'date', label: 'User Creation Date Start' },
		end_date: { type: 'date', label: 'User Creation Date End' },
		dob_start_date: { type: 'date', label: 'User DOB Date Start' },
		dob_end_date: { type: 'date', label: 'User DOB Date End' },
		gender: {
			type: 'dropdown',
			label: 'Gender',
			options: [
				{ label: 'Male', value: 0 },
				{ label: 'Female', value: 1 },
			],
		},
		nationality: { type: 'string', label: 'Nationality' },
		phone_number: { type: 'string', label: 'Phone Number' },
		verification_level: { type: 'string', label: 'Verification Level' },
		email_verified: { type: 'boolean', label: 'Email Verified' },
		otp_enabled: { type: 'boolean', label: 'OTP Enabled' },
	};

	const [showAddFilter, setShowAddFilter] = useState(false);
	const [filters, setFilters] = useState([
		{ field: 'id', type: 'string', label: 'User ID', value: null },
	]);

	const [field, setField] = useState();
	const dateFormat = 'YYYY/MM/DD';

	const goBack = () => {
		setDisplayFilterModel(false);
	};

	const handleFilters = () => {
		const queryFilters = {};

		filters.forEach((filter) => {
			if (filter.value != null && filter.value !== '') queryFilters[filter.field] = filter.value;
		});

		applyFilters(queryFilters);
		setDisplayFilterModel(false);
	};

	return (
		<>
			<Modal
				maskClosable={false}
				closeIcon={<CloseOutlined style={{ color: 'white' }} />}
				bodyStyle={{
					backgroundColor: '#27339D',
					marginTop: 60,
				}}
				visible={showAddFilter}
				footer={null}
				onCancel={() => {
					setShowAddFilter(false);
				}}
			>
				<div style={{ fontWeight: '600', color: 'white' }}>Select Field </div>

				<div style={{ color: 'white', marginTop: 30, marginBottom: 40 }}>
					<label>Field</label>
					<Select
						showSearch
						style={{ width: '100%', marginTop: 10 }}
						placeholder="Select field"
						value={field}
						onChange={(value) => {
							setField(value);
						}}
					>
						{Object.keys(fieldKeyValue).map((key) => (
							<Option value={key}>{fieldKeyValue[key].label}</Option>
						))}
					</Select>
				</div>

				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						gap: 15,
						justifyContent: 'space-between',
					}}
				>
					<Button
						onClick={() => {
							setShowAddFilter(false);
						}}
						style={{
							backgroundColor: '#288500',
							color: 'white',
							flex: 1,
							height: 35,
						}}
						type="default"
					>
						Back
					</Button>
					<Button
						onClick={() => {
							const found = filters.find((f) => f.field === field);

							if (found) {
								message.error('Filter already exists');
							} else {
								setShowAddFilter(false);
								const fieldValue = {
									field,
									type: fieldKeyValue[field].type,
									label: fieldKeyValue[field].label,
									value: fieldKeyValue[field].value,
									options: fieldKeyValue[field]?.options,
								};
								setFilters((prevState) => {
									prevState.push(fieldValue);
									return [...prevState];
								});
							}
						}}
						style={{
							backgroundColor: '#288500',
							color: 'white',
							flex: 1,
							height: 35,
						}}
						type="default"
					>
						Ok
					</Button>
				</div>
			</Modal>
			<Modal
				maskClosable={false}
				closeIcon={<CloseOutlined style={{ color: 'white' }} />}
				bodyStyle={{
					backgroundColor: '#27339D',
				}}
				visible={displayFilterModel}
				footer={null}
				onCancel={() => {
					setDisplayFilterModel(false);
				}}
			>
				<div style={{ fontWeight: '600', color: 'white' }}>Add Filters</div>

				{filters.map((filter, index) => {
					return (
						<div style={{ color: 'white', margin: '20px 0' }}>
							<label>
								<DeleteOutlined
									onClick={() => {
										let newFilters = [...filters];
										newFilters = newFilters.filter((f, i) => i !== index);
										setFilters(newFilters);
									}}
								/>{' '}
								{filter.label}:{' '}
							</label>
							{filter.type === 'string' && (
								<Input
									value={filter.value}
									onChange={(e) => {
										const newFilters = [...filters];
										newFilters[index].value = e.target.value;
										setFilters(newFilters);
									}}
									style={{ marginTop: 10 }}
									placeholder={filter.label}
								/>
							)}
							{filter.type === 'range' && (
								<Slider
									range
									defaultValue={[1, 10]}
									value={filter.value}
									onChange={(e) => {
										const newFilters = [...filters];
										newFilters[index].value = e;
										setFilters(newFilters);
									}}
								/>
							)}
							{filter.type === 'boolean' && (
								<Switch
									size="small"
									checked={filter.value}
									style={{ marginLeft: 10 }}
									onChange={(e) => {
										const newFilters = [...filters];
										newFilters[index].value = e;
										setFilters(newFilters);
									}}
								/>
							)}
							{filter.type === 'dropdown' && (
								<Select
									showSearch
									style={{ width: '100%', marginTop: 10 }}
									placeholder="Select value"
									value={filter.value}
									onChange={(e) => {
										const newFilters = [...filters];
										newFilters[index].value = e;
										setFilters(newFilters);
									}}
								>
									{filter?.options.map((f) => (
										<Option value={f.value}>{f.label}</Option>
									))}
								</Select>
							)}
							{filter.type === 'date' && (
								<DatePicker
									style={{ marginLeft: 10 }}
									onChange={(date, dateString) => {
										const newFilters = [...filters];
										newFilters[index].value = moment(dateString).format();
										setFilters(newFilters);
									}}
									format={dateFormat}
								/>
							)}
						</div>
					);
				})}

				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'flex-end',
						marginTop: 15,
						marginBottom: 25,
					}}
				>
					<div style={{}}>
						<Button
							onClick={() => {
								setShowAddFilter(true);
							}}
							style={{ backgroundColor: '#E97C00', color: 'white', flex: 1 }}
						>
							Add Filter
						</Button>
					</div>
				</div>

				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						gap: 15,
						justifyContent: 'space-between',
					}}
				>
					<Button
						onClick={() => {
							goBack();
						}}
						style={{
							backgroundColor: '#288500',
							color: 'white',
							flex: 1,
							height: 35,
						}}
						type="default"
					>
						Back
					</Button>
					<Button
						onClick={() => {
							handleFilters();
						}}
						style={{
							backgroundColor: '#288500',
							color: 'white',
							flex: 1,
							height: 35,
						}}
						type="default"
					>
						Apply Filters
					</Button>
				</div>
			</Modal>
		</>
	);
};

export default UseFilters;
