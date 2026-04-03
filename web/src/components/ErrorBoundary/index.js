import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import strings from 'config/localizedStrings';
import {
	DefaultError,
	NetworkError,
	ServerError,
	ServerMaintenanceError,
	TooManyRequestError,
} from 'utils/utils';
import './_ErrorBoundary.scss';

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		console.error(error, errorInfo);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.errorMessage !== this.props.errorMessage) {
			this.setState({ hasError: true, error: this.props.errorMessage });
		}
	}

	setIsError = () => {
		this.setState({ hasError: false, error: null });
	};

	render() {
		const { hasError, error, errorCount } = this.state;
		const { children } = this.props;

		if (hasError) {
			const errorMessage = error?.message || error;

			const errorComponents = {
				[strings['ERROR_TAB.NETWORK_ERROR_MESSAGE']]: <NetworkError />,
				[strings['ERROR_TAB.TOO_MANY_REQUEST_ERROR']]: <TooManyRequestError />,
				[strings['ERROR_TAB.SERVER_ERROR']]: <ServerError />,
				[strings['ERROR_TAB.SERVER_MAINTENANCE_ERROR']]: errorCount >= 3 && (
					<ServerMaintenanceError />
				),
			};

			const ErrorComponent = errorComponents[errorMessage] || (
				<DefaultError error={error} setIsError={this.setIsError} />
			);

			return (
				<div
					className={classnames(
						'important-text',
						'd-flex',
						'justify-content-between',
						'align-center',
						'flex-direction-column',
						'font-title',
						'h-100',
						'error-boundary-wrapper'
					)}
				>
					{ErrorComponent}
				</div>
			);
		}

		return children;
	}
}

const mapStateToProps = (state) => ({
	errorMessage: state.app.errorMessage,
	errorCount: state.app.errorCount,
});

export default connect(mapStateToProps)(ErrorBoundary);
