import React, { Component, Fragment } from 'react';
import { Loader } from '../../components';

class Container extends Component {
	shouldComponentUpdate(nextProps) {
		if (
			this.props.appLoaded &&
			this.props.isReady &&
			nextProps.appLoaded === this.props.appLoaded &&
			nextProps.isReady === this.props.isReady &&
			nextProps.router.location.pathname ===
				this.props.router.location.pathname &&
			nextProps.children === this.props.children
		) {
			return false;
		}
		return true;
	}

	render() {
		const { children, appLoaded, isReady } = this.props;
		if (appLoaded && isReady) {
			return <Fragment>{children}</Fragment>;
		}
		return <Loader background={false} />;
	}
}

export default Container;
