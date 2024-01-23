import React, { useState } from 'react';
import { connect } from 'react-redux';
import { DatePicker, Input, Select, Button, Checkbox } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';

const dateFormat = 'YYYY/MM/DD';

const DateField = ({ handleRemove, name, value, onHandleFieldChange }) => {
	const onChangeStart = (date, dateString) => {
		onHandleFieldChange({
			start_date: dateString ? moment(dateString).format() : '',
		});
	};

	const onChangeEnd = (date, dateString) => {
		onHandleFieldChange({
			end_date: dateString ? moment(dateString).format() : '',
		});
	};

	return (
		<div className="d-flex">
			<div>
				<div className="label-content">Wallets created from</div>
				<DatePicker
					className="mr-2"
					onChange={onChangeStart}
					format={dateFormat}
					value={value?.start_date ? moment(value?.start_date, dateFormat) : ''}
				/>
			</div>
			<div>
				<div className="label-content">
					Wallets created to{' '}
					<span
						className="underline-text cursor-pointer"
						onClick={() => handleRemove(name)}
					>
						(Remove)
					</span>
				</div>
				<DatePicker
					onChange={onChangeEnd}
					format={dateFormat}
					value={value?.end_date ? moment(value?.end_date, dateFormat) : ''}
				/>
			</div>
		</div>
	);
};

const FieldComponent = ({
	field,
	handleRemove,
	onHandleFieldChange,
	coinOptions,
}) => {
	const { type, label, value, name } = field;
	const object = { type, label, name, value };

	const onHandle = (e) => {
		const { name, value } = e.target;
		onHandleFieldChange({ [name]: value });
	};

	const onHandleSelect = (value) => {
		onHandleFieldChange({ currency: value.toLowerCase() });
	};

	const onHandleCheck = (value) => {
		onHandleFieldChange({ is_valid: value.target.checked });
	};

	const handleField = (handleRemove, value) => {
		switch (type) {
			case 'select':
				return (
					<Select
						options={coinOptions}
						placeholder={'Currency'}
						{...object}
						onChange={onHandleSelect}
					/>
				);
			case 'number':
				return (
					<Input
						type="number"
						{...object}
						placeholder={'Input User ID'}
						onChange={onHandle}
					/>
				);
			case 'boolean':
				return (
					<Checkbox
						onChange={onHandleCheck}
						defaultChecked={true}
						style={{ color: 'white', marginTop: 5 }}
					>
						Valid Address
					</Checkbox>
				);
			case 'time-picker':
				return (
					<DateField
						{...object}
						name={name}
						handleRemove={handleRemove}
						onHandleFieldChange={onHandleFieldChange}
					/>
				);
			default:
			case 'text':
				return (
					<Input
						placeholder={name === 'network' ? 'Input network' : 'Input address'}
						{...object}
						onChange={onHandle}
					/>
				);
		}
	};

	return (
		<div className="mr-2">
			{type !== 'time-picker' && (
				<div className="label-content">
					{label}{' '}
					<span
						className="mr-2 cursor-pointer underline-text"
						onClick={() => handleRemove(name)}
					>
						(Remove)
					</span>
				</div>
			)}
			{handleField(handleRemove, value)}
		</div>
	);
};

