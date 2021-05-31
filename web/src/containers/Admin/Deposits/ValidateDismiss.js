import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Input } from 'antd';

const { Item } = Form;

const ValidateDismiss = ({
    validateData,
    statusType,
    onCancel,
    handleConfirm
}) => {
    const [isAutoFocus, setAutoFocus] = useState(false);
    const [type, setType] = useState("");
    const handleEdit = (type) => {
        setAutoFocus(!isAutoFocus);
        setType(type);
    }
    const transaction_id = useRef(null);
    const description = useRef(null);
    useEffect(() => {
        if (type === "transaction_id") {
            transaction_id.current.focus();
        } else if (type === "description") {
            description.current.focus();
        }
    }, [type]);

    const handleSubmit = (values) => {
        let formProps = {
            ...validateData,
            transaction_id: values.transaction_id,
            description: values.description
        }
        handleConfirm(formProps);
    };
    return (
        <Form
            name="validate-dismiss-form"
            initialValues={validateData}
            onFinish={handleSubmit}
            className="Validate-Dismiss-popup"
        >
            <div className="title">{statusType === "validate" ? "Validate" : "Dismiss"}</div>
            <div className="my-3">Please check and confirm the details below.</div>
            <span className="legend">Check & Confirm</span>
            <div className="confirm-container">
                <div className="mt-3">
                    <span className="bold">Type:</span>{' '} {validateData.type}
                </div>
                <div className="mt-3">
                    <span className="bold">Currency:</span>{' '} {validateData.currency}
                </div>
                <div className="mt-3">
                    <span className="bold">Amount:</span> {validateData.amount}
                </div>
            </div>
            <div className="my-5">
                <div>Transaction ID</div>
                <Item
                    name="transaction_id"
                >
                    <Input ref={transaction_id}/>
                </Item>
                <div className="edit-link-wrapper">
                    <div
                        className="edit-link"
                        onClick={() => handleEdit("transaction_id")}
                    >
                        Edit
                    </div>
                </div>
                <div>Description</div>
                <Item
                    name="description"
                >
                    <Input ref={description}/>
                </Item>
                <div className="edit-link-wrapper">
                    <div
                        className="edit-link"
                        onClick={() => handleEdit("description")}
                    >
                        Edit
                    </div>
                </div>
            </div>
            <div className="d-flex align-items-center mt-4">
                <Button type="ghost" className="f-1" onClick={onCancel}>
                    Back
                </Button>
                <Button
                    type="primary"
                    htmlType="submit"
                    className="green-btn f-1 ml-2"
                >
                    Confirm
                </Button>
            </div>
        </Form>
    )
}

export default ValidateDismiss;