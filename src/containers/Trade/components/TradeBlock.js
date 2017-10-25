import React from 'react';

const TradeBlock = ({ children, title }) => {
  return (
    <div className="trade_block-wrapper d-flex flex-column c">
      <div className="trade_block-title d">
        {title}
      </div>
      <div className="trade_block-content d-flex d">
        {children}
      </div>
    </div>
  );
}

export default TradeBlock;
