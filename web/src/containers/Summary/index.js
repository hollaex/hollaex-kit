import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import classnames from 'classnames';

import SummaryBlock from './components/SummaryBlock';
import TraderAccounts from './components/TraderAccounts';
// import SummaryRequirements from './components/SummaryRequirements';
import AccountAssets from './components/AccountAssets';
import AccountDetails from './components/AccountDetails';
import Markets from './components/Markets';
import MobileSummary from './MobileSummary';

import { IconTitle } from 'components';
// import { logout } from '../../actions/authAction';
import {
	// openContactForm,
	logoutconfirm,
	setNotification,
	NOTIFICATIONS,
} from 'actions/appActions';
import {
	BASE_CURRENCY,
	DEFAULT_COIN_DATA,
	// SHOW_SUMMARY_ACCOUNT_DETAILS,
	SHOW_TOTAL_ASSETS,
} from 'config/constants';
import STRINGS from 'config/localizedStrings';
import { formatAverage, formatBaseAmount } from 'utils/currency';
import { getLastMonthVolume } from './components/utils';
import { getUserReferrals } from 'actions/userAction';
import withConfig from 'components/ConfigProvider/withConfig';
import { openContactForm } from 'actions/appActions';
import { isLoggedIn } from 'utils/token';

import { Connector, EditWrapper } from 'components';
import Image from 'components/Image';
import { uniqueId } from 'lodash';
import TraderSideInfo from './components/TraderSideInfo';
import AccountTypesList from './components/AccountTypesList';
import { Paper } from '@material-ui/core';
import {
	Box,
	Typography,
	Grid,
	Button as MaterialButton,
} from '@material-ui/core';
import { Chip, FormControl, FormLabel, Slider } from '@material-ui/core';
import { FormControlLabel, Switch } from '@material-ui/core';
import ContentEditable from 'react-contenteditable';
import { RadioGroup, Radio } from '@material-ui/core';
import ColorPicker from 'material-ui-color-picker';
import { ReactSVG } from 'react-svg';
import { Spin } from 'antd';
// import { useEditor } from '@craftjs/core';
// import { Editor, Frame, Element } from '@craftjs/core';
// import { useNode } from '@craftjs/core';

import { Editor, Frame, Element, useEditor, useNode } from '../../craftjs';

export const CraftContainer = ({ children }) => {
	const {
		connectors: { connect, drag },
	} = useNode();
	return (
		<div
			ref={(ref) => connect(drag(ref))}
			style={{ display: 'flex', flexDirection: 'row' }}
		>
			{children}
		</div>
	);
};

export const ContainerFlex = ({ children }) => {
	const {
		connectors: { connect, drag },
	} = useNode();
	return (
		<div
			ref={(ref) => connect(drag(ref))}
			className="d-flex"
			style={{ gap: 10 }}
		>
			{children}
		</div>
	);
};

export const ProfileSummary = ({
	user,
	pairs,
	coins,
	verification_level,
	config_level,
	userAccountTitle,
	onUpgradeAccount,
	onInviteFriends,
	background,
	padding = 0,
	width,
	height,
	display = 'flex',
	flexDirection = 'column',
	gap = 10,
}) => {
	const {
		connectors: { connect, drag },
	} = useNode();

	return (
		<div
			ref={(ref) => connect(drag(ref))}
			className="summary-section_1 trader-account-wrapper d-flex"
			style={{ minWidth: width, height, display, gap }}
		>
			<SummaryBlock
				title={userAccountTitle}
				wrapperClassname="w-100"
				background={background}
				padding={padding}
				width={width}
				height={height}
				display={display}
				flexDirection={flexDirection}
				gap={gap}
			>
				<TraderAccounts
					user={user}
					pairs={pairs}
					coins={coins}
					config={config_level}
					onUpgradeAccount={onUpgradeAccount}
					onInviteFriends={onInviteFriends}
					verification_level={verification_level}
				/>
			</SummaryBlock>
		</div>
	);
};

