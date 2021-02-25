import React, { Component, Fragment } from 'react';
import { Button, Input, InputNumber, message, Modal, Collapse } from 'antd';
import { WarningFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import _get from 'lodash/get';
import merge from 'lodash.merge';

import { publish } from 'actions/operatorActions';
import withConfig from '../../../components/ConfigProvider/withConfig';
import Image from '../../../components/Image';
import { upload } from './action';

const { TextArea } = Input;

const createMarkup = (row) => {
	return { __html: row };
};

export const NewTierConfirmation = ({ onTypeChange }) => (
	<div>
		<h3>Add tier</h3>
		<div className="d-flex mb-3">
			<div>
				<WarningFilled
					style={{ color: 'red', fontSize: '25px', marginRight: '10px' }}
				/>
			</div>
			<div>
				Once a new user account tier has been added it can't be easily removed.
				Are you sure you want to add a new tier?
			</div>
		</div>
		<div>
			<Button
				className="green-btn"
				onClick={() => onTypeChange('new-tier-form')}
			>
				Yes, create new tier
			</Button>
		</div>
	</div>
);

const Preview = ({
	isNew = false,
	tierData = {},
	onTypeChange,
	handleSave,
	allIcons = {},
	...rest
}) => {
	return (
		<div className="admin-tiers-wrapper">
			<h3>Check and confirm tier</h3>
			<div className="mb-3">
				Please carefully check that the details of this account tier are
				correct.
			</div>
			<div>
				<div className="d-flex tiers-container">
					<div>
						<Image
							icon={allIcons['dark'][`LEVEL_ACCOUNT_ICON_${tierData.id}`]}
							wrapperClassName="tier-icon"
						/>
						{/* {tierData.icon
                            ? <img src={tierData.icon} className="tier-icon" alt={`Account Tier ${tierData.id}`} />
                            : <ReactSVG src={ICONS[`LEVEL_ACCOUNT_ICON_${tierData.id}`]} className="tier-icon" />
                        } */}
					</div>
					<div className="mx-3 f-1">
						<div>
							<div>Account Tier {tierData.id}</div>
							<div className="description">{tierData.description}</div>
						</div>
						<div className="requirement-divider"></div>
						<div>
							<div>Requirements</div>
							<div
								className="description"
								dangerouslySetInnerHTML={createMarkup(tierData.note)}
							/>
						</div>
						{isNew ? (
							<Fragment>
								<div className="requirement-divider"></div>
								<div>
									<div>Default fees</div>
									<div>
										Maker:{' '}
										<span className="description">
											{_get(tierData, 'fees.maker.default')}
										</span>
									</div>
									<div>
										Taker:{' '}
										<span className="description">
											{_get(tierData, 'fees.taker.default')}
										</span>
									</div>
								</div>
							</Fragment>
						) : null}
					</div>
				</div>
			</div>
			{isNew ? (
				<div className="tiers-confirm-warning d-flex">
					<div>
						<WarningFilled
							style={{
								color: '#F28041',
								fontSize: '42px',
								marginRight: '10px',
							}}
						/>
					</div>
					<div>
						<h3 className="warning-txt">WARNING!</h3>
						<div>
							Before adding a new tier be aware that removing tiers may have
							adverse effects upon a working exchange.
						</div>
					</div>
				</div>
			) : null}
			<div className="d-flex mt-3">
				<Button
					className="green-btn"
					onClick={() => {
						if (isNew) {
							onTypeChange('new-tier-form');
						} else {
							onTypeChange('edit-tier-form');
						}
					}}
				>
					Back
				</Button>
				<div className="mx-2"></div>
				<Button className="green-btn" onClick={handleSave}>
					Confirm
				</Button>
			</div>
		</div>
	);
};

export const PreviewContainer = withConfig(Preview);

class NewTierForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			requirements: [{ id: 1, point: '' }],
			tierData: this.props.editData || {},
			currentIcon: {},
			editorState: EditorState.createEmpty(),
			loading: false,
			pendingPublishIcons: {},
		};
	}

	componentDidMount() {
		let editorState = EditorState.createEmpty();
		if (this.props.editData.note) {
			const contentBlock = htmlToDraft(this.props.editData.note);
			if (contentBlock) {
				const contentState = ContentState.createFromBlockArray(
					contentBlock.contentBlocks
				);
				editorState = EditorState.createWithContent(contentState);
			}
		}
		this.setState({
			tierData: this.props.editData || {},
			editorState,
		});
	}

	handleSaveIcon = async (iconKey) => {
		const { currentIcon } = this.state;
		const { updateIcons } = this.props;
		const icons = {};

		this.setState({
			loading: true,
		});

		for (const themeKey in currentIcon) {
			if (currentIcon.hasOwnProperty(themeKey)) {
				icons[themeKey] = {};

				for (const key in currentIcon[themeKey]) {
					if (currentIcon[themeKey].hasOwnProperty(key)) {
						const file = currentIcon[themeKey][key];
						if (file) {
							const formData = new FormData();
							const { name: fileName } = file;
							const uniqueId = Date.now();
							const extension = fileName.split('.').pop();
							const name = `${key}__${themeKey}___${uniqueId}.${extension}`;

							formData.append('name', name);
							formData.append('file', file);

							try {
								const {
									data: { path },
								} = await upload(formData);
								icons[themeKey][key] = path;
								this.setState((prevState) => ({
									currentIcon: {},
								}));
							} catch (error) {
								this.setState({
									loading: false,
								});
								message.error('Something went wrong!');
								return;
							}
						}
					}
				}
			}
		}
		this.setState((prevState) => ({
			...prevState,
			loading: false,
			pendingPublishIcons: merge({}, prevState.pendingPublishIcons, {
				[iconKey]: icons,
			}),
		}));

		updateIcons(icons);
	};

	handleCancelIcon = () => {
		this.setState({ currentIcon: {} });
	};

	handleChangeFile = ({ target: { name, files } }) => {
		const [theme, iconKey] = name.split(',');

		if (files) {
			this.setState(
				(prevState) => ({
					...prevState,
					currentIcon: {
						...prevState.currentIcon,
						[theme]: {
							...prevState.currentIcon[theme],
							[iconKey]: files[0],
						},
					},
				}),
				() => {
					Modal.confirm({
						content: 'Do you want to save this icon?',
						okText: 'Save',
						cancelText: 'Cancel',
						onOk: () => this.handleSaveIcon(iconKey),
						onCancel: this.handleCancelIcon,
					});
				}
			);
		}
	};

	// handleRequirementChange = (event, data) => {
	//     this.setState({
	//         requirements: this.state.requirements.map(requirement => {
	//             if (requirement.id === data.id) {
	//                 return {
	//                     ...requirement,
	//                     point: event.target.value
	//                 }
	//             }
	//             return requirement;
	//         })
	//     });
	// };

	handleChange = (e) => {
		this.setState({
			tierData: {
				...this.state.tierData,
				[e.target.name]: e.target.value,
			},
		});
	};

	handleChangeNumber = (value, name) => {
		const { fees = {}, ...rest } = this.state.tierData;
		this.setState({
			tierData: {
				...rest,
				fees: {
					...fees,
					[name]: {
						default: value,
					},
				},
			},
		});
	};

	saveForm = (id) => {
		const {
			pendingPublishIcons: { [id]: published = {} },
		} = this.state;
		const iconsOverwrites = JSON.parse(localStorage.getItem('icons') || '{}');

		const icons = merge({}, iconsOverwrites, published);
		const configs = { icons };

		publish(configs).then(() => {
			localStorage.setItem('icons', JSON.stringify(icons));
			this.setState({ pendingPublishIcons: {} });
			this.props.handleNext(this.state.tierData);
			this.props.onTypeChange('preview');
		});
	};

	onEditorStateChange = (edState) => {
		const currentState = convertToRaw(edState.getCurrentContent());
		this.setState({
			tierData: {
				...this.state.tierData,
				note: draftToHtml(currentState),
			},
			editorState: edState,
		});
	};

	renderImageUpload = (id, theme, index, showLable = true) => {
		const { allIcons } = this.props;
		return (
			<div key={index} className="file-container">
				<div className="file-img-content">
					<Image icon={allIcons[theme][id]} wrapperClassName="icon-img" />
				</div>
				<label>
					{showLable && `${theme} theme`}
					<span className="anchor">Upload</span>
					<input
						type="file"
						accept="image/*"
						onChange={this.handleChangeFile}
						name={`${theme},${id}`}
					/>
				</label>
			</div>
		);
	};

	render() {
		const { tierData, editorState } = this.state;
		const { isNew = false, themeOptions } = this.props;
		return (
			<div className="new-tier-form admin-tiers-wrapper">
				<h3>Account tier details</h3>
				<div>
					<div>Name</div>
					<Input
						name="name"
						placeholder="Tier name"
						onChange={this.handleChange}
						value={tierData.name}
					/>
				</div>
				<div className="requirement-divider"></div>
				<div className="file-wrapper">
					<Collapse defaultActiveKey={['1']} bordered={false} ghost>
						<Collapse.Panel showArrow={false} key="1" disabled={true}>
							<div className="file-wrapper">
								{themeOptions
									.filter(({ value: theme }) => theme === 'dark')
									.map(({ value: theme }, index) =>
										this.renderImageUpload(
											`LEVEL_ACCOUNT_ICON_${tierData.id}`,
											theme,
											index
										)
									)}
							</div>
						</Collapse.Panel>
						<Collapse.Panel
							showArrow={false}
							header={
								<span
									style={{ color: '#ffffff' }}
									className="underline-text text-center w-100"
								>
									Theme Specific Graphics
								</span>
							}
							key="2"
						>
							<div className="file-wrapper">
								{themeOptions
									.filter(({ value: theme }) => theme !== 'dark')
									.map(({ value: theme }, index) =>
										this.renderImageUpload(
											`LEVEL_ACCOUNT_ICON_${tierData.id}`,
											theme,
											index
										)
									)}
							</div>
						</Collapse.Panel>
					</Collapse>
				</div>
				<div className="requirement-divider"></div>
				<div>
					<div className="sub-title">Description</div>
					<TextArea
						rows={3}
						name="description"
						placeholder="Write a description here..."
						onChange={this.handleChange}
						value={tierData.description}
					/>
				</div>
				<div className="requirement-divider"></div>
				<div>
					<div className="sub-title">Requirement bullet point</div>
					{/* {this.state.requirements.map((requirement, index) => (
                        <div key={index} className="my-1">
                            <Input
                                name={requirement.id}
                                placeholder="Requirement bullet point"
                                value={requirement.point}
                                onChange={(e) => this.handleRequirementChange(e, requirement)}
                            />
                        </div>
                    ))} */}
					<Editor
						wrapperClassName="text-editor-wrapper"
						editorClassName="text-editor"
						toolbarClassName="text-editor-toolbar"
						editorState={editorState}
						onEditorStateChange={this.onEditorStateChange}
					/>
					{/* <div className="my-2">
                        <Button
                            type="primary"
                            onClick={() => this.setState({
                                requirements: [
                                    ...this.state.requirements,
                                    {
                                        id: (this.state.requirements.length + 1),
                                        point: ''
                                    }
                                ]
                            })}
                        >
                            + Add bullet point
                        </Button>
                    </div> */}
				</div>
				{isNew ? (
					<Fragment>
						<div className="requirement-divider"></div>
						<div>
							<div className="sub-title">Default maker trading fee</div>
							<InputNumber
								name="maker_fee"
								value={_get(tierData, 'fees.maker.default')}
								onChange={(value) => this.handleChangeNumber(value, 'maker')}
							/>
						</div>
						<div className="requirement-divider"></div>
						<div>
							<div className="sub-title">Taker trading fee</div>
							<InputNumber
								name="taker_fee"
								value={_get(tierData, 'fees.taker.default')}
								onChange={(value) => this.handleChangeNumber(value, 'taker')}
							/>
						</div>
					</Fragment>
				) : null}
				<div className="d-flex align-items-center mt-3">
					<div>
						<ExclamationCircleOutlined
							style={{ fontSize: '44px', marginRight: '10px' }}
						/>
					</div>
					<div>
						The default trading fee will be applied to all trading pairs. You'll
						be able to define each pairs trading fees in the fees section once
						this tier has been created.
					</div>
				</div>
				<Button
					type="primary"
					className="green-btn my-2"
					onClick={() => this.saveForm(`LEVEL_ACCOUNT_ICON_${tierData.id}`)}
				>
					Next
				</Button>
			</div>
		);
	}
}

export default withConfig(NewTierForm);
