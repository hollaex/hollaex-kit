import React, { Fragment, useState } from 'react';
import { Button, Select, Input, Form } from 'antd';
import ColorPicker from '../ColorPicker';

const { Option } = Select;

const ASSET_TYPES = [
	{ label: 'Blockchain', value: 'blockchain' },
	{ label: 'Fiat', value: 'fiat' },
	{ label: 'Other', value: 'other' },
];

const EditAsset = ({
	type = 'color',
	coinFormData = {},
	handleChange,
	handleSelectChange,
	handleMetaChange,
	onClose,
}) => {
	const { meta = {} } = coinFormData;
	const [assetType, setType] = useState(coinFormData.type);
	const [form] = Form.useForm();

	const handleSubmit = (values) => {
		if (values) {
			onClose();
		}
	};

	const renderItems = () => {
		if (type === 'color') {
			return (
				<div className="md-field-wrap">
					<span className="sub-title">Color</span> <span>(HEX Value):</span>
					<ColorPicker
						value={meta.color}
						onChange={(val) => handleMetaChange(val, 'color')}
					/>
				</div>
			);
		} else {
			return (
				<Fragment>
					{!coinFormData.verified ? (
						<Fragment>
							<div className="md-field-wrap">
								<div className="sub-title">Type</div>
								<Select
									name={'type'}
									value={assetType}
									onChange={(value) => {
										handleSelectChange(value, 'type');
										setType(value);
									}}
								>
									{ASSET_TYPES.map((type, index) => (
										<Option key={index} value={type.value}>
											{type.label}
										</Option>
									))}
								</Select>
							</div>
							<div className="md-field-wrap">
								<div className="sub-title">Asset symbol</div>
								<Form.Item
									name="symbol"
									rules={[
										{
											required: true,
											message: 'This field is required!',
										},
										{
											max: 8,
											message: 'It must be maximum 8 characters.',
										},
										{
											min: 2,
											message: 'It must be minimum 2 characters.',
										},
									]}
								>
									<Input
										name="symbol"
										placeholder="Enter short hand name"
										onChange={handleChange}
									/>
								</Form.Item>
							</div>
						</Fragment>
					) : null}
					<div className="md-field-wrap">
						<div className="sub-title">Asset name</div>
						<Form.Item
							name="fullname"
							rules={[
								{
									required: true,
									message: 'This field is required!',
								},
							]}
						>
							<Input
								name="fullname"
								placeholder="Enter long form name"
								onChange={handleChange}
							/>
						</Form.Item>
					</div>
					{assetType === 'vault' ? (
						<div className="md-field-wrap">
							<div className="sub-title">Contract</div>
							<Input
								name={'contract'}
								placeholder={'Enter short hand name'}
								value={coinFormData.contract}
								onChange={handleChange}
							/>
						</div>
					) : null}
				</Fragment>
			);
		}
	};

	return (
		<div>
			<div className="title">Edit Asset</div>
			<Form
				form={form}
				name="EditAssetForm"
				onFinish={handleSubmit}
				initialValues={coinFormData}
			>
				<div className="edit-wrap">{renderItems()}</div>
				<div className="btn-wrapper">
					<Button type="primary" className="green-btn" onClick={onClose}>
						Back
					</Button>
					<div className="separator"></div>
					<Button type="primary" className="green-btn" htmlType="submit">
						Confirm
					</Button>
				</div>
			</Form>
		</div>
	);
};

export default EditAsset;