export const MyAssets = ({
	user,
	balance,
	coins,
	chartData,
	totalAssets,
	fullname,
}) => {
	const {
		connectors: { connect, drag },
	} = useNode();

	return (
		<div
			ref={(ref) => connect(drag(ref))}
			className="summary-section_1 requirement-wrapper d-flex"
		>
			<SummaryBlock
				stringId="SUMMARY.ACCOUNT_ASSETS"
				title={STRINGS['SUMMARY.ACCOUNT_ASSETS']}
				secondaryTitle={
					SHOW_TOTAL_ASSETS && BASE_CURRENCY ? (
						<span>
							<span className="title-font">{totalAssets}</span>
							{` ${fullname}`}
						</span>
					) : null
				}
				wrapperClassname={classnames('assets-wrapper', 'w-100')}
			>
				<AccountAssets
					user={user}
					chartData={chartData}
					totalAssets={totalAssets}
					balance={balance}
					coins={coins}
				/>
			</SummaryBlock>
			{/* </div> */}
		</div>
	);
};

export const CraftMarkets = ({ user, pairs, coins, router }) => {
	const {
		connectors: { connect, drag },
	} = useNode();
	return (
		<div ref={(ref) => connect(drag(ref))}>
			<SummaryBlock
				stringId="SUMMARY.MARKETS"
				title={STRINGS['SUMMARY.MARKETS']}
			>
				<Markets
					user={user}
					coins={coins}
					pairs={pairs}
					router={router}
					showContent={true}
				/>
			</SummaryBlock>
		</div>
	);
};

export const CraftAccountDetails = ({
	user,
	pairs,
	coins,
	config_level,
	currentTradingAccount,
	selectedAccount,
	lastMonthVolume,
	onAccountTypeChange,
	onUpgradeAccount,
}) => {
	const {
		connectors: { connect, drag },
	} = useNode();
	return (
		<div ref={(ref) => connect(drag(ref))}>
			<SummaryBlock
				stringId="SUMMARY.ACCOUNT_DETAILS"
				title={STRINGS['SUMMARY.ACCOUNT_DETAILS']}
				secondaryTitle={currentTradingAccount.name}
			>
				<AccountDetails
					user={user}
					coins={coins}
					pairs={pairs}
					config={config_level}
					currentTradingAccount={currentTradingAccount.symbol}
					selectedAccount={selectedAccount}
					lastMonthVolume={lastMonthVolume}
					onAccountTypeChange={onAccountTypeChange}
					onUpgradeAccount={onUpgradeAccount}
				/>
			</SummaryBlock>
		</div>
	);
};

export const Text = ({ text, fontSize, textAlign, color }) => {
	const {
		connectors: { connect, drag },
		hasSelectedNode,
		hasDraggedNode,
		isActive,
		actions: { setProp },
	} = useNode((state) => ({
		hasSelectedNode: state.events.selected.size > 0,
		hasDraggedNode: state.events.dragged.size > 0,
		isActive: state.events.selected,
	}));

	const [editable, setEditable] = useState(false);

	useEffect(() => {
		!hasSelectedNode && setEditable(false);
	}, [hasSelectedNode]);

	return (
		<div ref={(ref) => connect(drag(ref))} onClick={(e) => setEditable(true)}>
			<ContentEditable
				disabled={!editable}
				html={text}
				onChange={(e) =>
					setProp(
						(props) =>
							(props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, ''))
					)
				}
				tagName="p"
				style={{
					fontSize: `${fontSize}px`,
					textAlign,
					padding: 1,
					margin: 5,
					color,
				}}
			/>
			{/* {
        hasSelectedNode && (
          <FormControl className="text-additional-settings" size="small">
            <FormLabel component="legend">Font size</FormLabel>
            <Slider
              defaultValue={fontSize}
              step={1}
              min={7}
              max={50}
              valueLabelDisplay="auto"
              onChange={(_, value) => {
                setProp(props => props.fontSize = value);
              }}
            />
          </FormControl>
        )
      } */}
		</div>
	);
};

