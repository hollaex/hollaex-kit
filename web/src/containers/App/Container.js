import React, { Component } from 'react';
import { Loader } from '../../components';

class Container extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		if (
			nextProps.appLoaded === this.props.appLoaded &&
			nextProps.isReady === this.props.isReady
		) {
			return false;
		}
		return true;
	}

	render() {
		const { children, appLoaded, isReady } = this.props;
		if (appLoaded && isReady) {
			return <div>{children}</div>;
		}
		return <Loader background={false} />;
	}
}

export default Container;
