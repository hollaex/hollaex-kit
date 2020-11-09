import React from 'react';
import classnames from 'classnames';

const Loader = ({ relative, className, background }) => (
	<div
		className={classnames(
			'd-flex',
			'justify-content-center',
			'align-items-center',
			{
				loader_wrapper: !relative,
				loader_wrapper_relative: relative,
			},
			className
		)}
	>
		<div className={classnames({ loader_background: background })} />
		<div className="loader" />
	</div>
);

Loader.defaultProps = {
	relative: false,
	background: true,
	className: '',
};

export default Loader;