export const TextSettings = () => {
	const {
		actions: { setProp },
		fontSize,
		color,
	} = useNode((node) => ({
		fontSize: node.data.props.fontSize,
		color: node.data.props.color,
	}));

	return (
		<>
			<FormControl size="small" component="fieldset">
				<FormLabel component="legend" style={{ color: 'white' }}>
					Font size
				</FormLabel>
				<Slider
					value={fontSize || 7}
					step={7}
					min={1}
					max={50}
					onChange={(_, value) => {
						setProp((props) => (props.fontSize = value));
					}}
				/>
			</FormControl>

			<FormControl fullWidth={true} margin="normal" component="fieldset">
				<FormLabel component="legend" style={{ color: 'white' }}>
					Color
				</FormLabel>
				<ColorPicker
					defaultValue={color}
					onChange={(color) => {
						if (color) setProp((props) => (props.color = color));
					}}
				/>
			</FormControl>
		</>
	);
};

Text.craft = {
	props: {
		text: 'Hi',
		fontSize: 15,
		color: 'white',
	},
	related: {
		settings: TextSettings,
	},
};

export const Button = ({ size, variant, text, color, children }) => {
	const {
		connectors: { connect, drag },
	} = useNode();
	return (
		<MaterialButton
			ref={(ref) => connect(drag(ref))}
			size={size}
			variant={variant}
			color={color}
		>
			{text}
			{children}
		</MaterialButton>
	);
};

export const ButtonSettings = () => {
	const {
		actions: { setProp },
		props,
	} = useNode((node) => ({
		props: node.data.props,
	}));

	return (
		<div>
			<FormControl size="small" component="fieldset">
				<FormLabel component="legend" style={{ color: 'white' }}>
					Size
				</FormLabel>
				<RadioGroup
					defaultValue={props.size}
					onChange={(e) => setProp((props) => (props.size = e.target.value))}
				>
					<FormControlLabel
						label="Small"
						value="small"
						control={<Radio size="small" color="primary" />}
					/>
					<FormControlLabel
						label="Medium"
						value="medium"
						control={<Radio size="small" color="primary" />}
					/>
					<FormControlLabel
						label="Large"
						value="large"
						control={<Radio size="small" color="primary" />}
					/>
				</RadioGroup>
			</FormControl>
			<FormControl component="fieldset">
				<FormLabel component="legend" style={{ color: 'white' }}>
					Variant
				</FormLabel>
				<RadioGroup
					defaultValue={props.variant}
					onChange={(e) => setProp((props) => (props.variant = e.target.value))}
				>
					<FormControlLabel
						label="Text"
						value="text"
						control={<Radio size="small" color="primary" />}
					/>
					<FormControlLabel
						label="Outlined"
						value="outlined"
						control={<Radio size="small" color="primary" />}
					/>
					<FormControlLabel
						label="Contained"
						value="contained"
						control={<Radio size="small" color="primary" />}
					/>
				</RadioGroup>
			</FormControl>
			<FormControl component="fieldset">
				<FormLabel component="legend" style={{ color: 'white' }}>
					Color
				</FormLabel>
				<RadioGroup
					defaultValue={props.color}
					onChange={(e) => setProp((props) => (props.color = e.target.value))}
				>
					<FormControlLabel
						label="Default"
						value="default"
						control={<Radio size="small" color="default" />}
					/>
					<FormControlLabel
						label="Primary"
						value="primary"
						control={<Radio size="small" color="primary" />}
					/>
					<FormControlLabel
						label="Seconday"
						value="secondary"
						control={<Radio size="small" color="primary" />}
					/>
				</RadioGroup>
			</FormControl>
		</div>
	);
};

Button.craft = {
	props: {
		size: 'small',
		variant: 'contained',
		color: 'primary',
		text: 'Test',
	},
	related: {
		settings: ButtonSettings,
	},
};

export const Container = ({
	background,
	padding = 0,
	width,
	height,
	display = 'flex',
	flexDirection = 'column',
	flexValue = 1,
	gap = 10,
	border = true,
	children,
}) => {
	const {
		connectors: { connect, drag },
	} = useNode();
	return (
		<div
			ref={(ref) => connect(drag(ref))}
			style={{
				margin: '5px 0',
				background,
				padding: `${padding}px`,
				width,
				height,
				display,
				flexDirection,
				flex: flexValue,
				gap,
				color: 'white',
				border: `${border ? '1px' : '0px'} solid #ccc`,
			}}
		>
			{children}
		</div>
	);
};

