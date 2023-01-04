import React from 'react';
import { Select, Input, DatePicker } from 'antd';

const { Search } = Input;
const BillingFilter = () => {
	return (
		<div className="d-flex mt-5">
			<Select style={{ width: 150 }} className="mr-3" defaultValue="Type">
				{/* {selectOptions.map((option, index) => (
                <Select.Option key={index} value={option.value}>
                    {option.label}
                </Select.Option>
            ))} */}
			</Select>
			<DatePicker className="mr-3" placeholder={'Start Date'} />
			<DatePicker className="mr-3" placeholder="End Date" />
			<Search
				placeholder=""
				style={{ width: 200, background: '#1c661c' }}
				className="mr-3"
			/>
		</div>
	);
};

export default BillingFilter;
