import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import Form from './FooterForm';
import { AdminHocForm } from '../../../components';

const AddColumnForm = AdminHocForm('ADD_COLUMN_FORM');
const AddLinkForm = AdminHocForm('ADD_LINK_FORM');

const link_sections = (
	fields = {},
	addLink = () => {},
	addColumn = () => {}
) => {
	const section_1 = {
		className: 'section-wrapper',
		header: {
			className: 'section-header',
			fields: {
				column_header_1: {
					type: 'input',
					label: 'Column 1 heading',
					placeholder: 'Column 1 heading',
					// disabled: !is_custom
				},
			},
		},
		content: {
			className: 'section-header',
			fields: {
				login: {
					type: 'input',
					label: 'Login',
					placeholder: 'http://',
					// disabled: !is_custom
				},
				register: {
					type: 'input',
					label: 'Register',
					placeholder: 'http://',
					// disabled: !is_custom
				},
			},
		},
	};
	const section_2 = {
		className: 'section-wrapper',
		header: {
			className: 'section-header',
			fields: {
				column_header_2: {
					type: 'input',
					label: 'Column 2 heading',
					placeholder: 'Column 2 heading',
				},
			},
		},
		content: {
			className: 'section-header',
			fields: {
				contact: {
					type: 'input',
					label: 'Contact',
					placeholder: 'http://',
				},
				privacy: {
					type: 'input',
					label: 'Privacy',
					placeholder: 'http://',
				},
				terms: {
					type: 'input',
					label: 'Terms & conditions',
					placeholder: 'http://',
				},
				website: {
					type: 'input',
					label: 'Website',
					placeholder: 'http://',
				},
			},
		},
	};
	const section_3 = {
		className: 'section-wrapper',
		header: {
			className: 'section-header',
			fields: {
				column_header_3: {
					type: 'input',
					label: 'Column 3 heading',
					placeholder: 'Column 3 heading',
				},
			},
		},
		content: {
			className: 'section-header',
			fields: {
				api: {
					type: 'input',
					label: 'API',
					placeholder: 'http://',
				},
				github: {
					type: 'input',
					label: 'Github',
					placeholder: 'http://',
				},
				information: {
					type: 'input',
					label: 'Information',
					placeholder: 'http://',
				},
			},
		},
	};
	const section_4 = {
		className: 'section-wrapper',
		header: {
			className: 'section-header',
			fields: {
				column_header_4: {
					type: 'input',
					label: 'Column 4 heading',
					placeholder: 'Column 4 heading',
				},
			},
		},
		content: {
			className: 'section-header',
			fields: {
				whitepaper: {
					type: 'input',
					label: 'Whitepaper',
					placeholder: 'http://',
				},
			},
		},
	};
	const section_5 = {
		className: 'section-wrapper',
		header: {
			className: 'section-header',
			fields: {
				column_header_5: {
					type: 'input',
					label: 'Column 5 heading',
					placeholder: 'Column 5 heading',
				},
			},
		},
		content: {
			className: 'section-header',
			fields: {
				instagram: {
					type: 'input',
					label: 'Instagram',
					placeholder: 'http://',
				},
				facebook: {
					type: 'input',
					label: 'Facebook',
					placeholder: 'http://',
				},
				youTube: {
					type: 'input',
					label: 'YouTube',
					placeholder: 'http://',
				},
				twitter: {
					type: 'input',
					label: 'Twitter',
					placeholder: 'http://',
				},
				telegram: {
					type: 'input',
					label: 'Telegram',
					placeholder: 'http://',
				},
				linkedIn: {
					type: 'input',
					label: 'LinkedIn',
					placeholder: 'http://',
				},
			},
		},
	};
	// if (is_custom) {
	const formFields = {
		section_1,
		section_2,
		section_3,
		section_4,
		section_5,
		...fields,
	};
	let count = 1;
	Object.keys(formFields).forEach((key) => {
		const field = formFields[key];
		count = count + (field.header ? 1 : 0);
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
	});
	formFields[`section_${count}`] = {
		className: 'section-wrapper center-content',
		bottomLink: (
			<Button
				block
				type="primary"
				onClick={() => addColumn(`section_${count}`)}
				className="green-btn"
			>
				Add column
			</Button>
		),
	};
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
			default_fields: link_sections(),
			custom_fields: link_sections({}, this.addLink, this.addColumn),
			initialDefault: {
				column_header_1: 'EXCHANGE',
				column_header_2: 'ABOUT',
				column_header_3: 'DEVELOPERS',
				column_header_4: 'RESOURCES',
				column_header_5: 'SOCIAL',
			},
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
			this.setState({
				initialCustom: {
					...this.state.initialCustom,
					...this.props.initialValues,
				},
			});
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			JSON.stringify(this.props.initialValues) !==
			JSON.stringify(prevProps.initialValues)
		) {
			this.setState({
				initialCustom: {
					...this.state.initialCustom,
					...this.props.initialValues,
				},
			});
		}
	}

	handleToggle = (checked) => {
		this.setState({
			isCustom: checked,
			default_fields: link_sections(),
			custom_fields: link_sections(
				this.state.custom_fields,
				this.addLink,
				this.addColumn
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
			custom_fields: link_sections(custom_fields, this.addLink, this.addColumn),
		});
		this.onCancel();
	};

	handleAddLink = (formProps) => {
		const custom_fields = { ...this.state.custom_fields };
		let currentField = custom_fields[this.state.currentSection];
		let currentFieldContent = currentField.content || {};
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
					},
				},
			},
		};
		this.setState({
			custom_fields,
		});
		this.onCancel();
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
					handleSubmitLinks={(formProps) =>
						this.props.handleSubmitFooter(formProps, 'links')
					}
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
