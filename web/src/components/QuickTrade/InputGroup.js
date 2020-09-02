import React, { Fragment } from 'react';
import { oneOfType, array, string, func, number } from 'prop-types';
import { Select, Input } from 'antd';
import ReactSVG from 'react-svg';

import { ICONS } from 'config/constants';

const { Option } = Select;
const { Group } = Input;

class InputGroup extends React.PureComponent {
  state = {
    isOpen: false,
  };

  onDropdownVisibleChange = (isOpen) => {
    this.setState({ isOpen })
  }

  handleInputChange = ({ target: { value }}) => {
    this.props.onInputChange(value)
  }

  render() {
    const { isOpen } = this.state;
    const { name, options, inputValue, selectValue, onSelect } = this.props;

    return (
      <Fragment>
        <label>{name}</label>
        <Group
          compact
          className="input-group__container"
        >
          <Select
            size="default"
            showSearch
            filterOption={true}
            className="input-group__select"
            value={selectValue}
            style={isOpen ? { width: '100%' } : { width: '33%' }}
            onSelect={onSelect}
            onDropdownVisibleChange={this.onDropdownVisibleChange}
          >
            {options.map((symbol, index) => (
              <Option name="selectedPairBase" value={symbol} key={index} className="d-flex">
                <div className="d-flex align-items-center">
                  <ReactSVG
                    path={
                      ICONS[`${symbol.toUpperCase()}_ICON`]
                        ? ICONS[`${symbol.toUpperCase()}_ICON`]
                        : ICONS.DEFAULT_ICON
                    }
                    wrapperClassName="market-list__coin-icons"
                  />
                  <span>
										{symbol.toUpperCase()}
									</span>
                </div>
              </Option>
            ))}
          </Select>
          <Input
            type="number"
            placeholder="Amount"
            style={isOpen ? { display: 'none' } : { width: '67%' }}
            className="input-grioup__input"
            value={inputValue}
            onChange={this.handleInputChange}
          />
        </Group>
      </Fragment>
    );
  }
}

InputGroup.propTypes = {
  name: string,
  options: array,
  inputValue: oneOfType([
    number,
    string,
  ]),
  onInputChange: func,
  selectValue: string,
  onSelect: func,
}

export default InputGroup;