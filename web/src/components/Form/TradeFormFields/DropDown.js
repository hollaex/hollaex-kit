import React from 'react';
import { Select } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import STRINGS from 'config/localizedStrings';

const { Option } = Select;

// todo: add antd component to redux form

const DropDown = (props) => {
	const {
		input: { onChange },
		options,
	} = props;
	return (
		<div className="trade-form-select d-flex align-center justify-content-between">
			<div style={{ width: '50%' }}>{STRINGS['ORDER_MODE']}:</div>
			<div style={{ width: '50%' }}>
				<Select
					defaultValue={options[0].value}
					bordered={false}
					size="small"
					onChange={onChange}
					suffixIcon={<CaretDownOutlined />}
					className="custom-select-input-style w-100 elevated"
					dropdownClassName="custom-select-style select-option-wrapper"
				>
					{options.map(({ value, label }, index) => (
						<Option
							name="selectedPairBase"
							value={value}
							key={index}
							className="d-flex"
						>
							{label}
						</Option>
					))}
				</Select>
			</div>
		</div>
	);
};

export default DropDown;
