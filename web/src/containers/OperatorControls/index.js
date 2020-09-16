import React, { Component } from 'react';
import classnames from 'classnames';
import { EditFilled } from '@ant-design/icons';
import { getStringByKey } from 'utils/string';
import Modal from 'components/Dialog/DesktopDialog';
import { Input } from 'antd';
import { initializeStrings } from 'utils/initialize';

class OperatorControls extends Component {

  constructor(props) {
    super(props);

    const strings = localStorage.getItem('strings') || "{}";
    const overwrites = JSON.parse(strings);

    this.state = {
      isPublishEnabled: false,
      isSaveEnabled: false,
      isEditModalOpen: false,
      editType: null,
      editableElementIds: [],
      languageKeys: ['en', 'fa'],
      overwrites,
    }
  }

  componentDidMount() {
    this.setupAdminListeners();
  }

  componentWillUnmount() {
    this.removeAdminListeners()
  }


  setupAdminListeners = () => {
    const hasEditPermission = this.getEditPermission();
    if (hasEditPermission) {
      window.addEventListener('click', this.handleEditButton);
    }
  }

  removeAdminListeners = () => {
    const hasEditPermission = this.getEditPermission();
    if (hasEditPermission) {
      window.removeEventListener('click', this.handleEditButton);
    }
  }

  getEditPermission = () => {
    return true
  }

  handleEditButton = ({ target: { dataset = {} } }) => {
    const { isEditModalOpen } = this.state;
    const { editMode } = this.props;
    const { stringId } = dataset;

    if(editMode && !isEditModalOpen) {
      const string_ids_array = stringId ? stringId.split(',') : []
      this.setState({
        editableElementIds: string_ids_array,
      }, this.openEditModal)
    }
  }

  openEditModal = () => {
    const { editableElementIds, languageKeys } = this.state;
    const editData = {};

    if(editableElementIds.length > 0) {
      languageKeys.forEach(lang => {
        editData[lang] = {}
        editableElementIds.forEach(key => {
          editData[lang][key] = getStringByKey(key, lang)
        })
      })

      this.setState({
        editData,
        isEditModalOpen: true,
      })
    }
  }

  closeEditModal = () => {
    this.setState({
      editableElementIds: [],
      editData: {},
      isEditModalOpen: false,
      isSaveEnabled: false,
    });
  }

  handleInputChange = ({ target: { value, name } }) => {
    const { editData } = this.state;
    const [key, lang] = name.split('-')

    this.setState(prevState => ({
      ...prevState,
      isSaveEnabled: true,
      editData: {
        ...prevState.editData,
        [lang]: {
          ...editData[lang],
          [key]: value
        }
      }
    }));
  }

  handleSave = () => {
    const { editData, overwrites, languageKeys } = this.state;
    const processedData = { ...editData }

    languageKeys.forEach((lang) => {
      Object.entries(processedData[lang]).forEach(([key, string]) => {
        if (string === getStringByKey(key, lang)) {
          delete processedData[lang][key];
        }
      })
    })

    const saveData = {};
    languageKeys.forEach((lang) => {
      saveData[lang] = {
        ...overwrites[lang],
        ...processedData[lang],
      }
    })

    this.setState({
      overwrites: saveData,
      isPublishEnabled: true,
      isEditModalOpen: false,
      isSaveEnabled: false,
      editData: {},
      editableElementIds: [],
    })
  }

  handlePublish = () => {
    const { overwrites } = this.state;
    localStorage.setItem('strings', JSON.stringify(overwrites))
    initializeStrings();
    this.setState({
      isPublishEnabled: false,
    })
  }

  toggleEditMode = () => {
    const { onChangeEditMode } = this.props;
    onChangeEditMode();
  }

  render() {
    const { isPublishEnabled, isEditModalOpen, editData, languageKeys, editableElementIds, isSaveEnabled } = this.state;
    const { editMode } = this.props;

    return (
      <div
        className={classnames("operator-controls__wrapper", { open: editMode })}
      >
        <div
          className="operator-controls__button"
          onClick={this.toggleEditMode}
        >
          <EditFilled />
          <span className="pl-1">
            {`${ editMode ? 'Exit' : 'Enter' } edit mode`}
          </span>
        </div>
        <div className="operator-controls__panel">
          <div />
          <div className="d-flex align-items-center">
            <button
              type="submit"
              onClick={this.handlePublish}
              className="operator-controls__publish-button"
              disabled={!isPublishEnabled}
            >
              Publish
            </button>
          </div>
        </div>
        <Modal
          isOpen={editMode && isEditModalOpen}
          label="operator-controls-modal"
          className="operator-controls__modal"
          disableTheme={true}
          onCloseDialog={this.closeEditModal}
          shouldCloseOnOverlayClick={true}
          showCloseText={true}
        >
          {
            editMode && isEditModalOpen &&
            editableElementIds.map((key) => {
              return (
                <div>
                  {
                    languageKeys.map((lang) => {

                      return (
                        <Input
                          type="text"
                          name={`${key}-${lang}`}
                          placeholder="text"
                          className="operator-controls__input"
                          value={editData[lang][key]}
                          onChange={this.handleInputChange}
                        />
                      )
                    })
                  }
                </div>
              )
            })
          }
          <div className="d-flex align-items-center">
            <button
              type="submit"
              onClick={this.handleSave}
              className="operator-controls__save-button"
              disabled={!isSaveEnabled}
            >
              Save
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default OperatorControls;