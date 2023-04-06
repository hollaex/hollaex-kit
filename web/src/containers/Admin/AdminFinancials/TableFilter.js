import { DatePicker, Input, Select } from 'antd';
import React, { useState } from 'react';

const { Search } = Input;

const DateField = ({ handleRemove, value }) => {
	return (
		<div className="d-flex">
			<div>
				<div className="label-content">Wallets created from</div>
				<DatePicker className="mr-2" />
			</div>
			<div>
				<div className="label-content">
					Wallets created from{' '}
					<span onClick={() => handleRemove(value)}>(Remove)</span>
				</div>
				<DatePicker />
			</div>
		</div>
	);
};

const FieldComponent = ({ field, handleRemove }) => {
	const { type, placeHolder, label, value } = field;
	const object = { placeHolder };
	const handleField = (handleRemove) => {
		switch (type) {
			case 'select':
				return <Select {...object} />;
			case 'number':
				return <Input type="number" {...object} />;
			case 'time-picker':
				return (
					<DateField {...object} handleRemove={handleRemove} value={value} />
				);
			default:
			case 'text':
				return <Input {...object} />;
		}
	};
	return (
		<div className="mr-2">
			{type !== 'time-picker' && (
				<div className="label-content">
					{label}{' '}
					<span className="mr-2" onClick={() => handleRemove(value)}>
						(Remove)
					</span>
				</div>
			)}
			{handleField(handleRemove)}
		</div>
	);
};

const TableFilter = ({ fields }) => {
	const [options, setOptions] = useState(fields);
	const [fileldsData, setFileldsData] = useState([]);

	const onHandleSelect = (e) => {
		const tempfield = options.filter((field) => {
			return field.value === e;
		});
		const tempOptions = options.filter((field) => {
			return field.value !== e;
		});
		setOptions([...tempOptions]);
		setFileldsData([...fileldsData, ...tempfield]);
	};

	const onHandleRemove = (e) => {
		const tempfield = fileldsData.filter((field) => {
			return field.value === e;
		});
		const tempOptions = fileldsData.filter((field) => {
			return field.value !== e;
		});
		setOptions([...tempfield, ...options]);
		setFileldsData([...tempOptions]);
	};

	return (
		<div className="table-filter-wrapper">
			<div className="d-flex">
				{fileldsData.map((field) => {
					return <FieldComponent field={field} handleRemove={onHandleRemove} />;
				})}
			</div>
			{options.length ? (
				<Select
					options={options}
					defaultValue={'add filter'}
					value={'add filter'}
					onChange={onHandleSelect}
					className={`mr-2 ${fileldsData.length ? 'select-content' : ''}`}
				/>
			) : (
				''
			)}
			<Search className={fileldsData.length ? 'search-content mr-2' : ''} />
		</div>
	);
};

export default TableFilter;