export const ContainerImage = ({
	selectedImage,
	background,
	padding = 0,
	width,
	height,
	display = 'flex',
	flexDirection = 'column',
	flexValue = 1,
	gap = 10,
	border = true,
	children,
}) => {
	const {
		connectors: { connect, drag },
	} = useNode();
	return (
		<span
			ref={(ref) => connect(drag(ref))}
			style={{
				// margin: '5px 0',
				// background,
				padding: `${padding}px`,
			}}
		>
			{selectedImage && (
				<span>
					<img
						style={{
							width,
							height,
						}}
						alt="not found"
						width={'250px'}
						src={URL.createObjectURL(selectedImage)}
					/>
				</span>
			)}

			{children}
		</span>
	);
};

export const ContainerSettings = () => {
	const {
		background,
		padding,
		width,
		height,
		gap,
		actions: { setProp },
	} = useNode((node) => ({
		background: node.data.props.background,
		padding: node.data.props.padding,
		width: node.data.props.width,
		height: node.data.props.height,
		gap: node.data.props.gap,
		flexDirection: node.data.props.flexDirection,
		flexValue: node.data.props.flexValue,
		border: node.data.props.border,
	}));
	return (
		<div>
			<FormControl fullWidth={true} margin="normal" component="fieldset">
				<FormLabel component="legend" style={{ color: 'white' }}>
					Background
				</FormLabel>
				<ColorPicker
					defaultValue={background || '#000'}
					onChange={(color) => {
						if (color) setProp((props) => (props.background = color));
					}}
				/>
			</FormControl>
			<FormControl fullWidth={true} margin="normal" component="fieldset">
				<FormLabel component="legend" style={{ color: 'white' }}>
					Padding
				</FormLabel>
				<Slider
					defaultValue={padding}
					onChange={(_, value) => setProp((props) => (props.padding = value))}
				/>
			</FormControl>

			<FormControl fullWidth={true} margin="normal" component="fieldset">
				<FormLabel component="legend" style={{ color: 'white' }}>
					Witdh
				</FormLabel>
				<Slider
					defaultValue={width}
					max={800}
					onChange={(_, value) => setProp((props) => (props.width = value))}
				/>
			</FormControl>

			<FormControl fullWidth={true} margin="normal" component="fieldset">
				<FormLabel component="legend" style={{ color: 'white' }}>
					Height
				</FormLabel>
				<Slider
					defaultValue={height}
					max={800}
					onChange={(_, value) => setProp((props) => (props.height = value))}
				/>
			</FormControl>

			<FormControl fullWidth={true} margin="normal" component="fieldset">
				<FormLabel component="legend" style={{ color: 'white' }}>
					Flex Direction
				</FormLabel>

				<MaterialButton
					style={{ color: 'white' }}
					variant="outlined"
					color="primary"
					onClick={() => {
						setProp((props) => (props.flexDirection = 'column'));
					}}
				>
					Column
				</MaterialButton>

				<MaterialButton
					style={{ color: 'white' }}
					variant="outlined"
					color="primary"
					onClick={() => {
						setProp((props) => (props.flexDirection = 'row'));
					}}
				>
					Row
				</MaterialButton>
			</FormControl>

			<FormControl fullWidth={true} margin="normal" component="fieldset">
				<FormLabel component="legend" style={{ color: 'white' }}>
					Flex Value
				</FormLabel>

				<MaterialButton
					style={{ color: 'white' }}
					size="small"
					variant="outlined"
					color="primary"
					onClick={() => {
						setProp((props) => (props.flexValue = 1));
					}}
				>
					1
				</MaterialButton>

				<MaterialButton
					style={{ color: 'white' }}
					size="small"
					variant="outlined"
					color="primary"
					onClick={() => {
						setProp((props) => (props.flexValue = 2));
					}}
				>
					2
				</MaterialButton>
				<MaterialButton
					style={{ color: 'white' }}
					size="small"
					variant="outlined"
					color="primary"
					onClick={() => {
						setProp((props) => (props.flexValue = 3));
					}}
				>
					3
				</MaterialButton>
				<MaterialButton
					style={{ color: 'white' }}
					size="small"
					variant="outlined"
					color="primary"
					onClick={() => {
						setProp((props) => (props.flexValue = 4));
					}}
				>
					4
				</MaterialButton>
			</FormControl>

			<FormControl fullWidth={true} margin="normal" component="fieldset">
				<FormLabel component="legend" style={{ color: 'white' }}>
					Border
				</FormLabel>

				<MaterialButton
					style={{ color: 'white' }}
					onClick={() => {
						setProp((props) => (props.border = !props.border));
					}}
				>
					Border
				</MaterialButton>
			</FormControl>
			<FormControl fullWidth={true} margin="normal" component="fieldset">
				<FormLabel component="legend" style={{ color: 'white' }}>
					Gap
				</FormLabel>
				<Slider
					defaultValue={gap}
					max={100}
					onChange={(_, value) => setProp((props) => (props.gap = value))}
				/>
			</FormControl>
		</div>
	);
};

