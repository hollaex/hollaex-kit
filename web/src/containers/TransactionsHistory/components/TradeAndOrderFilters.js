import React from 'react';
import { Select, Form, Row, DatePicker, Radio } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { dateFilters } from '../filterUtils';
import STRINGS from '../../../config/localizedStrings';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Filters = ({ pairs, onSearch, formName }) => {
	const [form] = Form.useForm();

	const onValuesChange = (_, values) => {
		if (values) {
			if (values.size) {
				const {
					[values.size]: { range },
				} = dateFilters;
				form.setFieldsValue({ range });
				values.range = range;
				onSearch(values);
			} else if (!values.range) {
				values.range = [];
				onSearch(values);
			} else if (values.range && values.range[0] && values.range[1]) {
				onSearch(values);
			}
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
					/>
				</Form.Item>
			</Row>
		</Form>
	);
};

export default Filters;
