import React from 'react';
import classnames from 'classnames';
import { Tooltip } from 'antd';
import { FieldContent } from './FieldWrapper';
import { EditWrapper } from 'components';

const SegmentedOptionField = ({
	options = [],
	input,
	label,
	className,
	meta = { active: false, error: '', touched: false, invalid: false },
	...rest
}) => {
	const value = input.value;

	const onSelect = (option) => {
		if (option.disabled) return;
		input.onChange(option.value);
	};

	return (
		<div className={classnames('py-2', className)}>
			<FieldContent
				hideUnderline={true}
				meta={meta}
				valid={!meta.invalid}
				{...rest}
			>
				<div className="d-flex justify-content-between align-items-center segmented-option-field__row">
					<div>
						<EditWrapper>{label}</EditWrapper>
					</div>
					<div
						className="segmented-option-field direction_ltr"
						role="radiogroup"
						aria-label={typeof label === 'string' ? label : undefined}
					>
						{options.map((option) => {
							const isActive = option.value === value;
							const isDisabled = !!option.disabled;
							const showDisabledTooltip = isDisabled && option.hint;

							const segmentBtn = (
								<button
									type="button"
									role="radio"
									aria-checked={isActive}
									disabled={isDisabled}
									aria-label={
										showDisabledTooltip && typeof option.hint === 'string'
											? option.hint
											: undefined
									}
									className={classnames('segmented-option-field__segment', {
										'segmented-option-field__segment--active': isActive,
									})}
									onClick={() => onSelect(option)}
								>
									{option.shortLabel != null ? option.shortLabel : option.label}
								</button>
							);

							if (showDisabledTooltip) {
								return (
									<Tooltip
										key={String(option.value)}
										title={option.hint}
										placement="top"
										mouseEnterDelay={0.1}
									>
										<span className="segmented-option-field__tooltip-anchor">
											{segmentBtn}
										</span>
									</Tooltip>
								);
							}

							return React.cloneElement(segmentBtn, {
								key: String(option.value),
							});
						})}
					</div>
				</div>
			</FieldContent>
		</div>
	);
};

export default SegmentedOptionField;
