import React, { useState, useEffect } from 'react';
import { Table, Button, Spin } from 'antd';
import { requestUserLogins, requestUserLoginsDownload } from './actions';
import { formatDate } from 'utils';
import SessionFilters from './SessionFilters';
import { COUNTRIES_OPTIONS } from '../../../utils/countries';

const LoginTable = () => {
    const [userData, setUserData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [queryValues, setQueryValues] = useState({});
    const [queryFilters, setQueryFilters] = useState({
        total: 0,
        page: 1,
        pageSize: 10,
        limit: 50,
        currentTablePage: 1,
        isRemaining: true,
    })
 

    const columns = [
        {
            title: 'User ID',
            dataIndex: 'user_id',
            key: 'user_id',
            render: (user_id, data) => {
                return (
                    <div className="d-flex">
                        <Button className="ant-btn green-btn ant-tooltip-open ant-btn-primary">
                            {data?.user_id}
                        </Button>
                        {/* <div className="ml-3">{data.User.email}</div> */}
                    </div>
                );
            },
        },
        {
            title: 'Time (Most recent first)',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (user_id, data) => {
                return (
                    <div className="d-flex">
                        {formatDate(data?.timestamp)}
                    </div>
                );
            },
        },
        {
            title: 'Result',
            dataIndex: 'status',
            key: 'status',
            render: (user_id, data) => {
                return (
                    <div className="d-flex">
                        {data.status === true ? '✔ Successful login' : `❌ Failed login: ${data.attempt}x`}
                    </div>
                );
            },
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
            render: (user_id, data) => {
                return (
                    <div className="d-flex">
                        {COUNTRIES_OPTIONS.find(country => country?.value === data?.country)?.label || '-'}
                    </div>
                );
            },
        },
        {
            title: 'IP',
            dataIndex: 'ip',
            key: 'ip',
            render: (user_id, data) => {
                return (
                    <div className="d-flex">
                        {data?.ip}
                    </div>
                );
            },
        },
        {
            title: 'Domain',
            dataIndex: 'domain',
            key: 'domain',
            render: (user_id, data) => {
                return (
                    <div className="d-flex">
                        {data?.domain}
                    </div>
                );
            },
        },
        {
            title: 'Device',
            dataIndex: 'device',
            key: 'device',
            render: (user_id, data) => {
                return (
                    <div className="d-flex">
                        {data?.device}
                    </div>
                );
            },
        }
    ];

    const fieldKeyValue = {
        status:{
            type: 'dropdown',
            label: 'Result',
            options: [
                { label: 'None', value: -1 },
                { label: 'Successful', value: true },
                { label: 'Failed', value: false },
            ],
        },
        user_id: { type: 'string', label: 'User ID' },
        ip: { type: 'string', label: 'IP' },
        country: { 
			type: 'dropdown',
			label: 'Country',
			options: COUNTRIES_OPTIONS 
		},
    };
    
    const defaultFilters = [
        { 
            field: 'status',  
            type: 'dropdown',
            label: 'Result',
            value: null,
            options: [
                { label: 'None', value: -1 },
                { label: 'Successful', value: true },
                { label: 'Failed', value: false },
            ],
        }
    ];


	useEffect(() => {
		setIsLoading(true);
		requestSessions(queryFilters.page, queryFilters.limit);
        // eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

    useEffect(() => {
        requestSessions(queryFilters.page, queryFilters.limit);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryValues])

	const requestDownload = () => {
		return requestUserLoginsDownload({ ...queryValues, format: 'csv' });
	};


    const requestSessions = (page = 1, limit = 50 ) => {
        setIsLoading(true);
		requestUserLogins({ page, limit, ...queryValues })
			.then((response) => {
                setUserData(
                    page === 1
                    ? response.data
                    : [...userData, ...response.data]);

				setQueryFilters({
                    total: response.count,
					fetched: true,
					page,
					currentTablePage: page === 1 ? 1 : queryFilters.currentTablePage,
					isRemaining: response.count > page * limit,
                })

                setIsLoading(false);
			})
			.catch((error) => {
				// const message = error.message;
                setIsLoading(false);
			});
	};


    const pageChange = (count, pageSize) => {
		const { page, limit, isRemaining } = queryFilters;
		const pageCount = count % 5 === 0 ? 5 : count % 5;
		const apiPageTemp = Math.floor(count / 5);
		if (limit === pageSize * pageCount && apiPageTemp >= page && isRemaining) {
			requestSessions(page + 1, limit);
		}
        setQueryFilters({...queryFilters, currentTablePage: count  })
	};

	
	return (
		<div>
			<div style={{ color: '#ccc' }}>Below are details of currently active user sessions. Revoking a session will log the user out from their account.</div>
            <div>
			    <div style={{ marginTop: 20 }}>
                    <SessionFilters
                        applyFilters={(filters) => {
                            setQueryValues(filters);
                        }}
                        fieldKeyValue={fieldKeyValue}
                        defaultFilters={defaultFilters}
                    />
			    
			    </div>
			    <div className="mt-5">
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                        <span
			    	    	onClick={(e) => { requestDownload(); }}
			    	    	className="mb-2 underline-text cursor-pointer"
                            style={{ cursor:'pointer' }}
			    	    >
			    	    	Download below CSV table
			    	    </span>
                        <div>
                            <span>
                                <Button
						                onClick={() => { requestSessions(queryFilters.page, queryFilters.limit); }}
						                style={{
						                	backgroundColor: '#288500',
						                	color: 'white',
						                	flex: 1,
						                	height: 35,
                                            marginRight:10
						                }}
						                type="default"
						            >
						                Refresh
					            </Button>
                            </span>
                            <span>Total: {queryFilters.total || '-'}</span>
                        </div>
                    </div>
			    	
			    	<div className="mt-4 ">
			    		<Spin spinning={isLoading}>
			    			<Table 
                                className="blue-admin-table"
                                columns={columns} 
                                dataSource={userData}
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

		    </div>
		</div>		
	);
};


export default LoginTable;

