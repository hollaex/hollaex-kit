import React from 'react';
import classnames from 'classnames';

const SummaryBlock = (props) => {
    const { title, wrapperClassname="", secondaryTitle, children } = props;
    return (
        <div className={classnames(wrapperClassname, "summary-block_wrapper")}>
            <div className="d-flex">
                <div className="summary-block-title">{title}</div>
                {secondaryTitle && <div>: {secondaryTitle}</div>}
            </div>
            {children}
        </div>
    );
};

export default SummaryBlock;