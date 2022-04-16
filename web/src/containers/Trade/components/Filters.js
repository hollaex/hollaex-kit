import React from 'react';
import { connect } from 'react-redux';
import { Select } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import STRINGS from 'config/localizedStrings';

const { Option } = Select;

const Filters = ({ pairs, pair, onChange }) => {
	return (
		<div>
			<Select
				style={{
					width: 100,
				}}
				size="small"
				className="custom-select-input-style elevated"
				dropdownClassName="custom-select-style"
				bordered={false}
				suffixIcon={<CaretDownOutlined />}
				value={pair}
				onChange={onChange}
			>
				<Option value={''}>{STRINGS['ALL']}</Option>
				{Object.entries(pairs).map(
					([pair, { pair_base_display, pair_2_display }]) => (
						<Option key={pair} value={pair}>
							{`${pair_base_display}-${pair_2_display}`}
						</Option>
					)
				)}
			</Select>
		</div>
	);
};

const mapStateToProps = (state) => ({
	pairs: state.app.pairs,
});

export default connect(mapStateToProps)(Filters);
