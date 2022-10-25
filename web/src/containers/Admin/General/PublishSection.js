import React from 'react';
import { Collapse } from 'antd';

import FormButton from 'components/FormButton/Button';

const PublishSection = ({
	title = '',
	description = '',
	themeOptions = [],
	loadingButton,
	currentPublishType = '',
	renderImageUpload = () => {},
	handlePublish = () => {},
	currentkey = '',
	themeKey = '',
	indexKey = '',
	isPublishDisable = false,
	updatedKey = '',
}) => {
	return (
		<div>
			<div className="sub-title">{title}</div>
			<div className="description">{description}</div>
			<div className="file-wrapper">
				<Collapse defaultActiveKey={['1']} bordered={false} ghost>
					<Collapse.Panel showArrow={false} key="1" disabled={true}>
						<div className="file-wrapper">
							{themeOptions
								.filter(({ value: theme }) => theme === 'dark')
								.map(({ value: theme }, index) =>
									renderImageUpload(
										currentkey,
										themeKey ? themeKey : theme,
										indexKey ? indexKey : index,
										false
									)
								)}
						</div>
					</Collapse.Panel>
					{!themeKey ? (
						<Collapse.Panel
							showArrow={false}
							header={
								<span className="underline-text">Theme Specific Graphics</span>
							}
							key="2"
						>
							<div className="file-wrapper">
								{themeOptions
									.filter(({ value: theme }) => theme !== 'dark')
									.map(({ value: theme }, index) =>
										renderImageUpload(currentkey, theme, index, false)
									)}
							</div>
						</Collapse.Panel>
					) : null}
				</Collapse>
			</div>
			<FormButton
				type="primary"
				handleSubmit={() => handlePublish(currentkey)}
				disabled={
					!isPublishDisable || (isPublishDisable && updatedKey !== currentkey)
				}
				className="green-btn minimal-btn"
				buttonText="Publish"
			/>
		</div>
	);
};

export default PublishSection;
