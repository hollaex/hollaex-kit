import React, { useRef } from 'react';
import { Input, Button } from 'antd';
import { DeleteOutlined, LinkOutlined } from '@ant-design/icons';

const String = ({ label, onReset, name, value, onChange, onAddLink }) => {
	const ref = useRef(null);
	const addLink = () => {
		onAddLink(value, name);
		if (ref && ref.current) {
			ref.current.focus({
				cursor: 'end',
			});
		}
	};
	return (
		<div className="p-1">
			<label>{label}:</label>
			<div className="d-flex align-items-center">
				<Input
					type="text"
					name={name}
					ref={ref}
					placeholder="text"
					className="operator-controls__input mr-2"
					value={value}
					onChange={onChange}
				/>
				<Button
					ghost
					shape="circle"
					size="small"
					className="operator-controls__all-strings-settings-button"
					onClick={onReset}
					icon={<DeleteOutlined />}
				/>
				<Button
					ghost
					shape="circle"
					size="small"
					className="operator-controls__all-strings-settings-button ml-1"
					onClick={addLink}
					icon={<LinkOutlined />}
				/>
			</div>
		</div>
	);
};

export default String;
