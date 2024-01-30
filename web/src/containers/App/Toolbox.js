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
import { Button, Text, Container } from 'containers/Summary';

import { Editor, Frame, Element } from '@craftjs/core';

const Toolbox = () => {
	const { connectors, query } = useEditor();
	return (
		<Box px={2} py={2}>
			<Grid
				container
				direction="column"
				alignItems="center"
				justify="center"
				spacing={1}
			>
				<Box pb={2}>
					<Typography>Drag to add</Typography>
				</Box>
				<Grid container direction="column" item>
					<MaterialButton
						ref={(ref) =>
							connectors.create(ref, <Button text="Test" size="small" />)
						}
						variant="contained"
					>
						Button
					</MaterialButton>
				</Grid>
				<Grid container direction="column" item>
					<MaterialButton
						ref={(ref) => connectors.create(ref, <Text text="Text" />)}
						variant="contained"
					>
						Text
					</MaterialButton>
				</Grid>
				<Grid container direction="column" item>
					<MaterialButton
						ref={(ref) =>
							connectors.create(
								ref,
								<Element is={Container} padding={20} canvas />
							)
						}
						variant="contained"
					>
						Container
					</MaterialButton>
				</Grid>
				{/* <Grid container direction="column" item>
          <MaterialButton ref={ref=> connectors.create(ref, <Card />)} variant="contained">Card</MaterialButton>
        </Grid> */}
			</Grid>
		</Box>
	);
};

export default Toolbox