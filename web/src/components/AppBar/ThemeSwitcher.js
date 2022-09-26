import React, { useState } from 'react';
import classnames from 'classnames';
import Image from 'components/Image';
import { FLEX_CENTER_CLASSES } from 'config/constants';
import withConfig from 'components/ConfigProvider/withConfig';
import { Select } from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';

const { Option } = Select;

const ThemeSwitcher = ({ selected, options = [], toggle, icons: ICONS }) => {
	const [isOpen, setIsOpen] = useState(false);
	const handleClick = () => {
		const theme =
			options[0].value === selected ? options[1].value : options[0].value;
		toggle(theme);
	};

	const isSwitch = options.length < 3;

	return (
		<div>
			<div className={classnames('toggle_button-wrapper', 'd-flex')}>
				{isSwitch && (
					<div
						className={classnames(
							'toggle-content',
							'f-0',
							...FLEX_CENTER_CLASSES,
							'direction_ltr'
						)}
					>
						<div className={classnames('selected', selected)}>
							<div
								className={
									'app-bar-account-content app-bar-account-moon-content'
								}
							>
								<Image
									iconId="THEME_SUN,THEME_MOON"
									icon={ICONS['THEME_MOON']}
									wrapperClassName="app-bar-account-moon-icon"
								/>
							</div>
						</div>
						<div
							onClick={handleClick}
							className={classnames('toggle-action_button', {
								left: options[0].value === selected,
								right: options[1].value === selected,
							})}
						>
							<div className="toggle-action_button-display" />
						</div>
						<div className={classnames('selected', selected)}>
							<div
								className={
									'app-bar-account-content app-bar-account-moon-content'
								}
							>
								<Image
									icon={ICONS['THEME_SUN']}
									wrapperClassName="app-bar-account-moon-icon"
								/>
							</div>
						</div>
					</div>
				)}

				{!isSwitch && (
					<Select
						value={selected}
						size="small"
						onSelect={toggle}
						bordered={false}
						onClick={() => setIsOpen((prev) => !prev)}
						suffixIcon={isOpen ? <CaretUpOutlined /> : <CaretDownOutlined />}
						className="custom-select-input-style appbar elevated"
						dropdownClassName="custom-select-style select-option-wrapper"
					>
						{options.map(({ value }) => (
							<Option value={value} key={value} className="capitalize">
								{value}
							</Option>
						))}
					</Select>
				)}
			</div>
		</div>
	);
};

export default withConfig(ThemeSwitcher);
