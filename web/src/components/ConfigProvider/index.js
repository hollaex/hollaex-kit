import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getIconByKey } from 'utils/icon';
import { calculateThemes } from 'utils/color';

export const ProjectConfig = React.createContext('appConfig');

class ConfigProvider extends Component {
	constructor(props) {
		super(props);
		const { initialConfig } = this.props;
		const { icons = {}, color = {}, defaults = {} } = { ...initialConfig };

		const themeOptions = Object.keys(color).map((value) => ({ value }));
		const calculatedThemes = calculateThemes(color);

		this.state = {
			icons,
			color: calculatedThemes,
			themeOptions,
			defaults,
		};
	}

	UNSAFE_componentWillUpdate(_, nextState) {
		const { color } = this.state;
		if (JSON.stringify(color) !== JSON.stringify(nextState.color)) {
			const themeOptions = Object.keys(nextState.color).map((value) => ({
				value,
			}));
			const calculatedThemes = calculateThemes(nextState.color);
			this.setState({
				themeOptions,
				color: calculatedThemes,
			});
		}
	}

	updateIcons = (icons = {}) => {
		this.setState((prevState) => ({
			...prevState,
			icons: {
				...prevState.icons,
				...icons,
			},
		}));
	};

	removeIcon = (key) => {
		const iconObject = { [key]: getIconByKey(key) };
		this.updateIcons(iconObject);
	};

	updateColor = (color = {}) => {
		this.setState((prevState) => ({
			...prevState,
			color: {
				...prevState.color,
				...color,
			},
		}));
	};

	removeTheme = (keys = []) => {
		const { color: prevColor } = this.state;
		const color = {};

		Object.entries(prevColor).forEach(([themeKey, theme]) => {
			if (!keys.includes(themeKey)) {
				color[themeKey] = theme;
			}
		});

		this.setState({
			color,
		});
	};

	updateDefaults = (defaultOverwriteObject = {}) => {
		this.setState((prevState) => ({
			...prevState,
			defaults: {
				...prevState.defaults,
				...defaultOverwriteObject,
			},
		}));
	};

	render() {
		const { children, activeTheme } = this.props;
		const { icons, color, themeOptions, defaults } = this.state;
		const {
			updateIcons,
			removeIcon,
			updateColor,
			updateDefaults,
			removeTheme,
		} = this;

		return (
			<ProjectConfig.Provider
				value={{
					defaults,
					icons: icons[activeTheme],
					allIcons: icons,
					color,
					themeOptions,
					updateIcons,
					updateColor,
					updateDefaults,
					removeTheme,
					removeIcon,
				}}
			>
				{children}
			</ProjectConfig.Provider>
		);
	}
}

const mapStateToProps = ({ app: { theme: activeTheme } }) => ({
	activeTheme,
});

export default connect(mapStateToProps)(ConfigProvider);
