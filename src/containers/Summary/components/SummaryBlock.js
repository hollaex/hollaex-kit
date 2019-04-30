import React from 'react';
import classnames from 'classnames';
import ReactSVG from 'react-svg';

const SummaryBlock = (props) => {
    const { icon='', useSvg=false, title, wrapperClassname="", secondaryTitle, children } = props;
    return (
        <div className={classnames(wrapperClassname, "summary-block_wrapper")}>
            <div className="d-flex align-items-center mb-3">
                {icon && <div>
                    {useSvg
                        ? <ReactSVG path={icon} wrapperClassname="summary-title-icon" />
                        : <img src={icon} alt={title} className="summary-title-icon" />
                    }
                </div>}
                <div className="summary-block-title">{title}</div>
                {secondaryTitle && <div className="summary-block-secondaryTitle">: {secondaryTitle}</div>}
            </div>
            {children}
        </div>
    );
};

export default SummaryBlock;