import React, { useEffect } from 'react';
import { Select, Form, Row, DatePicker, Button, Radio } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { dateFilters } from '../filterUtils';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Filters = ({ pairs, onSearch }) => {
	const [form] = Form.useForm();

	useEffect(() => {
		form.submit();
		//  TODO: Fix react-hooks/exhaustive-deps
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onFinish = (values) => {
		onSearch(values);
	};

	const onValuesChange = ({ size }, _) => {
		if (size) {
			const {
				[size]: { range },
			} = dateFilters;
			form.setFieldsValue({ range });
		}
	};

	return (
		<Form
			form={form}
			name="trade-and-order-filters"
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
						className="custom-select-input-style no-border"
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
					<Button type="ghost" htmlType="submit" size="small">
						Search
					</Button>
				</Form.Item>
			</Row>
		</Form>
	);
};

export default Filters;
