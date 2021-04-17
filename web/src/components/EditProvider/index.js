import React, { Component } from 'react';

export const EditContext = React.createContext();

class EditProvider extends Component {
	state = {
		isEditMode: false,
		isInjectMode: false,
	};

	handleEditMode = () => {
		this.setState((prevState) => ({
			...prevState,
			isEditMode: !prevState.isEditMode,
		}));
	};

	handleInjectMode = () => {
		this.setState((prevState) => ({
			...prevState,
			isInjectMode: !prevState.isInjectMode,
		}));
	};

	render() {
		const { isEditMode, isInjectMode } = this.state;
		const { children } = this.props;
		const { handleEditMode, handleInjectMode } = this;

		return (
			<EditContext.Provider
				value={{
					isEditMode,
					isInjectMode,
					handleEditMode,
					handleInjectMode,
				}}
			>
				{children}
			</EditContext.Provider>
		);
	}
}

export default EditProvider;
