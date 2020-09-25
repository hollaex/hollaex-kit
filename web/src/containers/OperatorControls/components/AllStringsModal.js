import React, { Component } from 'react';
import Modal from 'components/Dialog/DesktopDialog';
import { bool, array, func, string } from 'prop-types';
import { Input, Select, Button, Table } from 'antd';

const { Search } = Input;
const { Option } = Select;

class AllStringsModal extends Component {

  getColumns = () => {
    const { languageOptions, selectedLanguages, onSelect } = this.props;
    return selectedLanguages.map((lang, index) => ({
      title: () => (
        <Select
          value={lang}
          bordered={false}
          size="default"
          onSelect={(value) => onSelect(value, index)}
        >
          {
            languageOptions.map(({ label, value }) => (
              <Option value={value} key={value}>
                {label}
              </Option>
            ))
          }
        </Select>
      ),
      dataIndex: lang,
      key: lang,
      ellipsis: true,
    }))
  }

  handleRowClick = (key) => {
    const { onRowClick } = this.props;
    const clickEvent = { target: { dataset: { stringId: key } } }
    onRowClick(clickEvent, true)
  }

  render() {
    const {
      isOpen,
      strings,
      onCloseDialog,
      onSearch,
      searchValue,
    } = this.props;

    return (
      <Modal
        isOpen={isOpen}
        label="operator-controls-modal"
        className="operator-controls__modal"
        disableTheme={true}
        onCloseDialog={onCloseDialog}
        shouldCloseOnOverlayClick={true}
        showCloseText={true}
        bodyOpenClassName="operator-controls__modal-open"
      >
        {
          isOpen &&
          (<div>
            <div className="operator-controls__all-strings-header">
              <Search
                style={{ width: '25%' }}
                defaultValue={searchValue}
                onChange={onSearch}
                enterButton={false}
                bordered={false}
              />
              <Button
                className="operator-controls__all-strings-settings-button mx-4"
                type="primary"
                shape="round"
                size="small"
                ghost
              >
                Settings
              </Button>
            </div>
            <Table
              columns={this.getColumns()}
              dataSource={strings}
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
                  onClick: () => this.handleRowClick(key)
                };
              }}
            />
          </div>)
        }
        <div className="d-flex align-items-center pt-5">
          <button
            type="submit"
            // onClick={this.handleSave}
            className="operator-controls__save-button"
            // disabled={!isSaveEnabled}
          >
            Confirm
          </button>
        </div>
      </Modal>
    );
  }
}

AllStringsModal.propTypes = {
  isOpen: bool.isRequired,
  strings: array.isRequired,
  onCloseDialog: func.isRequired,
  selectedLanguages: array.isRequired,
  onSearch: func.isRequired,
  searchValue: string,
}

export default AllStringsModal;