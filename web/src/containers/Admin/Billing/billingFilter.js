import React, { useState } from 'react';
import { Select, Input, DatePicker } from 'antd';

const { Search } = Input;
const BillingFilter = () => {
	const [searchInput, setSearchInput] = useState('');
	return (
		<div className="d-flex mt-5 billing-filter">
			<Select
				style={{ width: 150 }}
				className="mr-3"
				defaultValue="Type"
			></Select>
			<DatePicker className="mr-3" placeholder={'Start Date'} />
			<DatePicker className="mr-3" placeholder="End Date" />
			<Search
				placeholder=""
				style={{ width: 200 }}
				onChange={(e) => setSearchInput(e.target.value)}
				className={`mr-3 ${searchInput.length ? 'search-active' : ''}`}
			/>
		</div>
	);
};

export default BillingFilter;
