import React, { useEffect, useState } from 'react';
import { Tabs, Modal } from 'antd';

import TiersContainer from './Tiers';
import NewTierForm, { NewTierConfirmation } from './ModalForm';
import { requestTiers } from './action';
import './index.css';

const TabPane = Tabs.TabPane;

const renderContent = (type, editData, onTypeChange) => {
    switch (type) {
        case 'new-tier-confirm':
            return <NewTierConfirmation onTypeChange={onTypeChange} />;
        case 'new-tier-form':
            return <NewTierForm />;
        case 'edit-tier-form':
            return <NewTierForm editData={editData} />;
        case 'preview':
            return <div></div>;
        default:
            return <div></div>;
    }
};

const Tiers = () => {
    const [userTiers, setTiers] = useState({});
    const [isOpen, setOpen] = useState(false);
    const [modalType, setType] = useState('');
    const [editData, setData] = useState({});

    useEffect(() => {
        requestTiers()
            .then((res) => {
                setTiers(res);
            })
            .catch((err) => {
                console.error(err);
            })
    }, []);
    const handleEdit = (data) => {
        setOpen(true);
        setType('edit-tier-form');
        setData(data);
    };
    const handleAdd = () => {
        setOpen(true);
        setType('new-tier-confirm');
    };
    const handleClose = () => {
        setOpen(false);
        setType('');
        setData({});
    };
    const onTypeChange = (type) => {
        setType(type);
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
                    <div>
                        Limits
                    </div>
                </TabPane>
                <TabPane tab="Fees" key="fees">
                    <div>
                        Fees
                    </div>
                </TabPane>
            </Tabs>
            <Modal
                visible={isOpen}
                footer={null}
                onCancel={handleClose}
                width={
                    modalType === 'new-tier-confirm'
                        ? 350
                        : 420
                }
            >
                {renderContent(modalType, editData, onTypeChange)}
            </Modal>
        </div>
    );
};

export default Tiers;