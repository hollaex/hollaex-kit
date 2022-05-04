import React, { useState } from 'react';
import { Select, Form, Row, DatePicker, Radio } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import STRINGS from 'config/localizedStrings';
import { dateFilters } from '../filterUtils';

const { Option } = Select;
const { RangePicker } = DatePicker;

const STATUS_OPTIONS = {
	pending: {
		name: STRINGS['TRANSACTION_STATUS.PENDING'],
		value: 'pending',
	},
	rejected: {
		name: STRINGS['TRANSACTION_STATUS.REJECTED'],
		value: 'dismissed',
	},
	completed: {
		name: STRINGS['TRANSACTION_STATUS.COMPLETED'],
		value: 'completed',
	},
};

const Filters = ({ coins = {}, onSearch, formName }) => {
	const [form] = Form.useForm();
	const [click, setClick] = useState(false);

	const onValuesChange = (_, values) => {
		if (values) {
			if (values.size) {
				const {
					[values.size]: { range },
				} = dateFilters;
				if (click) {
					form.setFieldsValue({ range: values.range });
					onSearch(values);
				} else {
					form.setFieldsValue({ range });
					values.range = range;
					onSearch(values);
				}
				setClick(false);
			} else if (!values.range) {
				values.range = [];
				onSearch(values);
				setClick(false);
			} else if (values.range && values.range[0] && values.range[1]) {
				onSearch(values);
				setClick(false);
			}
		}
	};
	const handleDateRange = () => {
		setClick(true);
	};

	return (
		<Form
			form={form}
			name={`${formName}-filters`}
			className="ant-advanced-search-form"
			onValuesChange={onValuesChange}
			initialValues={{
				status: null,
				currency: null,
				size: 'all',
			}}
		>
			<Row gutter={24}>
				<Form.Item
					name="status"
					label={STRINGS['STATUS']}
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
						<Option value={null}>{STRINGS['ALL']}</Option>
						{Object.entries(STATUS_OPTIONS).map(([_, { name, value }]) => (
							<Option key={value} value={value}>
								{name}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					name="currency"
					label={STRINGS['ASSET_TXT']}
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
						<Option value={null}>{STRINGS['ALL']}</Option>
						{Object.entries(coins).map(([_, { symbol, fullname }]) => (
							<Option key={symbol} value={symbol}>
								{fullname}
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
						placeholder={[STRINGS['START_DATE'], STRINGS['END_DATE']]}
						onChange={handleDateRange}
					/>
				</Form.Item>
			</Row>
		</Form>
	);
};

export default Filters;