export const ContainerDefaultProps = {
	background: '#303236',
	padding: 10,
};
Container.craft = {
	props: { ...ContainerDefaultProps, border: true },
	related: {
		settings: ContainerSettings,
	},
};

ContainerImage.craft = {
	props: { ...ContainerDefaultProps, border: true },
	related: {
		settings: ContainerSettings,
	},
};

export const CardTop = ({ children }) => {
	const {
		connectors: { connect },
	} = useNode();
	return (
		<div ref={connect} className="text-only">
			{children}
		</div>
	);
};

CardTop.craft = {
	rules: {
		// Only accept Text
		canMoveIn: (incomingNodes) =>
			incomingNodes.every((incomingNode) => incomingNode.data.type === Text),
	},
};

export const CardBottom = ({ children }) => {
	const {
		connectors: { connect },
	} = useNode();
	return <div ref={connect}>{children}</div>;
};

CardBottom.craft = {
	rules: {
		// Only accept Buttons
		canMoveIn: (incomingNodes) =>
			incomingNodes.every((incomingNode) => incomingNode.data.type === Button),
	},
};

export const Card = ({ background, padding = 20 }) => {
	return (
		<Container background={background} padding={padding}>
			<Element id="text" is={CardTop} canvas>
				<Text text="Title" fontSize={20} />
				<Text text="Subtitle" fontSize={15} />
			</Element>

			<Element id="buttons" is={CardBottom} canvas>
				<Button
					size="small"
					text="Learn more"
					variant="contained"
					color="primary"
				/>
			</Element>
		</Container>
	);
};
Card.craft = {
	props: ContainerDefaultProps,
	related: {
		// Since Card has the same settings as Container, we'll just reuse ContainerSettings
		settings: ContainerSettings,
	},
};

export const Toolbox = ({}) => {
	const { connectors, actions, query } = useEditor();
	return (
		<Box px={2} py={2}>
			<Grid
				container
				direction="column"
				alignItems="center"
				justify="center"
				spacing={1}
			>
				{/* <Grid container direction="column" item>
					<MaterialButton
						onClick={() => { 
							force();
					
						}}
						variant="contained"
					>
						Reload
					</MaterialButton>

				</Grid> */}

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
					{/* <MaterialButton
						onClick={() => {

						}}
						ref={(ref) => connectors.create(ref, <Text text="Text" />)}
						variant="contained"
					>
						Image
					</MaterialButton> */}
				</Grid>
				{/* <Grid container direction="column" item>
          <MaterialButton ref={ref=> connectors.create(ref, <Card />)} variant="contained">Card</MaterialButton>
        </Grid> */}
			</Grid>
		</Box>
	);
};

