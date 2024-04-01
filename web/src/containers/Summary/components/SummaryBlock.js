import React from 'react';
import classnames from 'classnames';
import { EditWrapper } from 'components';

const SummaryBlock = (props) => {
	const {
		stringId,
		title,
		wrapperClassname = '',
		secondaryTitle,
		children,
	} = props;

	return (
		<div className={classnames(wrapperClassname, 'summary-block_wrapper')}>
			<div className="d-flex align-items-center mb-2">
				<EditWrapper
					stringId={stringId}
					renderWrapper={(children) => (
						<div className="summary-block-title">{children}</div>
					)}
				>
					{title}
				</EditWrapper>
				{secondaryTitle && (
					<div className="summary-block-secondaryTitle">: {secondaryTitle}</div>
				)}
			</div>
			{children}
		</div>
	);
};

export default SummaryBlock;
