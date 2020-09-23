import React, { Component } from 'react';
import classnames from 'classnames';
import { EditFilled } from '@ant-design/icons';
import { getStringByKey } from 'utils/string';
import Modal from 'components/Dialog/DesktopDialog';
import { Input } from 'antd';
import { initializeStrings, getValidLanguages } from 'utils/initialize';
import { publish } from 'actions/operatorActions';
import LANGUAGES from 'config/languages';
import { content as CONTENT } from 'config/localizedStrings';

class OperatorControls extends Component {

  constructor(props) {
    super(props);

    const strings = localStorage.getItem('strings') || "{}";
    const overwrites = JSON.parse(strings);
    const languageKeys = getValidLanguages();

    this.state = {
      isPublishEnabled: false,
      isSaveEnabled: false,
      isEditModalOpen: false,
      editType: null,
      isAllStringsModalOpen: false,
      editableElementIds: [],
      languageKeys,
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
    const [key, lang] = name.split('-');
    this.updateEditData(value, key, lang)
  }

  updateEditData = (value, key, lang) => {
    const { editData } = this.state;
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

    const saveData = {};
    languageKeys.forEach((lang) => {
      saveData[lang] = {
        ...overwrites[lang],
        ...processedData[lang],
      }
    })

    languageKeys.forEach((lang) => {
      Object.entries(saveData[lang]).forEach(([key, string]) => {
        if (string === getStringByKey(key, lang, CONTENT)) {
          delete saveData[lang][key];
        }
      })
    })

    this.setState({
      overwrites: saveData,
      isPublishEnabled: true,
      isEditModalOpen: false,
      isSaveEnabled: false,
      editData: {},
      editableElementIds: [],
    }, () => initializeStrings(saveData))
  }

  handlePublish = () => {
    const { overwrites: strings } = this.state;
    const configs = { strings };

    publish(configs)
      .then(this.reload)
  }

  reload = () => window.location.reload(false)

  toggleEditMode = () => {
    const { onChangeEditMode } = this.props;
    onChangeEditMode();
  }

  getLanguageLabel = (key) => {
    const { label } = LANGUAGES.find(({ value }) => value === key)
    return label
  }

  getDefaultString = (key, lang) => {
    const defaultString = getStringByKey(key, lang, CONTENT)
    this.updateEditData(defaultString, key, lang);
  }

  openAllStringsModal = () => {
    this.setState({
      isAllStringsModalOpen: true,
    });
  }

  closeAllStringsModal = () => {
    this.setState({
      isAllStringsModalOpen: false,
    });
  }

  render() {
    const { isPublishEnabled, isEditModalOpen, editData, languageKeys, editableElementIds, isSaveEnabled, isAllStringsModalOpen } = this.state;
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
          <div className="operator-controls__panel-list">
            <div
              className="operator-controls__panel-item"
              onClick={this.openAllStringsModal}
            >
              All strings
            </div>
          </div>
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
          bodyOpenClassName="operator-controls__modal-open"
        >
          {
            editMode && isEditModalOpen &&
            editableElementIds.map((key) => {
              return (
                <div className="pt-3" key={key}>
                  {
                    languageKeys.map((lang) => {

                      return (
                        <div className="p-1" key={lang}>
                          <label>
                            {this.getLanguageLabel(lang)}:
                          </label>
                          <div className="d-flex align-items-center">
                            <Input
                              type="text"
                              name={`${key}-${lang}`}
                              placeholder="text"
                              className="operator-controls__input"
                              value={editData[lang][key]}
                              onChange={this.handleInputChange}
                            />
                            <span
                              className="pointer"
                              onClick={() => this.getDefaultString(key, lang)}
                            >
                            Reset
                          </span>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              )
            })
          }
          <div className="d-flex align-items-center pt-5">
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
        <Modal
          isOpen={editMode && isAllStringsModalOpen}
          label="operator-controls-modal"
          className="operator-controls__modal"
          disableTheme={true}
          onCloseDialog={this.closeAllStringsModal}
          shouldCloseOnOverlayClick={true}
          showCloseText={true}
          bodyOpenClassName="operator-controls__modal-open"
        >
          {
            editMode && isAllStringsModalOpen &&
            'All Strings'
          }
          <div className="d-flex align-items-center pt-5">
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