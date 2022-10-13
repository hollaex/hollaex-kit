import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { generateLanguageFormValues } from 'containers/UserSettings/LanguageForm';
import React, { useEffect, useState } from 'react';
const { Option } = Select;

const LanguageSwitcher = ({ selected, valid_languages, toggle }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [_selected, setSelected] = useState(selected);
	const languageFormValue = generateLanguageFormValues(valid_languages).language
		.options;
	const onSwitch = (val) => {
		setSelected(val);
	};

	useEffect(() => {
		if (toggle && _selected !== selected) toggle(_selected);
	}, [_selected, toggle, selected]);
	return (
		<Select
			value={_selected}
			size="small"
			onSelect={onSwitch}
			bordered={false}
			onClick={() => setIsOpen((prev) => !prev)}
			suffixIcon={isOpen ? <CaretUpOutlined /> : <CaretDownOutlined />}
			className="custom-select-input-style appbar elevated"
			dropdownClassName="custom-select-style select-option-wrapper"
		>
			{languageFormValue.map(({ value, icon, label }) => (
				<Option value={value} key={value} className="capitalize">
					<div className="language_option">
						<img
							width="10px"
							height="10px"
							src={icon}
							alt={label}
							className="mr-2"
						/>
						{label}
					</div>
				</Option>
			))}
		</Select>
	);
};

export default LanguageSwitcher;
