import React, { useState } from 'react';
import { Select } from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';

const { Option } = Select;

// todo: add antd component to redux form

const DropDown = (props) => {
	const [isOpen, setIsOpen] = useState(false);
	const {
		input: { onChange, value },
		options,
		isOrderEntry = false,
	} = props;
	return (
		<div className="trade-form-select d-flex align-center justify-content-between">
			<div style={{ width: '50%' }}>
				<EditWrapper stringId="ORDER_MODE">{STRINGS['ORDER_MODE']}</EditWrapper>
				:
			</div>
			<div style={{ width: '50%' }}>
				<Select
					defaultValue={isOrderEntry ? value : options[0].value}
					bordered={false}
					size="small"
					onChange={onChange}
					onClick={() => {
						setIsOpen((prev) => !prev);
					}}
					suffixIcon={isOpen ? <CaretUpOutlined /> : <CaretDownOutlined />}
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
							<EditWrapper>{label}</EditWrapper>
						</Option>
					))}
				</Select>
			</div>
		</div>
	);
};

export default DropDown;
