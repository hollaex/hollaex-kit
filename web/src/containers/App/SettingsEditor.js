import { Paper } from '@material-ui/core';
import React, { Component, useState, useEffect } from 'react';
import {
	Box,
	Typography,
	Grid,
	Button as MaterialButton,
} from '@material-ui/core';
import { Chip, FormControl, FormLabel, Slider } from '@material-ui/core';
import { FormControlLabel, Switch } from '@material-ui/core';
import { useEditor } from '@craftjs/core';
import ContentEditable from 'react-contenteditable';
import { RadioGroup, Radio } from '@material-ui/core';
import ColorPicker from 'material-ui-color-picker';
import { ReactSVG } from 'react-svg';
import { Spin } from 'antd';

const SettingsEditor = () => {
	const { actions, query, selected } = useEditor((state) => {
		const [currentNodeId] = state.events.selected;
		let selected;

		if (currentNodeId) {
			selected = {
				id: currentNodeId,
				name: state.nodes[currentNodeId].data.name,
				settings:
					state.nodes[currentNodeId].related &&
					state.nodes[currentNodeId].related.settings,
				isDeletable: query.node(currentNodeId).isDeletable(),
			};
		}

		return {
			selected,
		};
	});
	return selected ? (
		<Box bgcolor="rgba(0, 0, 0, 0.06)" mt={2} px={2} py={2}>
			<Grid container direction="column" spacing={0}>
				<Grid item>
					<Box pb={2}>
						<Grid container alignItems="center">
							<Grid item xs>
								<Typography variant="subtitle1" style={{ color: 'white' }}>
									Selected
								</Typography>
							</Grid>
							<Grid item>
								<Chip size="small" color="primary" label={selected.name} />
							</Grid>
						</Grid>
					</Box>
				</Grid>
				{selected.settings && React.createElement(selected.settings)}
				{selected.isDeletable ? (
					<MaterialButton
						variant="contained"
						color="default"
						onClick={() => {
							actions.delete(selected.id);
						}}
					>
						Delete
					</MaterialButton>
				) : null}
			</Grid>
		</Box>
	) : null;
};

export default SettingsEditor;