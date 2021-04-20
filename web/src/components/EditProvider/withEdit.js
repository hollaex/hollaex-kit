import React from 'react';
import { EditContext } from './index';

const withEdit = (Component) => {
	return (props) => (
		<EditContext.Consumer>
			{({ isEditMode, handleEditMode, isInjectMode, handleInjectMode }) => (
				<Component
					{...props}
					isEditMode={isEditMode}
					handleEditMode={handleEditMode}
					isInjectMode={isInjectMode}
					handleInjectMode={handleInjectMode}
				/>
			)}
		</EditContext.Consumer>
	);
};

export default withEdit;
