import React, { useState } from 'react';
import {
	Button,
	Input,
	Select,
	message,
	Slider,
	Switch,
	DatePicker,
} from 'antd';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import './UserFilters.scss';
import { COUNTRIES_OPTIONS } from '../../../utils/countries';
const UseFilters = ({ applyFilters }) => {
	const { Option } = Select;
	const fieldKeyValue = {
		id: { type: 'string', label: 'User ID' },
		email: { type: 'string', label: 'Email' },
		username: { type: 'string', label: 'User Name' },
		full_name: { type: 'string', label: 'Full Name' },
		start_date: { type: 'date', label: 'User Creation Date Start' },
		kyc: {
			type: 'dropdown',
			label: 'User Id Verification',
			options: [
				{ value: -1, label: 'None' },
				{ value: 0, label: 'Not complete' },
				{ value: 1, label: 'Pending' },
				{ value: 2, label: 'Rejected' },
				{ value: 3, label: 'Approved' },
			],
		},
		bank: {
			type: 'dropdown',
			label: 'Bank Verification',
			options: [
				{ label: 'None', value: -1 },
				{ label: 'Pending', value: 1 },
			],
		},
		end_date: { type: 'date', label: 'User Creation Date End' },
		dob_start_date: { type: 'date', label: 'User DOB Date Start' },
		dob_end_date: { type: 'date', label: 'User DOB Date End' },
		gender: {
			type: 'dropdown',
			label: 'Gender',
			options: [
				{ label: 'None', value: -1 },
				{ label: 'Male', value: false },
				{ label: 'Female', value: true },
			],
		},
		nationality: {
			type: 'dropdown',
			label: 'Nationality',
			options: COUNTRIES_OPTIONS,
		},
		phone_number: { type: 'string', label: 'Phone Number' },
		verification_level: {
			type: 'dropdown',
			label: 'Verification Level',
			options: [
				{ label: 'None', value: -1 },
				{ label: 1, value: 1 },
				{ label: 2, value: 2 },
				{ label: 3, value: 3 },
			],
		},
		email_verified: { type: 'boolean', label: 'Email Verified' },
		otp_enabled: { type: 'boolean', label: 'OTP Enabled' },
	};

	const defaultFilters = [
		{ field: 'id', type: 'string', label: 'ID', value: null },
		{ field: 'email', type: 'string', label: 'Email', value: null },
	];

	const [filters, setFilters] = useState(defaultFilters);

	const [field, setField] = useState();
	const dateFormat = 'YYYY/MM/DD';

	const canReset = filters?.find(
		(filter) => filter.value != null && filter.value !== ''
	);

	const handleFilters = (selectedFilters = null) => {
		const queryFilters = {};

		if (!selectedFilters) selectedFilters = filters;
		selectedFilters.forEach((filter) => {
			if (filter.value != null && filter.value !== '')
				queryFilters[filter.field] = filter.value;
		});

		applyFilters(queryFilters);
	};

	const addPendingType = (value, Index) => {
		if (value === -1) {
			setFilters((prevState) => {
				prevState[Index].value = null;
				if (
					!prevState.find((f) => ['bank', 'kyc'].includes(f.field) && f.value)
				)
					prevState = prevState.filter((f) => f.field !== 'pending');
				return [...prevState];
			});
		} else {
			setFilters((prevState) => {
				prevState[Index].value = value;
				const found = filters.find((f) => f.field === 'pending');
				if (!found) {
					prevState.push({
						field: 'pending',
						label: 'Pending',
						value: true,
						type: 'boolean',
						displayNone: true,
					});
				}
				return [...prevState];
			});
		}
	};
	return (
		<div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					gap: 10,
					flexWrap: 'wrap',
				}}
			>
				{filters.map((filter, index) => {
					return (
						<div
							style={{
								color: 'white',
								marginBottom: 10,
								display: filter.displayNone ? 'none' : 'flex',
								flexDirection: 'column',
							}}
						>
							<label>
								{filter.label}:{' '}
								<DeleteOutlined
									style={{ float: 'right', position: 'relative', top: 4 }}
									onClick={() => {
										let newFilters = [...filters];
										newFilters = newFilters.filter((f, i) => i !== index);
										setFilters(newFilters);
									}}
								/>
							</label>
							{filter.type === 'string' && (
								<Input
									value={filter.value}
									onChange={(e) => {
										const newFilters = [...filters];
										newFilters[index].value = e.target.value;
										setFilters(newFilters);
									}}
									style={{ width: 200 }}
									placeholder={filter.label}
								/>
							)}
							{filter.type === 'range' && (
								<Slider
									range
									defaultValue={[1, 10]}
									value={filter.value}
									style={{ width: 200, backgroundColor: 'red' }}
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
									style={{ marginLeft: 10, width: 50, marginTop: 7 }}
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
									className="select-box"
									style={{ width: 200 }}
									placeholder="Select value"
									value={filter.value}
									onChange={(e) => {
										const newFilters = [...filters];
										if (['kyc', 'bank'].includes(filter.field)) {
											addPendingType(e, index);
										} else {
											if (e === -1) {
												newFilters[index].value = null;
											} else {
												newFilters[index].value = e;
											}
											setFilters(newFilters);
										}
									}}
								>
									{filter?.options.map((f) => (
										<Option value={f.value}>{f.label}</Option>
									))}
								</Select>
							)}
							{filter.type === 'date' && (
								<DatePicker
									suffixIcon={null}
									className="date-box"
									style={{
										width: 200,
										backgroundColor: '#202980',
										color: 'white',
									}}
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
			</div>

			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					gap: 10,
					marginTop: 20,
					position: 'relative',
					top: 6,
				}}
			>
				<div>
					<Select
						className="select-box"
						showSearch
						style={{ width: 150 }}
						placeholder="Add filter"
						value={field}
						onChange={(value) => {
							setField(null);
							const found = filters.find((f) => f.field === value);

							if (found) {
								message.error('Filter already exists');
							} else {
								const fieldValue = {
									field: value,
									type: fieldKeyValue[value].type,
									label: fieldKeyValue[value].label,
									value: fieldKeyValue[value].value,
									options: fieldKeyValue[value]?.options,
								};
								setFilters((prevState) => {
									prevState.push(fieldValue);
									return [...prevState];
								});
							}
						}}
					>
						{Object.keys(fieldKeyValue)
							.filter((key) => !filters.find((filter) => filter.field === key))
							.map((key) => (
								<Option value={key}>{fieldKeyValue[key].label}</Option>
							))}
					</Select>
				</div>

				<div>
					<Button
						onClick={() => {
							handleFilters();
						}}
						icon={<SearchOutlined />}
						style={{
							backgroundColor: '#288500',
							color: 'white',
							flex: 1,
							height: 35,
						}}
						type="default"
					>
						Search
					</Button>
					<div
						onClick={() => {
							if (canReset) {
								setFilters(defaultFilters);
								handleFilters([]);
							}
						}}
						style={{
							marginTop: 5,
							textAlign: 'center',
							cursor: 'pointer',
							textDecoration: 'underline',
							color: canReset ? 'white' : 'grey',
						}}
					>
						Reset
					</div>
				</div>
			</div>

			<div style={{ marginLeft: 30 }}></div>
		</div>
	);
};

export default UseFilters;