export const SettingsPanel = () => {
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

ProfileSummary.craft = {
	props: ContainerDefaultProps,
	related: {
		settings: ContainerSettings,
	},
};
const Topbar = ({}) => {
	const { actions, query, enabled, canUndo, canRedo } = useEditor((state) => ({
		enabled: state.options.enabled,
		canUndo: state.options.enabled && query.history.canUndo(),
		canRedo: state.options.enabled && query.history.canRedo(),
	}));
	return (
		<Box px={1} py={1} mt={3} mb={1} bgcolor="#303236">
			<Grid container alignItems="center">
				<Grid item xs>
					<MaterialButton
						size="small"
						variant="contained"
						color="primary"
						disabled={!canUndo}
						onClick={() => actions.history.undo()}
						style={{ marginRight: '10px', color: 'white' }}
					>
						Undo
					</MaterialButton>
				</Grid>
				<Grid item xs>
					<MaterialButton
						size="small"
						variant="contained"
						color="primary"
						disabled={!canRedo}
						onClick={() => actions.history.redo()}
						style={{ marginRight: '10px', color: 'white' }}
					>
						Redo
					</MaterialButton>
				</Grid>
				<Grid item xs>
					{/* <FormControlLabel
						control={
							<Switch
								checked={enabled}
								onChange={(_, value) =>{
									actions.setOptions((options) => (options.enabled = value)) 
									// if(!value)
									// 	onHandleEdit()
									}
								}
							/>
						}
						label="Enable"
					/> */}
				</Grid>

				<Grid item>
					<MaterialButton
						size="small"
						variant="contained"
						color="primary"
						onClick={() => {
							console.log(query.serialize());
						}}
					>
						Save
					</MaterialButton>
				</Grid>
			</Grid>
		</Box>
	);
};

const UploadAndDisplayImage = () => {
	const { connectors, actions, query } = useEditor();

	const [selectedImage, setSelectedImage] = useState(null);
	return (
		<div>
			{selectedImage && (
				<div>
					<img
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

			<div
				ref={(ref) => {
					if (selectedImage)
						return connectors.create(
							ref,
							// <Element is={ContainerImage} padding={20} selectedImage={selectedImage} canvas />
							<ContainerImage padding={0} selectedImage={selectedImage} />
						);
				}}
			>
				<label
					for="files"
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
					id="files"
					type="file"
					onChange={(event) => {
						setSelectedImage(event.target.files[0]);
					}}
				/>
			</div>
		</div>
	);
};

class Summary extends Component {
	state = {
		selectedAccount: '',
		currentTradingAccount: this.props.verification_level,
		lastMonthVolume: 0,
		loadEditor: false,
		setEdit: false,
	};

	componentDidMount() {
		const { user, tradeVolumes, pairs, prices, getUserReferrals } = this.props;

		if (user.id) {
			this.setCurrentTradeAccount(user);
			getUserReferrals();
		} else {
			this.setCurrentTradeAccount(user);
		}
		if (tradeVolumes.fetched) {
			let lastMonthVolume = getLastMonthVolume(
				tradeVolumes.data,
				prices,
				pairs
			);
			this.setState({ lastMonthVolume });
		}

		setTimeout(() => {
			this.setState({ loadEditor: true });
		}, 1000 * 1);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			this.props.user.verification_level !== nextProps.user.verification_level
		) {
			this.setCurrentTradeAccount(nextProps.user);
		}
		if (
			JSON.stringify(this.props.tradeVolumes) !==
			JSON.stringify(nextProps.tradeVolumes)
		) {
			let lastMonthVolume = getLastMonthVolume(
				nextProps.tradeVolumes.data,
				nextProps.prices,
				nextProps.pairs
			);
			this.setState({ lastMonthVolume });
		}
		if (nextProps.user.id !== this.props.user.id && nextProps.user.id) {
			this.props.getUserReferrals();
		}
	}

	logoutConfirm = () => {
		this.props.logoutconfirm();
	};

	onAccountTypeChange = (type) => {
		this.setState({ selectedAccount: type });
	};

	onUpgradeAccount = () => {
		const { openContactForm } = this.props;
		openContactForm();
	};

	setCurrentTradeAccount = (user) => {
		let currentTradingAccount = this.state.currentTradingAccount;
		if (user.verification_level) {
			this.setState({
				currentTradingAccount,
				selectedAccount: user.verification_level,
			});
		} else if (!isLoggedIn()) {
			const { config_level } = this.props;
			this.setState({
				selectedAccount: Object.keys(config_level)[0] || 0,
			});
		}
	};

	onInviteFriends = () => {
		this.props.setNotification(NOTIFICATIONS.INVITE_FRIENDS, {
			affiliation_code: this.props.user.affiliation_code,
		});
	};

	onStakeToken = () => {
		this.props.setNotification(NOTIFICATIONS.STAKE_TOKEN);
	};

	onHandleEdit = () => {
		this.setState({ setEdit: false });
	};
	handleForce = () => {
		this.setState({ loadEditor: false }, () => {
			this.setState({ loadEditor: true });
		});
	};
	render() {
		const {
			user,
			balance,
			pairs,
			coins,
			verification_level,
			config_level,
			affiliation,
			chartData,
			totalAsset,
			router,
			icons: ICONS,
		} = this.props;
		const {
			selectedAccount,
			lastMonthVolume,
			currentTradingAccount,
		} = this.state;

		const { fullname } = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
		const totalAssets = formatAverage(formatBaseAmount(totalAsset));
		const level = selectedAccount
			? selectedAccount
			: isLoggedIn()
			? verification_level
			: Object.keys(config_level)[0];
		const accountData = config_level[level] || {};
		const traderAccTitle =
			accountData.name ||
			STRINGS.formatString(
				STRINGS['SUMMARY.LEVEL_OF_ACCOUNT'],
				verification_level
			);

		const userData =
			config_level[
				isLoggedIn() ? verification_level : Object.keys(config_level)[0]
			] || {};
		const userAccountTitle =
			userData.name ||
			STRINGS.formatString(
				STRINGS['SUMMARY.LEVEL_OF_ACCOUNT'],
				verification_level
			);
		return (
			<div>
				<div className="summary-container">
					{isMobile ? (
						<MobileSummary
							user={user}
							pairs={pairs}
							coins={coins}
							config={config_level}
							selectedAccount={selectedAccount}
							logout={this.logoutConfirm}
							balance={balance}
							chartData={chartData}
							totalAssets={totalAssets}
							lastMonthVolume={lastMonthVolume}
							traderAccTitle={traderAccTitle}
							userAccountTitle={userAccountTitle}
							affiliation={affiliation}
							onInviteFriends={this.onInviteFriends}
							onUpgradeAccount={this.onUpgradeAccount}
							onAccountTypeChange={this.onAccountTypeChange}
							verification_level={verification_level}
						/>
					) : (
						<div
							style={{
								border: `${this.props.setEdit ? '1px' : '0px'} solid white`,
								padding: 10,
							}}
						>
							{this.state.loadEditor ? (
								<Editor
									enabled={this.props.setEdit}
									resolver={{
										CraftContainer,
										ContainerFlex,
										ContainerImage,
										ProfileSummary,
										MyAssets,
										SummaryBlock,
										Connector,
										Image,
										EditWrapper,
										AccountDetails,
										CraftMarkets,
										CraftAccountDetails,
										TraderSideInfo,
										AccountDetails,
										AccountTypesList,
										Card,
										CardBottom,
										CardTop,
										Button,
										Text,
										Container,
										ReactSVG,
										IconTitle,
									}}
								>
									{/* <div style={{
							 position:'fixed',
							 top:'100vh',
							 left:-0,
							 transform:'translateY(-300%)',
							 width:'100%',
							 display: 'flex',
							 flexDirection: 'column',
							 gap: 5
							
						}}>
							<div 
							onClick={() => {
									this.setState({setEdit: true})
								}}
							style={{ backgroundColor: '#0000FF', color: 'white', fontWeight: 'bold', width: 200, textAlign: 'center', cursor: 'pointer' }}>Edit Dashboard Design</div>
						</div> */}

									<div
										style={{
											width: 300,
											height: 1200,
											backgroundColor: '#303236',
											color: 'white',
											position: 'fixed',
											top: '100vh',
											right: 0,
											transform: 'translateY(-100%)',
											zIndex: 1,
											display: this.props.setEdit ? 'block' : 'none',
										}}
									>
										<Topbar />
										<Toolbox />
										<SettingsPanel />
									</div>
									<Frame props={{ orders: this.props.orders, chartData }}>
										<Element id={uniqueId()} is={Connector} canvas>
											<Element id={uniqueId()} is={Connector} canvas>
												{!isMobile && (
													<IconTitle
														stringId="SUMMARY.TITLE"
														text={`${STRINGS['SUMMARY.TITLE']}`}
														textType="title"
														iconPath={ICONS['TAB_SUMMARY']}
														iconId={`${STRINGS['SUMMARY.TITLE']}`}
													/>
												)}
											</Element>

											<div id="summary-header-section"></div>
											{/* <Element id={uniqueId()} is={ContainerFlex} canvas> */}
											<div className="d-flex">
												<ProfileSummary
													user={user}
													balance={balance}
													pairs={pairs}
													coins={coins}
													verification_level={verification_level}
													config_level={config_level}
													affiliation={affiliation}
													chartData={chartData}
													totalAsset={totalAsset}
													router={router}
													ICONS={ICONS}
													userAccountTitle={userAccountTitle}
													totalAssets={totalAssets}
													fullname={fullname}
													onUpgradeAccount={this.onUpgradeAccount}
													onInviteFriends={this.onInviteFriends}
												/>
												<MyAssets
													user={user}
													balance={balance}
													pairs={pairs}
													coins={coins}
													verification_level={verification_level}
													config_level={config_level}
													affiliation={affiliation}
													chartData={chartData}
													totalAsset={totalAsset}
													router={router}
													ICONS={ICONS}
													userAccountTitle={userAccountTitle}
													totalAssets={totalAssets}
													fullname={fullname}
												/>
											</div>

											{/* </Element> */}
											<div className="w-100">
												<CraftMarkets
													user={user}
													balance={balance}
													pairs={pairs}
													coins={coins}
													verification_level={verification_level}
													config_level={config_level}
													affiliation={affiliation}
													chartData={chartData}
													totalAsset={totalAsset}
													router={router}
													ICONS={ICONS}
													userAccountTitle={userAccountTitle}
													totalAssets={totalAssets}
													fullname={fullname}
													onUpgradeAccount={this.onUpgradeAccount}
													onInviteFriends={this.onInviteFriends}
												/>
											</div>
											<div className="w-100">
												<CraftAccountDetails
													user={user}
													balance={balance}
													pairs={pairs}
													coins={coins}
													verification_level={verification_level}
													config_level={config_level}
													affiliation={affiliation}
													chartData={chartData}
													totalAsset={totalAsset}
													router={router}
													ICONS={ICONS}
													userAccountTitle={userAccountTitle}
													totalAssets={totalAssets}
													fullname={fullname}
													onUpgradeAccount={this.onUpgradeAccount}
													onInviteFriends={this.onInviteFriends}
													currentTradingAccount={currentTradingAccount}
													selectedAccount={selectedAccount}
													lastMonthVolume={lastMonthVolume}
													onAccountTypeChange={this.onAccountTypeChange}
												/>
											</div>
										</Element>
									</Frame>
								</Editor>
							) : (
								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<Spin size="large" />
								</div>
							)}
						</div>
					)}
				</div>
				<div id="summary-footer-section"></div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		pairs: state.app.pairs,
		coins: state.app.coins,
		user: state.user || {},
		verification_level: state.user.verification_level,
		balance: state.user.balance,
		prices: state.orderbook.prices,
		price: state.orderbook.price,
		orders: state.order.activeOrders,
		activeLanguage: state.app.language,
		tradeVolumes: state.user.tradeVolumes,
		config_level: state.app.config_level,
		affiliation: state.user.affiliation,
		constants: state.app.constants,
		chartData: state.asset.chartData,
		totalAsset: state.asset.totalAsset,
		setEdit: state.app.editMode,
	};
};

const mapDispatchToProps = (dispatch) => ({
	logoutconfirm: bindActionCreators(logoutconfirm, dispatch),
	setNotification: bindActionCreators(setNotification, dispatch),
	getUserReferrals: bindActionCreators(getUserReferrals, dispatch),
	openContactForm: bindActionCreators(openContactForm, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(Summary));
