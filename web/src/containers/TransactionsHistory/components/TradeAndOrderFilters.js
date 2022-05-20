import React, { useState, useEffect } from 'react';
import { Select, Form, Row, DatePicker, Radio } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { dateFilters } from '../filterUtils';
import STRINGS from '../../../config/localizedStrings';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Filters = ({ pairs, onSearch, formName, activeTab }) => {
	const [form] = Form.useForm();
	const [click, setClick] = useState([]);

	useEffect(() => {
		form.setFieldsValue({
			range: [],
			symbol: null,
			size: 'all',
			type: 'active',
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
				symbol: null,
				size: 'all',
				type: 'active',
			}}
		>
			<Row gutter={24}>
				{formName === 'orders' ? (
					<Form.Item
						name="type"
						label={STRINGS['ORDER_TYPE']}
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
							<Option value="active">
								{STRINGS['DEVELOPER_SECTION.ACTIVE']}
							</Option>
							<Option value="closed">{STRINGS['ORDER_HISTORY_CLOSED']}</Option>
						</Select>
					</Form.Item>
				) : null}
				<Form.Item
					name="symbol"
					label={STRINGS['PAIR']}
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
						{Object.entries(pairs).map(
							([_, { name, pair_base_display, pair_2_display }]) => (
								<Option key={name} value={name}>
									{`${pair_base_display}-${pair_2_display}`}
								</Option>
							)
						)}
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
