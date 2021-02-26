import React, { Component } from 'react';
import { message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import _isEqual from 'lodash/isEqual';

import Form from './FooterForm';
import { AdminHocForm } from '../../../components';

const AddColumnForm = AdminHocForm('ADD_COLUMN_FORM');
const AddLinkForm = AdminHocForm('ADD_LINK_FORM');

const link_sections = (
	fields = {},
	links = {},
	addLink = () => {},
	handleRemoveHeader = () => {},
	handleRemoveLinks = () => {},
	isInitial = false
) => {
	const sectionFields = {};
	Object.keys(links)
		.filter((sectionKey) => {
			let value = typeof links[sectionKey] === 'object';
			if (!isInitial) {
				value =
					typeof links[sectionKey] === 'object' &&
					typeof fields[sectionKey] === 'object';
			}
			return value;
		})
		.forEach((key) => {
			let section = links[key];
			let headerFields = {};
			let contentFields = {};
			if (section.header) {
				Object.keys(section.header).forEach((key) => {
					headerFields[key] = {
						type: 'input',
						label: key,
						placeholder: key,
						isClosable: true,
						closeCallback: () => handleRemoveHeader(key),
					};
				});
				Object.keys(section.content).forEach((key) => {
					contentFields[key] = {
						type: 'input',
						label: key,
						placeholder: key,
						isClosable: true,
						closeCallback: () => handleRemoveLinks(headerFields, key),
					};
				});
				sectionFields[key] = {
					className: 'section-wrapper',
					header: {
						className: 'section-header',
						fields: headerFields,
					},
					content: {
						className: 'section-header',
						fields: contentFields,
					},
				};
			}
		});
	// if (is_custom) {
	const formFields = {
		...sectionFields,
		...fields,
	};
	let count = 1;
	Object.keys(formFields).forEach((key) => {
		const field = formFields[key];
		count = count + (field.header ? 1 : 0);
		if (typeof field === 'object' && field.header) {
			formFields[key] = {
				...field,
				bottomLink: (
					<div className="admin-link pointer">
						<span onClick={() => addLink(key)}>
							<PlusOutlined style={{ color: '#FFFFFF' }} />
							Add link
						</span>
					</div>
				),
			};
		}
	});
	return formFields;
	// } else {
	//     return { section_1, section_2, section_3, section_4, section_5 };
	// }
};

const add_link_field = {
	link: {
		type: 'input',
		label: 'Link name',
		placeholder: 'Link name',
	},
};

const add_column_field = {
	column: {
		type: 'text',
		label: 'Column name',
		placeholder: 'Column name',
	},
};

class FooterConfig extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isCustom: true,
			custom_fields: link_sections(
				{},
				this.props.links,
				this.addLink,
				this.handleRemoveHeader,
				this.handleRemoveLinks,
				true
			),
			initialCustom: {
				column_header_1: 'EXCHANGE',
			},
			isAddColumn: false,
			isAddLink: false,
			currentSection: '',
		};
	}

	componentDidMount() {
		if (this.props.initialValues) {
			this.generateInitialValues();
		}
		if (this.props.links && Object.keys(this.props.links).length) {
			this.setState({
				custom_fields: link_sections(
					{},
					this.props.links,
					this.addLink,
					this.handleRemoveHeader,
					this.handleRemoveLinks,
					true
				),
			});
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			JSON.stringify(this.props.initialValues) !==
			JSON.stringify(prevProps.initialValues)
		) {
			this.generateInitialValues();
		}
		if (JSON.stringify(this.props.links) !== JSON.stringify(prevProps.links)) {
			let prevFields = {};
			if (prevProps.links && Object.keys(prevProps.links).length) {
				prevFields = this.state.custom_fields;
			}
			this.setState({
				custom_fields: link_sections(
					prevFields,
					this.props.links,
					this.addLink,
					this.handleRemoveHeader,
					this.handleRemoveLinks
				),
			});
		}
	}

	generateInitialValues = () => {
		const { initialValues } = this.props;
		let initialCustom = {
			...this.state.initialCustom,
		};
		Object.keys(initialValues)
			.filter((sectionKey) => typeof initialValues[sectionKey] === 'object')
			.forEach((key) => {
				let tempSection = initialValues[key];
				initialCustom = {
					...initialCustom,
					...tempSection.header,
					...tempSection.content,
				};
			});
		this.setState({ initialCustom });
	};

	handleToggle = (checked) => {
		this.setState({
			isCustom: checked,
			custom_fields: link_sections(
				this.state.custom_fields,
				this.props.links,
				this.addLink,
				this.handleRemoveHeader,
				this.handleRemoveLinks
			),
		});
	};

	addLink = (section) => {
		this.setState({
			isAddLink: true,
			currentSection: section,
		});
	};

	addColumn = (section) => {
		this.setState({
			isAddColumn: true,
			currentSection: section,
		});
	};

	handleRemoveHeader = (headerName) => {
		let data = {};
		Object.entries(this.state.custom_fields).forEach(([key, section]) => {
			let headerKeys =
				section.header && section.header.fields
					? Object.keys(section.header.fields)
					: [];
			if (!headerKeys.includes(headerName)) {
				data[key] = section;
			} else {
				data[key] = '';
			}
		});
		this.setState({
			custom_fields: link_sections(
				data,
				this.props.links,
				this.addLink,
				this.handleRemoveHeader,
				this.handleRemoveLinks
			),
		});
	};

	handleRemoveLinks = (headerFields = {}, fieldName) => {
		let data = {};
		const headerKeys = Object.keys(headerFields);
		Object.entries(this.state.custom_fields).forEach(([key, section]) => {
			let headerFields =
				section.header && section.header.fields
					? Object.keys(section.header.fields)
					: [];
			if (_isEqual(headerFields, headerKeys)) {
				let contentFields =
					section.content && section.content.fields
						? section.content.fields
						: {};
				let resultContent = {};
				Object.entries(contentFields).forEach(([label, value]) => {
					if (label !== fieldName) {
						resultContent[label] = value;
					}
				});
				data[key] = {
					...section,
					content: {
						...section.content,
						fields: resultContent,
					},
				};
			} else {
				data[key] = section;
			}
		});
		this.setState({ custom_fields: data });
	};

	onCancel = () => {
		this.setState({
			isAddColumn: false,
			isAddLink: false,
			currentSection: '',
		});
	};

	handleAddColumn = (formProps) => {
		const custom_fields = { ...this.state.custom_fields };
		let count = this.state.currentSection.split('_')[1] || 2;
		custom_fields[this.state.currentSection] = {
			className: 'section-wrapper',
			header: {
				className: 'section-header',
				fields: {
					[`column_header_${count}`]: {
						type: 'input',
						label: `Column ${count} heading`,
						placeholder: `Column ${count} heading`,
						isClosable: true,
						closeCallback: () =>
							this.handleRemoveHeader(`column_header_${count}`),
					},
				},
			},
			content: {
				className: 'section-header',
				fields: {},
			},
		};
		const initialCustom = { ...this.state.initialCustom };
		initialCustom[`column_header_${count}`] = formProps.column;
		this.setState({
			initialCustom,
			custom_fields: link_sections(
				custom_fields,
				this.props.links,
				this.addLink,
				this.handleRemoveHeader,
				this.handleRemoveLinks
			),
		});
		this.onCancel();
	};

	handleAddLink = (formProps) => {
		let initialCustom = { ...this.state.initialCustom };
		if (
			formProps.link &&
			Object.keys(initialCustom).includes(formProps.link.toLowerCase())
		) {
			message.warn('Link already exist');
		} else {
			const custom_fields = { ...this.state.custom_fields };
			let currentField = custom_fields[this.state.currentSection];
			let currentFieldContent = currentField.content || {};
			let currentFieldHeader = currentField.header || {};
			let currentContentFields = currentFieldContent.fields || {};
			custom_fields[this.state.currentSection] = {
				...currentField,
				content: {
					...currentFieldContent,
					fields: {
						...currentContentFields,
						[formProps.link.toLowerCase()]: {
							type: 'input',
							label: formProps.link,
							placeholder: 'http://',
							isClosable: true,
							closeCallback: () =>
								this.handleRemoveLinks(
									currentFieldHeader.fields,
									formProps.link.toLowerCase()
								),
						},
					},
				},
			};
			initialCustom[formProps.link.toLowerCase()] = '';
			this.setState({
				initialCustom,
				custom_fields,
			});
			this.onCancel();
		}
	};

	handleSubmitLinks = (formProps) => {
		const { custom_fields } = this.state;
		const formValues = {};
		Object.keys(custom_fields).forEach((sectionKey) => {
			let section = custom_fields[sectionKey] || {};
			let header = {};
			let content = {};
			if (section.header) {
				Object.keys(section.header.fields).forEach((headerKey) => {
					header[headerKey] = formProps[headerKey];
				});
				Object.keys(section.content.fields).forEach((contentKey) => {
					content[contentKey] = formProps[contentKey];
				});
				formValues[sectionKey] = {
					header,
					content,
				};
			} else {
				formValues[sectionKey] = '';
			}
		});
		this.props.handleSubmitFooter(formValues, 'links');
	};

	render() {
		const { custom_fields, initialCustom, isAddColumn, isAddLink } = this.state;
		return (
			<div>
				<h3>Footer Links</h3>
				<Form
					fields={custom_fields}
					initialValues={initialCustom}
					customFields={true}
					addColumn={this.addColumn}
					handleSubmitLinks={this.handleSubmitLinks}
				/>
				{/* <p className="bottom-description">
					Add/change footer description and small text{' '}
					<span>
						<span>here.</span>
					</span>
				</p> */}
				<Modal
					visible={isAddColumn || isAddLink}
					title={isAddColumn ? 'Add Column' : 'Add Link'}
					footer={null}
					// onOk={this.handleOk}
					onCancel={this.onCancel}
				>
					<div>
						{isAddColumn ? (
							<AddColumnForm
								fields={add_column_field}
								onSubmit={this.handleAddColumn}
								buttonText="Add column"
								buttonClass="green-btn"
							/>
						) : (
							<AddLinkForm
								fields={add_link_field}
								onSubmit={this.handleAddLink}
								buttonText="Add link"
								buttonClass="green-btn"
							/>
						)}
					</div>
				</Modal>
			</div>
		);
	}
}

export default FooterConfig;
