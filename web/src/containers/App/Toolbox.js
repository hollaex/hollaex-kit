import React, { useState } from 'react';
import {
	Box,
	Typography,
	Grid,
	Button as MaterialButton,
} from '@material-ui/core';
import { useEditor } from 'craftjs';
import { Button, Text, Container, ContainerImage } from 'containers/Summary';
import { uniqueId } from 'lodash';
import { Element } from 'craftjs';

const UploadAndDisplayImage = () => {
	const { connectors } = useEditor();

	const [selectedImage, setSelectedImage] = useState(null);

	const [id] = useState(uniqueId());
	return (
		<div style={{ width: '100%' }}>
			{selectedImage && (
				<div>
					<img
						ref={(ref) => {
							if (selectedImage)
								return connectors.create(
									ref,
									// <Element is={ContainerImage} padding={20} selectedImage={selectedImage} canvas />
									<ContainerImage padding={20} selectedImage={selectedImage} />
								);
						}}
						alt="not found"
						width={'250px'}
						src={URL.createObjectURL(selectedImage)}
					/>
					<br />
					<MaterialButton
						variant="contained"
						color="primary"
						style={{ marginTop: 15, marginBottom: 5 }}
						onClick={() => setSelectedImage(null)}
					>
						Remove
					</MaterialButton>
				</div>
			)}

			<div>
				<label
					for={id}
					style={{
						color: 'black',
						cursor: 'pointer',
						backgroundColor: '#D5D5D5',
						width: '100%',
						textAlign: 'center',
						padding: 5,
						borderRadius: 5,
					}}
				>
					Image
				</label>
				<input
					style={{ opacity: 0 }}
					id={id}
					type="file"
					onChange={(event) => {
						console.log(event.target.files[0]);
						setSelectedImage(event.target.files[0]);
					}}
				/>
			</div>
		</div>
	);
};

const Toolbox = () => {
	const { connectors } = useEditor();
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
				<Grid container direction="column" item>
					<UploadAndDisplayImage />
				</Grid>
				{/* <Grid container direction="column" item>
          <MaterialButton ref={ref=> connectors.create(ref, <Card />)} variant="contained">Card</MaterialButton>
        </Grid> */}
			</Grid>
		</Box>
	);
};

export default Toolbox;
