import React, { Component, Fragment } from 'react';
import Modal from 'components/Dialog/DesktopDialog';
import { bool, array, func, string } from 'prop-types';
import { Button, Table } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { DEFAULT_LANGUAGE } from 'config/constants';


class StringSettingsModal extends Component {

  columns = [
    {
      title: "Languages",
      dataIndex: "label",
      key: "value",
      render: (_, {value, label}) => <Fragment>{`${label} (${value})`}</Fragment>
    },
    {
      title: "Default Language",
      dataIndex: "value",
      key: "value",
      render: (_, { value }) => value === DEFAULT_LANGUAGE ? "Default" : "",
    },
    {
      title: "Action",
      dataIndex: "value",
      key: "value",
      render: (_, {value}) => (
        <Fragment>
          <Button
            type="primary"
            shape="circle"
            size="small"
            ghost
            icon={<CloseOutlined />}
          />
          <span
            className="ml-2"
          >
            Remove
          </span>
        </Fragment>
      ),
    }
  ]

  render() {
    const { isOpen, onCloseDialog, languages, onAddLanguageClick } = this.props;
    return (
      <Modal
        isOpen={isOpen}
        label="operator-controls-modal"
        className="operator-controls__modal"
        disableTheme={true}
        onCloseDialog={() => onCloseDialog(true)}
        shouldCloseOnOverlayClick={true}
        showCloseText={true}
        bodyOpenClassName="operator-controls__modal-open"
      >
        <Table
          columns={this.columns}
          dataSource={languages}
          size="small"
          sticky={true}
          pagination={{
            pageSize: 1000,
            hideOnSinglePage: true,
            showSizeChanger: false,
            showQuickJumper: false,
            showLessItems: false,
            showTotal: false,
          }}
          scroll={{ y: 240 }}
          onRow={({ key }) => {
            return {
              onClick: () => console.log('clicked', key)
            };
          }}
        />
        <Button
          onClick={onAddLanguageClick}
          className="operator-controls__all-strings-settings-button mx-4"
          type="primary"
          shape="round"
          size="small"
          ghost
        >
          Add language
        </Button>
      </Modal>
    );
  }
}

StringSettingsModal.propTypes = {
  isOpen: bool.isRequired,
  onCloseDialog: func.isRequired,
  languages: array.isRequired,
  onAddLanguageClick: func.isRequired,
}

export default StringSettingsModal;