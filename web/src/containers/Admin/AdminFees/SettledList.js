import React, { Component } from 'react';
import { Table, Button, Spin } from 'antd';

import { getFees, settleFees } from './action';
import { ModalForm } from '../../../components';
import renderFields from '../../../components/AdminForm/utils';
import { validateRequired } from '../../../components/AdminForm/validations';
import { formatTimestampGregorian } from '../../../utils/date';

const Form = ModalForm('SETTLE_FORM', '');

const Fields = {
    user_id: {
        type: 'number',
        label: 'User id to settle fees:',
        placeholder: 'User ID',
        validate: [validateRequired],
        fullWidth: true
    }
};

const SettleForm = ({ fields = {}, lastUpdated = {} }) => {
    return (
        <div>
            <div className='mb-2'>
                <div>You are about to settle all the fees made on the exchange to the user Id specified in the box below.</div>
                <div>Your last settlement was done on {formatTimestampGregorian(lastUpdated.timestamp)}</div>
            </div>
            {renderFields(fields)}
        </div>
    );
};

class SettledList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            page: 1,
            pageSize: 10,
            limit: 50,
            currentTablePage: 1,
            isRemaining: true,
            isFormOpen: false
        }
    }

    componentDidMount() {
        this.requestFees();
    }

    requestFees = (page = 1, limit = 50) => {
        this.setState({
            loading: true,
            error: ''
        });
        return getFees(page, limit)
            .then((response) => {
                console.log('response', response);
                this.setState({
                    // list: page === 1
                    //     ? response.data
                    //     : [...this.state.list, ...response.data],
                    loading: false,
                    page,
                    currentTablePage: page === 1 ? 1 : this.state.currentTablePage,
                    isRemaining: response.count > page * limit
                });
            })
            .catch((error) => {
                const message = error.data ? error.data.message : error.message;
                this.setState({
                    loading: false,
                    error: message
                });
            });
    };

    handleSettleNow = () => {
        this.setState({ isFormOpen: !this.state.isFormOpen })
    };

    pageChange = (count, pageSize) => {
        const { page, limit, isRemaining } = this.state;
        const pageCount = count % 5 === 0 ? 5 : count % 5;
        const apiPageTemp = Math.floor(count / 5);
        if (limit === pageSize * pageCount && apiPageTemp >= page && isRemaining) {
            this.requestFees(
                page + 1,
                limit
            );
        }
        this.setState({ currentTablePage: count });
    };

    onSubmit = (formProps) => {
        console.log('formProps', formProps);
        let values = {
            ...formProps,
            user_id: parseInt(formProps.user_id)
        }
        return settleFees(values)
            .then((response) => {
                console.log('response', response);
                this.handleSettleNow();
            })
            .catch((error) => {
                const message = error.data ? error.data.message : error.message;
                this.setState({
                    error: message
                });
                this.handleSettleNow();
            })
    };

    render() {
        const { currentTablePage, list, loading, isFormOpen } = this.state;
        return (
            <div>
                <Button
                    onClick={this.handleSettleNow}
                    className="w-100 my-3"
                    type="primary"
                >
                    Settle Now
                </Button>
                {loading ? (
                    <Spin size="large" />
                ) : (
                        <Table
                            columns={[]}
                            dataSource={list}
                            rowKey={(data) => {
                                return data.id;
                            }}
                            pagination={{
                                current: currentTablePage,
                                onChange: this.pageChange
                            }}
                        />)
                }
                <Form
					visible={isFormOpen}
					title={'Settle Now'}
                    okText="Save"
                    fields={Fields}
                    CustomRenderContent={SettleForm}
                    lastUpdated={list[0] ? list[0] : {}}
					onSubmit={this.onSubmit}
					onCancel={this.handleSettleNow}
				/>
            </div>
        )
    }
}

export default SettledList;
