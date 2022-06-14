import React, { useState, useEffect } from 'react';
import { Select, Form, Row, DatePicker, Radio } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import STRINGS from 'config/localizedStrings';
import { dateFilters } from '../filterUtils';
import moment from 'moment';

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

const Filters = ({ coins = {}, onSearch, formName, activeTab }) => {
	const [form] = Form.useForm();
	const [click, setClick] = useState([]);

	useEffect(() => {
		form.setFieldsValue({
			status: null,
			currency: null,
			size: 'all',
		});
	}, [activeTab, form]);

	useEffect(() => {
		if (
			click.length &&
			!click.filter((d) => d === undefined).length &&
			form.getFieldValue('range').length &&
			!form.getFieldValue('range').filter((d) => d === undefined).length
		) {
			if (
				!moment(click[0]).isSame(form.getFieldValue('range')[0]) &&
				!moment(click[1]).isSame(form.getFieldValue('range')[1])
			) {
				form.setFieldsValue({ range: click });
				onSearch(form.getFieldsValue());
			}
		} else if (click.length && !form.getFieldValue('range').length) {
			form.setFieldsValue({ range: click });
			onSearch(form.getFieldsValue());
		}
	}, [click, form, onSearch]);

	const onValuesChange = (_, values) => {
		if (values) {
			if (values.size) {
				const {
					[values.size]: { range },
				} = dateFilters;
				form.setFieldsValue({ range });
				values.range = range;
				if (_.range === undefined) {
					onSearch(values);
				}
			}
		}
	};

	const handleDateRange = (e) => {
		if (e.length > 1 && e[0] && e[1]) {
			setClick(e);
		}
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
