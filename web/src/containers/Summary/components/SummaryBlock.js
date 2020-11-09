import React from 'react';
import classnames from 'classnames';
import Image from 'components/Image';
import { EditWrapper } from 'components';

const SummaryBlock = (props) => {
	const {
		icon = '',
		iconId,
		stringId,
		title,
		wrapperClassname = '',
		secondaryTitle,
		children,
	} = props;

	return (
		<div className={classnames(wrapperClassname, 'summary-block_wrapper')}>
			<div className="d-flex align-items-center mb-2">
				<Image
					iconId={iconId}
					icon={icon}
					alt={title}
					wrapperClassName="summary-title-icon"
				/>
				<EditWrapper stringId={stringId}>
					<div className="summary-block-title">{title}</div>
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
