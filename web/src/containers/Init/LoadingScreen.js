import React from 'react';

const LoadingScreen = () => {
	return (
		<div className="loading_container">
			<div className="loading-content header">
				Loading exchange
				<span className="delayed-show dot-1">.</span>
				<span className="delayed-show dot-2">.</span>
				<span className="delayed-show dot-3">.</span>
			</div>
		</div>
	);
};

export default LoadingScreen;
