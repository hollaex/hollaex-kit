import React, { useState } from 'react';
import classnames from 'classnames';
import { Select, Form, Row, Button } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import STRINGS from 'config/localizedStrings';

const { Option } = Select;

const STATUS_OPTIONS = {
	pending: {
		name: STRINGS['TRANSACTION_STATUS.PENDING'],
		value: 'pending',
	},
	rejected: {
		name: STRINGS['TRANSACTION_STATUS.REJECTED'],
		value: 'rejected',
	},
	completed: {
		name: STRINGS['TRANSACTION_STATUS.COMPLETED'],
		value: 'completed',
	},
};

const Filters = ({ coins = {}, onSearch, formName }) => {
	const [form] = Form.useForm();
	const [isSearchShining, setIsSearchShining] = useState(false);

	const onFinish = (values) => {
		onSearch(values);
		setIsSearchShining(false);
	};

	const onValuesChange = () => {
		setIsSearchShining(true);
	};

	return (
		<Form
			form={form}
			name={`${formName}-filters`}
			className="ant-advanced-search-form"
			onFinish={onFinish}
			onValuesChange={onValuesChange}
			initialValues={{
				status: null,
				currency: null,
			}}
		>
			<Row gutter={24}>
				<Form.Item
					name="status"
					label="Status"
					rules={[
						{
							message: 'Input something!',
						},
					]}
				>
					<Select
						style={{
							width: 100,
						}}
						size="small"
						className="custom-select-input-style elevated"
						dropdownClassName="custom-select-style"
						bordered={false}
						suffixIcon={<CaretDownOutlined />}
					>
						<Option value={null}>All</Option>
						{Object.entries(STATUS_OPTIONS).map(([_, { name, value }]) => (
							<Option key={value} value={value}>
								{name}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					name="currency"
					label="Asset"
					rules={[
						{
							message: 'Input something!',
						},
					]}
				>
					<Select
						style={{
							width: 100,
						}}
						size="small"
						className="custom-select-input-style elevated"
						dropdownClassName="custom-select-style"
						bordered={false}
						suffixIcon={<CaretDownOutlined />}
					>
						<Option value={null}>All</Option>
						{Object.entries(coins).map(([_, { symbol, fullname }]) => (
							<Option key={symbol} value={symbol}>
								{fullname}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item>
					<Button
						type="ghost"
						htmlType="submit"
						size="small"
						className={classnames({ active_search_button: isSearchShining })}
					>
						Search
					</Button>
				</Form.Item>
			</Row>
		</Form>
	);
};

export default Filters;
