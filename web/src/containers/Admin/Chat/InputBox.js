import React, { useState } from 'react';
import { Input } from 'antd';
const Search = Input.Search;

export const InputBox = ({
	placeholder = '',
	onSearch = () => {},
	type = 'text',
	enterButton = 'SEND',
}) => {
	const [value, setValue] = useState('');

	const handleSearch = (val = '') => {
		const searchValue = val?.trim();
		if (searchValue) {
			onSearch(searchValue);
			setValue('');
		}
	};

	return (
		<Search
			placeholder={placeholder}
			value={value}
			onChange={(e) => setValue(e.target?.value)}
			onSearch={handleSearch}
			type={type}
			enterButton={enterButton}
			size="large"
		/>
	);
};
