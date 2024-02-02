import React from 'react';
import classnames from 'classnames';
import Image from 'components/Image';
import { EditWrapper, Connector } from 'components';
import { Element } from 'craftjs';
import { uniqueId } from 'lodash';

const SummaryBlock = (props) => {
	const {
		icon = '',
		iconId,
		stringId,
		title,
		wrapperClassname = '',
		secondaryTitle,
		children,
		background,
		padding,
		width,
		height,
		display,
		flexDirection,
		gap,
	} = props;

	return (
		<div
			className={classnames(wrapperClassname, 'summary-block_wrapper')}
			style={{
				background,
				padding: `${padding}px`,
				width,
				height,
				display,
				flexDirection,
				gap,
			}}
		>
			<Element id={uniqueId()} is={Connector} canvas>
				<div className="d-flex align-items-center mb-2">
					<Image
						iconId={iconId}
						icon={icon}
						alt={title}
						wrapperClassName="summary-title-icon"
					/>
					<EditWrapper
						stringId={stringId}
						renderWrapper={(children) => (
							<div className="summary-block-title">{children}</div>
						)}
					>
						{title}
					</EditWrapper>
					{secondaryTitle && (
						<div className="summary-block-secondaryTitle">
							: {secondaryTitle}
						</div>
					)}
				</div>
			</Element>

			{children}
		</div>
	);
};

export default SummaryBlock;
