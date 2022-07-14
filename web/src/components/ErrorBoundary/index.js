import React, { Component } from 'react';
import classnames from 'classnames';

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		console.error(error, errorInfo);
	}

	render() {
		const { hasError } = this.state;
		const { children } = this.props;

		if (hasError) {
			return (
				<div
					style={{
						height: '28rem',
					}}
					className={classnames(
						'important-text',
						'd-flex ',
						'justify-content-between',
						'align-center',
						'flex-direction-column',
						'py-5',
						'font-title'
					)}
				>
					<div>Something went wrong!</div>
				</div>
			);
		}

		return children;
	}
}

export default ErrorBoundary;
