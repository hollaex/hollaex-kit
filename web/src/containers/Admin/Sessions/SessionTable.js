import React, { useState, useEffect } from 'react';
import MultiFilter from '../../Admin/AdminFinancials/TableFilter';
import { message, Table, Button, Spin, Modal } from 'antd';
import { getExchangeSessions, getExchangeSessionsCsv } from './actions';
import { formatDate } from 'utils';
import { CloseOutlined } from '@ant-design/icons';
import SessionFilters from './SessionFilters';
import { COUNTRIES_OPTIONS } from '../../../utils/countries';

const columns = [
	{
		title: 'ID',
		dataIndex: 'id',
		key: 'id',
		render: (user_id, data) => {
			return (
				<div className="d-flex">
					<Button className="ant-btn green-btn ant-tooltip-open ant-btn-primary">
						{data?.id}
					</Button>
					{/* <div className="ml-3">{data.User.email}</div> */}
				</div>
			);
		},
	},
	{
		title: 'Last seen (Most recent first)',
		dataIndex: 'last_seen',
		key: 'last_seen',
        render: (user_id, data) => {
			return (
				<div className="d-flex">
				    {formatDate(data?.last_seen)}
				</div>
			);
		},
	},
	{
		title: 'Session started',
		dataIndex: 'created_at',
		key: 'created_at',
        render: (user_id, data) => {
			return (
				<div className="d-flex">
				    {formatDate(data?.created_at)}
				</div>
			);
		},
	},
	{
		title: 'Session Expiry',
		dataIndex: 'expiry_date',
		key: 'expiry_date',
        render: (user_id, data) => {
			return (
				<div className="d-flex">
				    {formatDate(data?.expiry_date)}
				</div>
			);
		},
	},
    {
		title: 'Status',
		dataIndex: 'status',
		key: 'status',
        render: (user_id, data) => {
			return (
				<div className="d-flex" style={{ gap: 20 }}>
				    <div style={{ position:'relative', top: 6, color: '#ccc' }}>Active</div>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        className="ant-btn green-btn ant-tooltip-open ant-btn-primary">
						Revoke
					</Button>
				</div>
			);
		},
	},
];

const fieldKeyValue = {
    id: { type: 'string', label: 'Session ID' },
    last_seen:{
        type: 'dropdown',
        label: 'Time seen within',
        options: [
            { label: 'None', value: -1 },
            { label: 'Last 24 hours', value: 24 },
            { label: 'Last 1 hour', value: 1 },
        ],
    },
    status:{
        type: 'dropdown',
        label: 'Status',
        options: [
            { label: 'None', value: -1 },
            { label: 'Active', value: true },
            { label: 'Expired', value: false },
        ],
    },
};

const defaultFilters = [
    { 
        field: 'status',  
        type: 'dropdown',
        label: 'Status',
        value: null,
        options: [
            { label: 'None', value: -1 },
            { label: 'Active', value: true },
            { label: 'Expired', value: false },
        ],
    }
];

const SessionTable = () => {
    const [userData, setUserData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [queryValues, setQueryValues] = useState({});
    const [queryFilters, setQueryFilters] = useState({
        total: 0,
        page: 1,
        pageSize: 10,
        limit: 50,
        currentTablePage: 1,
        isRemaining: true
    })
 
    const [displayRevokeModal, setDisplayRevokeModal] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		getSession();
	}, []);

	const getSession = async (values = {}) => {
		try {
			setQueryValues(values);
			const res = await getExchangeSessions(values);
			if (res && res.data) {
                console.log(res.data)
				setUserData(res.data);
				setIsLoading(false);
			}
		} catch (error) {
			message.error(error.data.message);
			setIsLoading(false);
		}
	};

	const requestDownload = () => {
		return getExchangeSessionsCsv({ ...queryValues, format: 'csv' });
	};

    const renderRowContent = ({ created_at }) => {
        return (
            <div>
                <div style={{ fontWeight: 'bold' }}>Country:</div>
                <div style={{ fontWeight: 'bold' }}>IP Address:</div>
                <div style={{ fontWeight: 'bold' }}>Device:</div>
            </div>
        );
    };

    const pageChange = (count, pageSize) => {
		const { page, limit, isRemaining } = this.state;
		const pageCount = count % 5 === 0 ? 5 : count % 5;
		const apiPageTemp = Math.floor(count / 5);
		// if (limit === pageSize * pageCount && apiPageTemp >= page && isRemaining) {
		// 	this.requestFullUsers(page + 1, limit);
		// }
		// this.setState({ currentTablePage: count });
	};
	
	return (
		<div>
			<div style={{ color: '#ccc' }}>Below are details of currently active user sessions. Revoking a session will log the user out from their account.</div>
            <div>
			    <div style={{ marginTop: 20 }}>
                    <SessionFilters
                        applyFilters={() => {}}
                        fieldKeyValue={fieldKeyValue}
                        defaultFilters={defaultFilters}
                    />
			    
			    </div>
			    <div className="mt-5">
			    	<span
			    		onClick={(e) => { requestDownload(); }}
			    		className="mb-2 underline-text cursor-pointer"
			    	>
			    		Download below CSV table
			    	</span>
			    	<div className="mt-4 ">
			    		<Spin spinning={isLoading}>
			    			<Table 
                                className="blue-admin-table"
                                columns={columns} 
                                dataSource={userData}
                                expandedRowRender={renderRowContent}
                                expandRowByClick={true}
                                rowKey={(data) => {
                                    return data.id;
                                }}
                                pagination={{
                                    current: queryFilters.currentTablePage,
                                    onChange: pageChange,
                                }}
                                 />
			    		</Spin>
			    	</div>
			    </div>

                <Modal
                    maskClosable={false}
                    closeIcon={<CloseOutlined style={{ color: 'white' }} />}
                    bodyStyle={{
                        backgroundColor: '#27339D',
                    }}
                    visible={displayRevokeModal}
                    footer={null}
                    onCancel={() => {
                        // handleCloseConfigModal();
                    }}
                    >
                    <div style={{ fontWeight: '600', color: 'white', fontSize: 18, marginBottom: 20 }}>Confi</div>

                    <div style={{ marginBottom: 30 }} >Change liquidity and price source for BTC/USDT Quick Trade market.</div>


                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 15,
                            justifyContent: 'space-between',
                            marginBottom: 20
                        }}
                    >
                        <Button
                            onClick={() => {
                                // handleCloseConfigModal();
                            }}
                            style={{
                                backgroundColor: '#288500',
                                color: 'white',
                                flex: 1,
                                height: 35,
                            }}
                            type="default"
                        >
                            Back
                        </Button>
                        <Button
                            onClick={async () => {
                            
                            }}
                            style={{
                                backgroundColor: '#288500',
                                color: 'white',
                                flex: 1,
                                height: 35,
                            }}
                            type="default"
                        >
                            Confirm
                        </Button>
                    </div>
			    </Modal>
		    </div>
		</div>		
	);
};


export default SessionTable;

