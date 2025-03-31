import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Select } from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Coin } from 'components';
import STRINGS from 'config/localizedStrings';

const { Option } = Select;

const Filters = ({ pairs, pair, onChange }) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div>
			<Select
				style={{
					width: 100,
				}}
				size="small"
				className="custom-select-input-style elevated markets-select-input"
				dropdownClassName="custom-select-style markets-select-dropdown"
				bordered={false}
				suffixIcon={isOpen ? <CaretUpOutlined /> : <CaretDownOutlined />}
				onDropdownVisibleChange={(open) => {
					setIsOpen(open);
				}}
				value={pair}
				onChange={onChange}
				showSearch
			>
				<Option value={''}>{STRINGS['ALL']}</Option>
				{Object.entries(pairs).map(
					([pair, { pair_base_display, pair_2_display, icon_id }]) => (
						<Option key={pair} value={pair}>
							<span className="d-flex align-items-center market-option">
								<Coin iconId={icon_id} type="CS2" />
								{`${pair_base_display}-${pair_2_display}`}
							</span>
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
