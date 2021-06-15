import React, { useState } from 'react';
import classnames from 'classnames';
import { Select, Form, Row, DatePicker, Button, Radio } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { dateFilters } from '../filterUtils';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Filters = ({ pairs, onSearch, formName }) => {
	const [form] = Form.useForm();
	const [isSearchShining, setIsSearchShining] = useState(false);

	const onFinish = (values) => {
		onSearch(values);
		setIsSearchShining(false);
	};

	const onValuesChange = ({ size }, _) => {
		if (size) {
			const {
				[size]: { range },
			} = dateFilters;
			form.setFieldsValue({ range });
		}
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
				symbol: null,
				size: 'all',
			}}
		>
			<Row gutter={24}>
				<Form.Item
					name="symbol"
					label="Pair"
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
						{Object.entries(pairs).map(([_, { name }]) => (
							<Option key={name} value={name}>
								{name.toUpperCase()}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item name="size">
					<Radio.Group buttonStyle="outline" size="small">
						{Object.entries(dateFilters).map(([key, { name }]) => (
							<Radio.Button key={key} value={key}>
								{name}
							</Radio.Button>
						))}
					</Radio.Group>
				</Form.Item>
				<Form.Item name="range">
					<RangePicker
						allowEmpty={[true, true]}
						size="small"
						suffixIcon={false}
					/>
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
