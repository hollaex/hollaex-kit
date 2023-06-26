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
const UseFilters = ({
	applyFilters,
}) => {
	const { Option } = Select;
	const fieldKeyValue = {
		id: { type: 'string', label: 'User ID' },
		email: { type: 'string', label: 'Email' },
		username: { type: 'string', label: 'User Name' },
		full_name: { type: 'string', label: 'Full Name' },
		start_date: { type: 'date', label: 'User Creation Date Start' },
		end_date: { type: 'date', label: 'User Creation Date End' },
		dob_start_date: { type: 'date', label: 'User DOB Date Start' },
		dob_end_date: { type: 'date', label: 'User DOB Date End' },
		gender: {
			type: 'dropdown',
			label: 'Gender',
			options: [
				{ label: 'None', value: -1 },
				{ label: 'Male', value: 0 },
				{ label: 'Female', value: 1 },
			],
		},
		nationality: { 
			type: 'dropdown',
			label: 'Nationality',
			options: COUNTRIES_OPTIONS 
		},
		phone_number: { type: 'string', label: 'Phone Number' },
		verification_level:{
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

	const [filters, setFilters] = useState([
		{ field: 'id', type: 'string', label: 'User ID', value: null },
	]);

	const kycFields = [
		{ key: -1, value: 'None' },
		{ key: 0, value: 'Not complete' },
		{ key: 1, value: 'Pending' },
		{ key: 2, value: 'Rejected' },
		{ key: 3, value: 'Approved' },
	]
	
	const [selectedKyc, setSelectedKyc] = useState();

	const [field, setField] = useState();
	const dateFormat = 'YYYY/MM/DD';

	const hasPendingTypeBank = filters?.find((f) => f.field === 'bank');
	const canReset = filters?.find(filter => filter.value != null && filter.value !== '');
	
	const handleFilters = (selectedFilters = null) => {
		const queryFilters = {};

		if (!selectedFilters) selectedFilters = filters;
		selectedFilters.forEach((filter) => {
			if (filter.value != null && filter.value !== '') queryFilters[filter.field] = filter.value;
		});

		applyFilters(queryFilters);
	};

	const addPendingType = (field, value, label) => {
		const found = filters.find((f) => f.field === field && f.value === value);

		if (found) {
			setFilters((prevState) => {
				prevState = prevState.filter((f) => f.field !== field || f.value !== value);
				if (!prevState.find(f => ['bank', 'kyc'].includes(f.field)))
					prevState = prevState.filter((f) => f.field !== 'pending');
				handleFilters(prevState);
				return [...prevState];
			});
		} else {
			const fieldValue = {
				field,
				label,
				value,
				displayNone: true 
			};
			setFilters((prevState) => {
				prevState.push(fieldValue);
				const found = filters.find((f) => f.field === 'pending');
				if (!found) { prevState.push( {field:'pending', label: 'Pending', value: true,  type: 'boolean', displayNone: true  }); }
				handleFilters(prevState);
				return [...prevState];
			});
		}
	
	}
	return (
		<>
		<div>ƒ⇣ Filters</div>
		<div style={{
			display: 'flex',
			gap: 10,
			marginTop:15,
			marginBottom:15,
		}}>
				<Select
					showSearch
					className='select-box user-scroll-box'
					style={{ width: 200 }}
					value={selectedKyc}
					placeholder="User ID Verification"
					onChange={(e) => {
						if (e === -1) {
							setSelectedKyc();
							setFilters((prevState) => {
								prevState = prevState.filter((f) => f.field !== 'kyc');
								if (!prevState.find(f => ['bank', 'kyc'].includes(f.field)))
									prevState = prevState.filter((f) => f.field !== 'pending');
								handleFilters(prevState);
								return [...prevState];
							});
						} else{
							setSelectedKyc(e);
							addPendingType('kyc', e, 'Id')
						}
					}}
				>
					{kycFields.map((f) => (
						<Option value={f.key}>{f.value}</Option>
					))}
				</Select>

			<Button 
				onClick={() => { addPendingType('bank', 1, 'Bank') }}
				style={{ background: "#202980", borderColor: hasPendingTypeBank ? 'white' : "#ccc", color: hasPendingTypeBank ? 'white' : "#ccc"}} >Pending User Bank Verification</Button>
		</div>

		 <div style={{ display: 'flex',  flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
			{filters.map((filter, index) => {
						return (
							<div style={{ color: 'white', marginBottom: 10, display: filter.displayNone ? 'none' :  'flex',  flexDirection: 'column' }}>
								<label>
									{filter.label}:{' '}
									<DeleteOutlined
										style={{ float: 'right', position:'relative', top: 4 }}
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
										style={{  width: 200 }}
										placeholder={filter.label}
									/>
								)}
								{filter.type === 'range' && (
									<Slider
										range
										defaultValue={[1, 10]}
										value={filter.value}
										style={{ width: 200, backgroundColor:"red" }}
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
										className='select-box'
										style={{ width: 200,}}
										placeholder="Select value"
										value={filter.value}
										onChange={(e) => {
											const newFilters = [...filters];
											if (e === -1) {
												newFilters[index].value = null
											} else {
												newFilters[index].value = e;
											}
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
										suffixIcon={null} 
										className='date-box'
										style={{ width: 200, backgroundColor: '#202980', color: 'white'}}
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
		
			<div style={{ display:'flex', flexDirection:'row', gap: 10, marginTop:20}}> 
				<div>
				<Select
					className='select-box'
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
					{Object.keys(fieldKeyValue).filter(key => !filters.find(filter => filter.field === key)).map((key) => (
						<Option value={key}>{fieldKeyValue[key].label}</Option>
					))}
				</Select>
				</div >
				
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
						Apply
					</Button>
					<div
						onClick={() => {
							if	(canReset) {
								setFilters([{ field: 'id', type: 'string', label: 'User ID', value: null }]);
								setSelectedKyc();
								handleFilters([]);
							}
							
						}}
						style={{
							marginTop: 5,
							textAlign:'center',
							cursor:'pointer',
							textDecoration:'underline',
							color: canReset ? 'white' : 'grey'
						}}
					>
						Reset
					</div>
				</div>
			</div>

			<div style={{ marginLeft: 30 }}>

			</div>
	
		
		</>
	);
};

export default UseFilters;
