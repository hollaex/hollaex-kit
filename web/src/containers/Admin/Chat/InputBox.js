import React from 'react';
import { Input } from 'antd';
const Search = Input.Search;

export const InputBox = ({
	placeholder = '',
	onSearch = () => {},
	type = 'text',
	enterButton = 'SEND',
}) => (
	<Search
		placeholder={placeholder}
		onSearch={onSearch}
		type={type}
		enterButton={enterButton}
		size="large"
	/>
);
