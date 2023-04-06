import React, { useState } from 'react';
import { connect } from 'react-redux';
import { DatePicker, Input, Select, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';

const dateFormat = 'YYYY/MM/DD';

const DateField = ({ handleRemove, value, onHandleFieldChange }) => {
	const onChangeStart = (date, dateString) => {
		onHandleFieldChange({ start_date: moment(dateString).format() });
	};

	const onChangeEnd = (date, dateString) => {
		onHandleFieldChange({ end_date: moment(dateString).format() });
	};

	return (
		<div className="d-flex">
			<div>
				<div className="label-content">Wallets created from</div>
				<DatePicker
					className="mr-2"
					onChange={onChangeStart}
					format={dateFormat}
				/>
			</div>
			<div>
				<div className="label-content">
					Wallets created from{' '}
					<span className="underline-text" onClick={() => handleRemove(value)}>
						(Remove)
					</span>
				</div>
				<DatePicker onChange={onChangeEnd} format={dateFormat} />
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
	const object = { type, label, name };

	const onHandle = (e) => {
		const { name, value } = e.target;
		onHandleFieldChange({ [name]: value });
	};

	const onHandleSelect = (value) => {
		onHandleFieldChange({ currency: value.toLowerCase() });
	};

	const handleField = (handleRemove) => {
		switch (type) {
			case 'select':
				return (
					<Select
						options={value === 'currency' && coinOptions}
						placeholder={value === 'currency' ? 'Currency' : 'Network'}
						{...object}
						onChange={onHandleSelect}
					/>
				);
			case 'number':
				return <Input type="number" {...object} onChange={onHandle} />;
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
				return <Input {...object} onChange={onHandle} />;
		}
	};
	return (
		<div className="mr-2">
			{type !== 'time-picker' && (
				<div className="label-content">
					{label}{' '}
					<span
						className="mr-2 cursor-pointer underline-text"
						onClick={() => handleRemove(value)}
					>
						(Remove)
					</span>
				</div>
			)}
			{handleField(handleRemove)}
		</div>
	);
};

const MultiFilter = ({ fields, onHandle, coins }) => {
	const [options, setOptions] = useState(fields);
	const [fieldsData, setFieldsData] = useState([]);
	const [filterData, setFilterData] = useState({});

	const onHandleSelect = (e) => {
		const tempfield = options.filter((field) => {
			return field.value === e;
		});
		const tempOptions = options.filter((field) => {
			return field.value !== e;
		});
		setOptions([...tempOptions]);
		setFieldsData([...fieldsData, ...tempfield]);
	};

	const onHandleRemove = (e) => {
		const tempfield = fieldsData.filter((field) => {
			return field.value === e;
		});
		const tempOptions = fieldsData.filter((field) => {
			return field.value !== e;
		});
		onHandle(e, 'remove');
		setOptions([...tempfield, ...options]);
		setFieldsData([...tempOptions]);
	};

	const onHandleFieldChange = (value) => {
		setFilterData({ ...filterData, ...value });
	};

	const coinOptions = Object.keys(coins).map((data) => {
		return { value: data.toUpperCase(), text: data.toUpperCase() };
	});

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
			{options.length ? (
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
				disabled={Object.keys(filterData).length === 0}
				onClick={() => onHandle(filterData)}
			>
				Search
			</Button>
		</div>
	);
};

const mapStateToProps = (state) => ({
	coins: state.app.coins,
});

export default connect(mapStateToProps)(MultiFilter);
