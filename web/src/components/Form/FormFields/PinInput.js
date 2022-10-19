import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';

const PinInput = ({
	input: { value = '', onChange },
	callback: { handleSubmit, error, isSubmitting },
}) => {
	const [isFocused, setIsFocused] = useState(true);
	const [isError, setIsError] = useState(undefined);
	const masterRef = useRef();

	useEffect(() => {
		if (value.length === 6) {
			handleSubmit();
		}
	}, [value, handleSubmit]);

	useEffect(() => {
		if (error && masterRef?.current) {
			const inputEvent = new Event('input', { bubbles: true });
			const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
				window.HTMLInputElement.prototype,
				'value'
			).set;
			nativeInputValueSetter.call(masterRef.current, '');
			masterRef.current.dispatchEvent(inputEvent);
			setIsError(error);
		}
	}, [error, onChange, masterRef]);

	const handleOnMasterFocus = (e) => {
		var temp_value = e.target.value;
		e.target.value = '';
		e.target.value = temp_value;
		setIsError(false);
		setIsFocused(true);
	};

	const handleOnMasterBlur = () => {
		setIsFocused(false);
	};

	const handleMasterValueChange = (e) => {
		if (e.target.value.length > 0) {
			setIsError(undefined);
		}
		if (e.target.value.length <= 6 && onChange && !isSubmitting) {
			onChange(e);
		}
	};

	const getClassname = (index) => {
		if (isError) return classnames('error');
		if (isFocused && index === value.length) return classnames('active');
		return '';
	};

	return (
		<React.Fragment>
			<div className={classnames('mainContainer')}>
				<input
					autoFocus
					inputMode={'numeric'}
					ref={masterRef}
					className={classnames('masterInput')}
					disabled={isSubmitting}
					type="text"
					value={value}
					onClick={handleOnMasterFocus}
					onChange={handleMasterValueChange}
					onBlur={handleOnMasterBlur}
				/>
				<div className="group">
					<input value={value[0] || ''} className={getClassname(0)} />
					<input value={value[1] || ''} className={getClassname(1)} />
					<input value={value[2] || ''} className={getClassname(2)} />
				</div>
				<div className="seperator"></div>
				<div className="group">
					<input value={value[3] || ''} className={getClassname(3)} />
					<input value={value[4] || ''} className={getClassname(4)} />
					<input value={value[5] || ''} className={getClassname(5)} />
				</div>
			</div>
			{isError && <div className="warning_text">{isError}</div>}
		</React.Fragment>
	);
};

export default PinInput;
