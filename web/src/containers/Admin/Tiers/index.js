import React, { useEffect, useState } from 'react';
import { Tabs, Modal, message } from 'antd';

import TiersContainer from './Tiers';
import Limits from './Limits';
import Fees from './Fees';
import NewTierForm, { NewTierConfirmation, PreviewContainer } from './ModalForm';
import { requestTiers, addNewTier, updateTier } from './action';
import './index.css';

const TabPane = Tabs.TabPane;

const renderContent = (isNew, type, editData, onTypeChange, handleNext, handleSave) => {
    switch (type) {
        case 'new-tier-confirm':
            return <NewTierConfirmation onTypeChange={onTypeChange} />;
        case 'new-tier-form':
            return (
                <NewTierForm
                    isNew={isNew}
                    editData={editData}
                    onTypeChange={onTypeChange}
                    handleNext={handleNext}
                />
            );
        case 'edit-tier-form':
            return (
                <NewTierForm
                    isNew={isNew}
                    editData={editData}
                    onTypeChange={onTypeChange}
                    handleNext={handleNext}
                />
            );
        case 'preview':
            return <PreviewContainer isNew={isNew} tierData={editData} onTypeChange={onTypeChange} handleSave={handleSave} />;
        default:
            return <div></div>;
    }
};

const Tiers = () => {
    const [userTiers, setTiers] = useState({});
    const [isNew, setNew] = useState(false);
    const [isOpen, setOpen] = useState(false);
    const [modalType, setType] = useState('');
    const [editData, setData] = useState({});

    useEffect(() => {
        getTiers();
    }, []);
    const getTiers = () => {
        requestTiers()
            .then((res) => {
                setTiers(res);
            })
            .catch((err) => {
                console.error(err);
            });
    };
    const handleEdit = (data) => {
        setOpen(true);
        setType('edit-tier-form');
        setData(data);
    };
    const handleAdd = () => {
        setOpen(true);
        setNew(true);
        setType('new-tier-confirm');
        setData({
            id: (Object.keys(userTiers).length + 1),
            level: (Object.keys(userTiers).length + 1),
            icon: '',
            deposit_limit: 0,
            withdrawal_limit: 0
        });
    };
    const handleClose = () => {
        setOpen(false);
        setNew(false);
        setType('');
        setData({});
    };
    const onTypeChange = (type) => {
        setType(type);
    };
    const handleNext = (data) => {
        setData(data);
    };
    const handleSaveTiers = () => {
        let formProps = { ...editData };
        delete formProps.id;
        addNewTier(formProps)
            .then((res) => {
                getTiers();
                handleClose();
            })
            .catch(err => {
                let error = err && err.data
					? err.data.message
                    : err.message;
                message.error(error);
            });
    };
    const handleUpdateTiers = () => {
        let formProps = { ...editData };
        delete formProps.fees;
        updateTier(editData)
            .then((res) => {
                getTiers();
                handleClose();
            })
            .catch(err => {
                let error = err && err.data
					? err.data.message
                    : err.message;
                message.error(error);
            });
    };
    const handleSubmit = () => {
        if (isNew) {
            handleSaveTiers();
        } else {
            handleUpdateTiers();
        }
    };
    return (
        <div className="tiers-wrapper w-100">
            <Tabs>
                <TabPane tab="Account tiers" key="tiers">
                    <TiersContainer
                        userTiers={userTiers}
                        handleEdit={handleEdit}
                        handleAdd={handleAdd}
                    />
                </TabPane>
                <TabPane tab="Limits" key="limits">
                    <Limits userTiers={userTiers} />
                </TabPane>
                <TabPane tab="Fees" key="fees">
                    <Fees userTiers={userTiers} />
                </TabPane>
            </Tabs>
            <Modal
                visible={isOpen}
                footer={null}
                onCancel={handleClose}
                width={
                    modalType === 'preview'
                        ? 520
                        : modalType === 'new-tier-confirm'
                            ? 350
                            : 420
                }
            >
                {renderContent(isNew, modalType, editData, onTypeChange, handleNext, handleSubmit)}
            </Modal>
        </div>
    );
};

export default Tiers;