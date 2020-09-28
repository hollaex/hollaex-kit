import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import classnames from 'classnames';
import { EditFilled } from '@ant-design/icons';
import { getStringByKey, getAllStrings } from 'utils/string';
import Modal from 'components/Dialog/DesktopDialog';
import { Input } from 'antd';
import { initializeStrings, getValidLanguages } from 'utils/initialize';
import { publish } from 'actions/operatorActions';
import LANGUAGES from 'config/languages';
import { content as CONTENT } from 'config/localizedStrings';
import AllStringsModal from './components/AllStringsModal';
import StringSettingsModal from './components/StringSettings';
import AddLanguageModal from './components/AddLanguageModal';

class OperatorControls extends Component {

  constructor(props) {
    super(props);

    const strings = localStorage.getItem('strings') || "{}";
    const overwrites = JSON.parse(strings);
    const languageKeys = getValidLanguages();
    const languageOptions = LANGUAGES.filter(({ value }) => languageKeys.includes(value));
    const isENAvailable = !!languageKeys.find(lang => lang === "en");
    const hasMultipleLanguages = languageKeys.length > 1;
    let selectedLanguages = [];

    if (isENAvailable && hasMultipleLanguages) {
      selectedLanguages[0] = 'en'
      selectedLanguages[1] = languageKeys.filter(lang => lang !== "en")[0]
    } else if (hasMultipleLanguages) {
      selectedLanguages = languageKeys.slice(0,2);
    } else {
      selectedLanguages = new Array(2).fill(languageKeys[0])
    }

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

  handleEditButton = ({ target: { dataset = {} } }, source) => {
    const { isEditModalOpen } = this.state;
    const { editMode } = this.props;
    const { stringId } = dataset;

    if(editMode && !isEditModalOpen) {
      const string_ids_array = stringId ? stringId.split(',') : []
      this.setState({
        editableElementIds: string_ids_array,
      }, () => {
        if (source) {
          this.closeAllStringsModal();
          this.openEditModal(source);
        } else {
        this.openEditModal();
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
      isPublishEnabled: true,
      isEditModalOpen: false,
      isSaveEnabled: false,
      editData: {},
      editableElementIds: [],
    }, () => {
      initializeStrings(saveData)
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
    const languageOptions = LANGUAGES.filter(({ value }) => languageKeys.includes(value))

    this.setState({
      languageKeys,
      languageOptions,
    }, () => {
      this.closeAddLanguageModal()
    })
  }

  removeLanguage = (keys = []) => {
    this.setState(prevState => ({
      ...prevState,
      languageKeys: prevState.languageKeys.filter((key) => !keys.includes(key))
    }));
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
      isAddLanguageModalOpen,
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
      </div>
    );
  }
}

export default OperatorControls;