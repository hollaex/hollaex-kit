import React from 'react';

export default ({ input, label, className, style, type, meta: {touched, invalid, error } }) => (
	<div className="mt-3">
		<div>{label}</div>
		<div className="mt-1">
			<input
				type="file"
				style={style}
				className={className}
				multiple="false"
				onChange={(ev) => input.onChange(ev.target.files[0])}
			/>
		</div>
		<div style={{color: 'red'}}>
					{ touched ? error : '' }
		</div>
	</div>
);
