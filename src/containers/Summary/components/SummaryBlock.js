import React from 'react';

const SummaryBlock = (props) => {
    const { title, supportTitle, children } = props;
    return (
        <div className="summary-block_wrapper">
            <div className="summary-block-title">{title}</div>
            {children}
        </div>
    );
};

export default SummaryBlock;