const MultiFilter = ({
	fields,
	filterOptions,
	onHandle,
	coins,
	setIsLoading,
	isLoading,
	buttonText = null,
	alwaysEnabled = false,
	onDownload = null,
}) => {
	const [options, setOptions] = useState(filterOptions);
	const [fieldsData, setFieldsData] = useState([]);
	const [filterData, setFilterData] = useState({});

	const onHandleSelect = (e) => {
		const tempfield = fields.filter((field) => {
			return field.name === e;
		});
		const tempOptions = options.filter((field) => {
			return field.name !== e;
		});
		tempOptions.forEach((data) => {
			data.value = data.name;
		});
		tempfield.forEach((data) => {
			data.value = '';
		});
		setOptions([...tempOptions]);
		setFieldsData([...fieldsData, ...tempfield]);
	};

	const onHandleRemove = (e) => {
		const tempfield = fieldsData.filter((field) => {
			return field.name === e;
		});
		const tempOptions = fieldsData.filter((field) => {
			return field.name !== e;
		});
		tempfield.forEach((data) => {
			data.value = data.name;
		});
		setOptions([...tempfield, ...options]);
		setFieldsData([...tempOptions]);
		onHandleRemoveSearch(e);
	};

	const onHandleFieldChange = (value) => {
		const updatedFieldsData = [...fieldsData];
		const key = Object.keys(value)[0];
		let fieldIndex;
		const filteredFieldData = updatedFieldsData
			.filter((item) => {
				return (
					item.name === key ||
					(item.name === 'time' && ['start_date', 'end_date'].includes(key))
				);
			})
			.map((data) => {
				if (['start_date', 'end_date'].includes(key)) {
					return { ...data, value: { ...data.value, ...value } };
				}
				return { ...data, value: value[key] };
			});
		updatedFieldsData.forEach((data, index) => {
			if (data?.name === filteredFieldData?.[0]?.name) {
				fieldIndex = index;
			}
		});
		updatedFieldsData[fieldIndex] = filteredFieldData?.[0];
		const emptyFields = updatedFieldsData.filter(
			(item) =>
				item?.value === '' ||
				(item?.value?.start_date === '' && item?.value?.end_date === '')
		);
		if (updatedFieldsData.length === emptyFields.length && key !== 'is_valid') {
			onHandle();
		}
		setFieldsData([...updatedFieldsData]);
		setFilterData({ ...filterData, ...value });
	};

	const coinOptions = Object.keys(coins).map((data) => {
		return { value: data.toUpperCase(), text: data.toUpperCase() };
	});

	const onHandleRemoveSearch = (e) => {
		let obj = {};
		Object.keys(filterData).forEach((name) => {
			if (
				name !== e &&
				!(e === 'time' && ['start_date', 'end_date'].includes(name))
			) {
				obj = { ...obj, [name]: filterData[name] };
			}
		});
		setFilterData(obj);
		onHandle(obj);
	};

	const onHandleSearch = () => {
		let obj = {};
		setIsLoading(true);
		Object.keys(filterData).forEach((name) => {
			if (filterData[name] !== '') {
				obj = { ...obj, [name]: filterData[name] };
			}
		});
		if (!onDownload) onHandle(obj);
		else onDownload(obj);
	};

	return (
		<div className="table-filter-wrapper">
			<div className="d-flex">
				{fieldsData.map((field) => {
					return (
						<FieldComponent
							coinOptions={coinOptions}
							onHandleFieldChange={onHandleFieldChange}
							field={field}
							handleRemove={onHandleRemove}
						/>
					);
				})}
			</div>
			{options?.length ? (
				<Select
					options={options}
					defaultValue={'Add filter'}
					value={'Add filter'}
					onChange={onHandleSelect}
					className={`mr-2 ${fieldsData.length ? 'select-content' : ''}`}
				/>
			) : (
				''
			)}
			<Button
				type="primary"
				icon={<SearchOutlined />}
				placeholder="Search"
				className={
					fieldsData.length
						? 'search-content mr-2 filter-button green-btn'
						: 'filter-button green-btn'
				}
				disabled={
					!alwaysEnabled &&
					(isLoading ||
						Object.keys(filterData).length === 0 ||
						!Object.values(filterData)
							.map((field) => field === '')
							.filter((item) => !item)?.length)
				}
				onClick={onHandleSearch}
			>
				{buttonText || 'Search'}
			</Button>
		</div>
	);
};

const mapStateToProps = (state) => ({
	coins: state.app.coins,
});

export default connect(mapStateToProps)(MultiFilter);
