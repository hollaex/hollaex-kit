import React, { Fragment, useState } from 'react';
import { Button, Input, Form, Radio, message } from 'antd';
import ColorPicker from '../ColorPicker';
import { updateAssetCoins } from '../AdminFinancials/action';

const { TextArea } = Input;

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
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = async (values) => {
		try {
			setSubmitting(true);
			const payload = {
				id: coinFormData.id,
				symbol: values.symbol || coinFormData.symbol,
				code:
					coinFormData.code ||
					(values.symbol || coinFormData.symbol || '').toLowerCase(),
				fullname: values.fullname || coinFormData.fullname,
				type: assetType || coinFormData.type,
				description: values.description ?? coinFormData.description ?? '',
			};
			await updateAssetCoins(payload);
			message.success('Asset info updated.');
			onClose();
		} catch (error) {
			message.error(error?.data?.message || 'Failed to update asset info');
		} finally {
			setSubmitting(false);
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
					<div className="md-field-wrap">
						<div className="sub-title">Description</div>
						<Form.Item name="description">
							<TextArea
								name="description"
								rows={3}
								placeholder="Write a short description of this asset"
								onChange={handleChange}
							/>
						</Form.Item>
					</div>
					{type === 'info' ? (
						<div className="md-field-wrap">
							<div className="sub-title">Asset type</div>
							<Radio.Group
								name="type"
								value={assetType}
								onChange={(e) => {
									handleSelectChange(e.target.value, 'type');
									setType(e.target.value);
								}}
							>
								<Radio value="blockchain">Blockchain</Radio>
								<Radio value="fiat">Fiat</Radio>
							</Radio.Group>
						</div>
					) : null}
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
					<Button
						type="primary"
						className="green-btn"
						htmlType="submit"
						loading={submitting}
					>
						Confirm
					</Button>
				</div>
			</Form>
		</div>
	);
};

export default EditAsset;
