import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import classnames from 'classnames';
import { EditFilled } from '@ant-design/icons';
import { getStringByKey, getAllStrings } from 'utils/string';
import Modal from 'components/Dialog/DesktopDialog';
import { Input, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { initializeStrings, getValidLanguages } from 'utils/initialize';
import { publish } from 'actions/operatorActions';
import LANGUAGES from 'config/languages';
import { content as CONTENT } from 'config/localizedStrings';
import AllStringsModal from './components/AllStringsModal';
import StringSettingsModal from './components/StringSettings';
import AddLanguageModal from './components/AddLanguageModal';
import UploadIcon from './components/UploadIcon';
import withConfig from 'components/ConfigProvider/withConfig';

class OperatorControls extends Component {

  constructor(props) {
    super(props);

    const strings = localStorage.getItem('strings') || "{}";
    const icons = localStorage.getItem('icons') || "{}";
    const overwrites = JSON.parse(strings);
    const iconsOverwrites = JSON.parse(icons);
    const languageKeys = getValidLanguages();
    const languageOptions = LANGUAGES.filter(({ value }) => languageKeys.includes(value));
    const selectedLanguages = this.getSelectedLanguages(languageKeys);

    this.state = {
      isPublishEnabled: false,
      isSaveEnabled: false,
      isEditModalOpen: false,
      editType: null,
      isAllStringsModalOpen: false,
      editableElementIds: [],
      languageKeys,
      languageOptions,
      selectedLanguages,
      overwrites,
      allStrings: [],
      searchValue: '',
      searchResults: [],
      source: false,
      isStringsSettingsOpen: false,
      isAddLanguageModalOpen: false,
      isExitConfirmationOpen: false,
      isPublishConfirmationOpen: false,
      isUploadIconOpen: false,
      iconsOverwrites,
      editableIconIds: [],
    }
  }

  componentDidMount() {
    this.setupAdminListeners();
  }

  componentWillUnmount() {
    this.removeAdminListeners()
  }

  UNSAFE_componentWillUpdate(_, nextState) {
    const { languageKeys } = this.state;
    if (JSON.stringify(languageKeys) !== JSON.stringify(nextState.languageKeys)) {
      const languageOptions = LANGUAGES.filter(({ value }) => nextState.languageKeys.includes(value));
      const selectedLanguages = this.getSelectedLanguages(nextState.languageKeys);
      this.setState({
        languageOptions,
        selectedLanguages,
      })
    }
  }

  getSelectedLanguages = (languageKeys) => {
    const isENAvailable = !!languageKeys.find(lang => lang === "en");
    const languageCount = languageKeys.length;
    const hasMultipleLanguages = languageCount > 1;
    let selectedLanguages = [];

    if (isENAvailable && hasMultipleLanguages) {
      selectedLanguages[0] = 'en'
      selectedLanguages[1] = languageKeys.filter(lang => lang !== "en")[languageCount-2]
    } else if (hasMultipleLanguages) {
      selectedLanguages[0] = languageKeys[0];
      selectedLanguages[1] = languageKeys[languageCount-1];
    } else {
      selectedLanguages = new Array(2).fill(languageKeys[0])
    }

    return selectedLanguages;
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

  handleEditButton = ({ target: { dataset = {} } }, source) => {
    const { isEditModalOpen, isUploadIconOpen } = this.state;
    const { editMode } = this.props;
    const { stringId, iconId } = dataset;

    if(editMode && !isEditModalOpen && !isUploadIconOpen) {
      const string_ids_array = stringId ? stringId.split(',') : []
      const icon_ids_array = iconId ? iconId.split(',') : []

      this.setState({
        editableElementIds: string_ids_array,
        editableIconIds: icon_ids_array,
      }, () => {

        if (stringId) {
          if (source) {

            this.closeAllStringsModal();
            this.openEditModal(source);

          } else {
            this.openEditModal();
          }
        } else if (iconId) {
          this.openUploadIcon();
        }
      })
    }
  }

  openEditModal = (source = false) => {
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
        source,
        editData,
        isEditModalOpen: true,
      })
    }
  }

  closeEditModal = () => {
    const { source } = this.state;
    this.setState({
      editableElementIds: [],
      editData: {},
      isEditModalOpen: false,
      isSaveEnabled: false,
    }, () => {
      if (source) {
        this.openAllStringsModal();
      }
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
    const { editData, overwrites, languageKeys, source } = this.state;
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
        if (
          string === getStringByKey(key, lang, CONTENT) ||
          string === getStringByKey(key, 'en', CONTENT) ||
          !string || !this.validateString(key, lang)
        ) {
          delete saveData[lang][key];
        }
      })
    })

    this.setState({
      overwrites: saveData,
      isEditModalOpen: false,
      isSaveEnabled: false,
      editData: {},
      editableElementIds: [],
    }, () => {
      initializeStrings(saveData);
      this.enablePublish();
      if (source) {
        this.openAllStringsModal();
      }
    })
  }

  countPlaceholders = (string = '') => {
    const matches = string.match(/{(.*?)}/);
    return matches ? matches.length : 0;
  }

  validateString = (key, lang) => {
    const { editData } = this.state;
    const defaultPlaceholders = this.countPlaceholders(getStringByKey(key, lang, CONTENT));
    const placeholders = this.countPlaceholders(editData[lang][key]);

    return defaultPlaceholders === placeholders;
  }

  handlePublish = () => {
    const { overwrites: strings, iconsOverwrites: icons } = this.state;
    const configs = { strings, icons };

    publish(configs)
      .then(this.reload)
  }

  reload = () => window.location.reload(false)

  enablePublish = (isPublishEnabled = true) => {
    this.setState({
      isPublishEnabled,
    });
  }

  toggleEditMode = () => {
    const { onChangeEditMode, editMode } = this.props;
    if (!editMode) {
      onChangeEditMode();
    } else {
      this.openExitConfirmationModal()
    }
  }

  exitEditMode = () => {
    const { isPublishEnabled } = this.state;
    const { onChangeEditMode } = this.props;
    onChangeEditMode();
    this.closeExitConfirmationModal();

    if(isPublishEnabled) {
      this.reload();
    }
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
    const { languageKeys } = this.state;
    const allStrings = getAllStrings(languageKeys);

    this.setState({
      allStrings,
      isAllStringsModalOpen: true,
    }, this._doSearch);
  }

  closeAllStringsModal = () => {
    this.setState({
      isAllStringsModalOpen: false,
    });
  }

  openStringSettingsModal = () => {
    this.closeAllStringsModal();
    this.setState({
      isStringsSettingsOpen: true,
    });
  }

  closeStringSettingsModal = (source) => {
    this.setState({
      isStringsSettingsOpen: false,
    }, () => {
      if(source) {
        this.openAllStringsModal()
      }
    });
  }

  openAddLanguageModal = () => {
    this.closeStringSettingsModal();
    this.setState({
      isAddLanguageModalOpen: true,
    });
  }

  closeAddLanguageModal = () => {
    this.setState({
      isAddLanguageModalOpen: false,
    }, () => {
      this.openStringSettingsModal()
    });
  }
  
  doSearch = debounce(() => this._doSearch(), 300)

  _doSearch = () => {
    const { searchValue, allStrings, selectedLanguages } = this.state;
    const [l1, l2] = selectedLanguages;
    const searchTerm = searchValue.toLowerCase().trim();
    const searchResults = []
    allStrings.forEach((stringObject) => {
      if(stringObject[l1] && stringObject[l1].toLowerCase().includes(searchTerm)) {
        searchResults.push(stringObject)
      } else if (stringObject[l2] && stringObject[l2].toLowerCase().includes(searchTerm)) {
        searchResults.push(stringObject)
      } else if (stringObject.key.toLowerCase().includes(searchTerm)) {
        searchResults.push(stringObject)
      }
    })

    this.setState({ searchResults });
  }
  
  handleSearch = ({ target: { value: searchValue }}) => {
    this.setState({ searchValue }, () => {
      this.doSearch();
    })
  }

  setSelectedLanguages = (value, index) => {

    this.setState(prevState => {
      let selection = prevState.selectedLanguages;
      selection[index] = value;

      return ({
        ...prevState,
        selectedLanguages: selection,
      })
    });
  }

  addLanguage = (key) => {
    const { languageKeys: prevLanguageKeys } = this.state;
    const languageKeys = [...prevLanguageKeys, key];

    this.setState({
      languageKeys,
    }, () => {
      this.closeAddLanguageModal()
    })
  }

  removeLanguage = (keys = []) => {
    this.setState(prevState => ({
      ...prevState,
      languageKeys: prevState.languageKeys.filter((key) => !keys.includes(key))
    }), () => this.closeStringSettingsModal(true));
  }

  openExitConfirmationModal = () => {
    this.setState({ isExitConfirmationOpen: true });
  }

  closeExitConfirmationModal = () => {
    this.setState({ isExitConfirmationOpen: false });
  }

  openPublishConfirmationModal = () => {
    this.setState({ isPublishConfirmationOpen: true });
  }

  closePublishConfirmationModal = () => {
    this.setState({ isPublishConfirmationOpen: false });
  }

  addIcons = (icons = {}) => {
    const { updateIcons } = this.props;
    this.setState(prevState => ({
      iconsOverwrites: { ...prevState.iconsOverwrites, ...icons },
    }), () => {
      updateIcons(icons);
      this.closeUploadIcon();
      this.enablePublish();
    });
  }

  openUploadIcon = () => {
    const { editableIconIds } = this.state;

    if (editableIconIds.length > 0) {
      this.setState({
        isUploadIconOpen: true,
      });
    }
  }

  closeUploadIcon = () => {
    this.setState({
      editableIconIds: [],
      isUploadIconOpen: false,
    });
  }

  removeIcon = (key) => {
    const { removeIcon } = this.props;
    const { iconsOverwrites } = this.state;
    const { [key]: iconKey, ...restIcons } = iconsOverwrites;
    this.setState({
      iconsOverwrites: restIcons,
    }, () => {
      removeIcon(key);
    });
  }

  render() {
    const {
      isPublishEnabled,
      isEditModalOpen,
      editData,
      languageKeys,
      editableElementIds,
      isSaveEnabled,
      isAllStringsModalOpen,
      searchResults,
      searchValue,
      languageOptions,
      selectedLanguages,
      isStringsSettingsOpen,
      isExitConfirmationOpen,
      isAddLanguageModalOpen,
      isPublishConfirmationOpen,
      isUploadIconOpen,
      editableIconIds,
    } = this.state;
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
            <Button
              type="primary"
              onClick={this.openPublishConfirmationModal}
              className="operator-controls__publish-button bold"
              disabled={!isPublishEnabled}
            >
              Publish
            </Button>
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
          <div className="operator-controls__modal-title">
            Edit string
          </div>
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
                              className="operator-controls__input mr-2"
                              value={editData[lang][key]}
                              onChange={this.handleInputChange}
                            />
                            <Button
                              ghost
                              shape="circle"
                              size="small"
                              className="operator-controls__all-strings-settings-button"
                              onClick={() => this.getDefaultString(key, lang)}
                              icon={<DeleteOutlined />}
                            />
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              )
            })
          }
          <div
            className="underline pointer pl-2 pt-4"
            onClick={() => {
              this.closeEditModal()
              this.openAllStringsModal()
            }}
          >
            View all strings
          </div>
          <div className="pt-5">
            <Button
              block
              type="primary"
              size="large"
              disabled={!isSaveEnabled}
              onClick={this.handleSave}
              className="operator-controls__save-button"
            >
              Save
            </Button>
          </div>
        </Modal>
        <AllStringsModal
          isOpen={editMode && isAllStringsModalOpen}
          strings={searchResults}
          onCloseDialog={this.closeAllStringsModal}
          onSearch={this.handleSearch}
          searchValue={searchValue}
          languageOptions={languageOptions}
          onSelect={this.setSelectedLanguages}
          selectedLanguages={selectedLanguages}
          onRowClick={this.handleEditButton}
          onSettingsClick={this.openStringSettingsModal}
        />
        <StringSettingsModal
          isOpen={editMode && isStringsSettingsOpen}
          onCloseDialog={this.closeStringSettingsModal}
          languages={languageOptions}
          onAddLanguageClick={this.openAddLanguageModal}
          onConfirm={this.removeLanguage}
        />
        <AddLanguageModal
          isOpen={editMode && isAddLanguageModalOpen}
          onCloseDialog={this.closeAddLanguageModal}
          languages={LANGUAGES.filter(({ value }) => !languageKeys.includes(value))}
          onSave={this.addLanguage}
        />
        <UploadIcon
          editId={editableIconIds}
          isOpen={isUploadIconOpen}
          onCloseDialog={this.closeUploadIcon}
          onSave={this.addIcons}
          onReset={this.removeIcon}
        />
        <Modal
          isOpen={isExitConfirmationOpen}
          label="operator-controls-modal"
          className="operator-controls__modal"
          disableTheme={true}
          onCloseDialog={this.closeExitConfirmationModal}
          shouldCloseOnOverlayClick={true}
          showCloseText={true}
          bodyOpenClassName="operator-controls__modal-open"
        >
          <div className="operator-controls__modal-title">
            Exit
          </div>
          <div className="pt-3" style={{ width: '292px' }}>
            You are about to exit edit mode with some unpublished changes on your exchange
          </div>
          <footer className="d-flex justify-content-end pt-4">
            <Button
              block
              className="mr-1 bold"
              onClick={this.closeExitConfirmationModal}
            >
              Cancel
            </Button>
            <Button
              block
              className="ml-1 bold"
              type="primary"
              onClick={this.exitEditMode}
              danger
            >
              Exit
            </Button>
          </footer>
        </Modal>
        <Modal
          isOpen={isPublishConfirmationOpen}
          label="operator-controls-modal"
          className="operator-controls__modal"
          disableTheme={true}
          onCloseDialog={this.closePublishConfirmationModal}
          shouldCloseOnOverlayClick={true}
          showCloseText={true}
          bodyOpenClassName="operator-controls__modal-open"
        >
          <div className="operator-controls__modal-title">
            Publish
          </div>
          <div className="pt-3" style={{ width: '292px' }}>
            Publishing will apply all changes to the live website.
            Are you sure you want to publish the changes?
          </div>
          <footer className="d-flex justify-content-end pt-4">
            <Button
              className="mr-1 bold"
              block
              onClick={this.closePublishConfirmationModal}
            >
              Cancel
            </Button>
            <Button
              block
              className="ml-1 bold"
              type="primary"
              onClick={this.handlePublish}
              danger
            >
              Publish
            </Button>
          </footer>
        </Modal>
      </div>
    );
  }
}

export default withConfig(OperatorControls);