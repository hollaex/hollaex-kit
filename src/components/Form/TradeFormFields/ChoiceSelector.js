import React from 'react';
import classnames from 'classnames';

const ChoiceSelector = (props) => {
  const {
    input,
    options,
  } = props;
  
  return (
    <div className="trade_order_entry-action_selector d-flex">
      {options.map((option, index) =>
        <div
          key={`action-${index}`}
          className={classnames(
            'text-uppercase', 'd-flex', 'justify-content-center', 'align-items-center', 'pointer',
            { active: option === input.value }
          )}
          onClick={() => input.onChange(option)}
        >{option}</div>
      )}
    </div>
  );
}


export default ChoiceSelector;
