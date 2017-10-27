import React from 'react';
import classnames from 'classnames';

const TradeBlock = ({ children, title, overflowY = false }) => {
  return (
    <div className="trade_block-wrapper d-flex flex-column">
      <div className="trade_block-title">
        {title}
      </div>
      <div className={classnames(
        'trade_block-content', 'd-flex', 'd', {
          'overflow-y': overflowY,
        }
      )}>
        {children}
      </div>
    </div>
  );
}

export default TradeBlock;
