import React from 'react';
import 'rc-color-picker/assets/index.css';
import ColorPicker from 'rc-color-picker';
import { Input, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const ColorInput = ({
	colorKey,
	isCalculated,
	colorValue,
	pickerHandler,
	onReset,
	validateColor,
	onChange,
}) => {
	return (
		<div
			className="d-flex justify-content-between align-items-center py-1"
			key={colorKey}
		>
			<div className="bold">{colorKey.split('_')[1].replace(/-/g, ' ')}</div>
			<div className="d-flex align-items-center pl-2">
				{!isCalculated && (
					<ColorPicker
						color={colorValue}
						enableAlpha={false}
						onChange={({ color }) => pickerHandler(color, colorKey)}
						onClose={({ color }) => pickerHandler(color, colorKey)}
						placement="topLeft"
						className="some-class"
						style={{ zIndex: 10002 }}
					>
						<span className="mr-2 rc-color-picker-trigger" />
					</ColorPicker>
				)}
				<Input
					type={isCalculated ? 'number' : 'text'}
					name={colorKey}
					placeholder="Please pick a color"
					className="operator-controls__input mr-2"
					value={colorValue}
					onChange={onChange}
					onBlur={validateColor}
					{...(isCalculated
						? {
								min: 0,
								max: 1,
								step: 0.05,
						  }
						: {})}
				/>
				<Button
					ghost
					shape="circle"
					size="small"
					className="operator-controls__all-strings-settings-button"
					disabled={isCalculated}
					onClick={() => onReset(colorKey)}
					icon={<DeleteOutlined />}
				/>
			</div>
		</div>
	);
};

export default ColorInput;
