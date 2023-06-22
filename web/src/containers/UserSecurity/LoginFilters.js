import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Select, Form, Row, DatePicker, Radio } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import moment from 'moment';

import { dateFilters } from 'containers/TransactionsHistory/filterUtils';
import STRINGS from 'config/localizedStrings';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Filters = ({ onSearch, formName, disabled }) => {
	const [form] = Form.useForm();
	const [click, setClick] = useState([]);
	const [customSel, setCustomSel] = useState(false);

	useEffect(() => {
		form.setFieldsValue({
			size: 'all',
			status: 'all',
		});
		setCustomSel(false);
	}, [form]);

	useEffect(() => {
		if (
			click.length &&
			!click.filter((d) => d === undefined).length &&
			form.getFieldValue('range').length &&
			!form.getFieldValue('range').filter((d) => d === undefined).length
		) {
			form.setFieldsValue({ range: click });
			onSearch(form.getFieldsValue());
		} else if (click.length && !form.getFieldValue('range').length) {
			form.setFieldsValue({ range: click });
			onSearch(form.getFieldsValue());
		}
	}, [click, form, onSearch]);

	const onValuesChange = (_, values) => {
		if (values) {
			if (values.size) {
				setCustomSel(false);
				const {
					[values.size]: { range },
				} = dateFilters();
				form.setFieldsValue({ range });
				values.range = range;
				if (_.range === undefined) {
					onSearch(values);
				}
			} else {
				if (_.range === undefined) {
					onSearch(values);
				}
			}
		}
	};

	const handleDateRange = (e) => {
		const data = {
			...form.getFieldsValue(),
			range: [],
		};
		if (!e) {
			onSearch(data);
		} else if (e && e.length > 1 && e[0] && e[1]) {
			const firstDate = moment(e[0]).format('DD/MMM/YYYY');
			const secondDate = moment(e[1]).format('DD/MMM/YYYY');
			if (firstDate === secondDate) {
				setClick([moment(e[0]), moment(e[1]).add(1, 'days')]);
			} else {
				setClick(e);
			}
		}
	};

	const Customselection = (e) => {
		const data = {
			...form.getFieldsValue(),
			range: [],
		};
		if (e === 'custom' && !customSel) {
			setCustomSel(true);
			form.setFieldsValue({
				size: '',
				range: [],
			});
			onSearch(data);
		} else {
			if (!click.length) {
				setCustomSel(false);
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
				size: 'all',
				status: 'all',
			}}
		>
			<Row gutter={24}>
				<Form.Item
					name="status"
					label={STRINGS['LOGINS_HISTORY.CONTENT.FILTER.STATUS']}
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
						<Option value="all">
							{STRINGS['LOGINS_HISTORY.CONTENT.FILTER.ALL']}
						</Option>
						<Option value="failed">
							{STRINGS['LOGINS_HISTORY.CONTENT.FILTER.FAILED']}
						</Option>
						<Option value="success">
							{STRINGS['LOGINS_HISTORY.CONTENT.FILTER.SUCCESS']}
						</Option>
					</Select>
				</Form.Item>
				<Form.Item name="size">
					<Radio.Group size="small">
						{Object.entries(dateFilters()).map(([key, { name }]) => (
							<Radio.Button key={key} value={key}>
								{name}
							</Radio.Button>
						))}
					</Radio.Group>
				</Form.Item>
				<Form.Item
					size="small"
					onClick={() => Customselection('custom')}
					className={customSel ? 'cusStyle1' : 'cusStyle2'}
				>
					Custom
				</Form.Item>
				{customSel && (
					<Form.Item name="range">
						<RangePicker
							allowEmpty={[true, true]}
							size="small"
							suffixIcon={false}
							placeholder={[STRINGS['START_DATE'], STRINGS['END_DATE']]}
							onChange={handleDateRange}
						/>
					</Form.Item>
				)}
			</Row>
		</Form>
	);
};

const mapStateToProps = (state) => ({
	activeLanguage: state.app.language,
});

export default connect(mapStateToProps)(Filters);
