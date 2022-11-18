import React from 'react';
import classnames from 'classnames';
import { ActionNotification } from '../';
import { EditWrapper } from 'components';
import Image from 'components/Image';

const BasicIconTitle = ({
	text,
	stringId,
	iconPath,
	iconId,
	textType,
	underline,
	className,
	imageWrapperClassName = '',
}) => {
	return (
		<div className={classnames('icon_title-wrapper', { underline }, className)}>
			{iconPath && (
				<Image
					iconId={iconId}
					icon={iconPath}
					alt={text}
					wrapperClassName={imageWrapperClassName}
					imageWrapperClassName="icon_title-image"
					svgWrapperClassName="icon_title-svg"
					showUpload={false}
				/>
			)}
			<EditWrapper
				stringId={stringId}
				iconId={iconId}
				render={(string) => (
					<div
						className={classnames(
							'icon_title-text pt-2',
							'text-center',
							textType
						)}
					>
						{string}
					</div>
				)}
			>
				{text}
			</EditWrapper>
		</div>
	);
};

const EnhancedIconTitle = ({
	subtitle,
	subtitleClass = 'font-weight-bold subtitleClass',
	actionProps,
	...rest
}) => (
	<div className={classnames('w-100')}>
		<BasicIconTitle {...rest} />
		<div
			className={classnames('d-flex', 'justify-content-between', 'p-relative')}
		>
			<EditWrapper
				renderWrapper={(children) => (
					<div className={subtitleClass}>{children}</div>
				)}
			>
				{subtitle}
			</EditWrapper>
			<div>{actionProps && <ActionNotification {...actionProps} />}</div>
		</div>
	</div>
);

const IconTitle = (props) => {
	if (props.subtitle || props.actionProps) {
		return <EnhancedIconTitle {...props} />;
	}
	return <BasicIconTitle {...props} />;
};

IconTitle.defaultProps = {
	iconPath: '',
	textType: '',
	underline: false,
};

export default IconTitle;
