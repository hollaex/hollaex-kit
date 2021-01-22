import React, { useState, useEffect } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const TextEditor = ({
	input,
	label,
	placeholder,
	meta: { touched, error, warning },
	disabled = false,
}) => {
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	useEffect(() => {
		setEditorState(EditorState.createEmpty());
	}, []);
	const onEditorStateChange = (edState) => {
		const currentState = convertToRaw(edState.getCurrentContent());
		input.onChange(draftToHtml(currentState));
		setEditorState(edState);
	};
	return (
		<div className="input_field">
			{label && <label>{label}</label>}
			<div>
				<Editor
					wrapperClassName="text-editor-wrapper"
					editorClassName="text-editor"
					editorState={editorState}
					onEditorStateChange={onEditorStateChange}
				/>
				{touched &&
					((error && <span className="red-text">{error}</span>) ||
						(warning && <span className="red-text">{warning}</span>))}
			</div>
		</div>
	);
};

export default TextEditor;
