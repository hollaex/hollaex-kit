import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import isEqual from 'lodash.isequal';
import debounce from 'lodash.debounce';
import classnames from 'classnames';
import merge from 'lodash.merge';
import { EditFilled } from '@ant-design/icons';
import { getStringByKey, getAllStrings } from 'utils/string';
import Modal from 'components/Dialog/DesktopDialog';
import { Input, Button, Divider, Tabs, message } from 'antd';
import { DeleteOutlined, SettingFilled, KeyOutlined } from '@ant-design/icons';
import { initializeStrings, getValidLanguages } from 'utils/initialize';
import { publish, updateInjectedHTML } from 'actions/operatorActions';
import LANGUAGES from 'config/languages';
import { content as CONTENT } from 'config/localizedStrings';
import AllStringsModal from './components/AllStringsModal';
import StringSettingsModal from './components/StringSettings';
import AddLanguageModal from './components/AddLanguageModal';
import ThemeSettings from './components/ThemeSettings';
import AddTheme from './components/AddTheme';
import AllIconsModal from './components/AllIconsModal';
import UploadIcon from './components/UploadIcon';
import SectionsModal from './components/Sections';
import AddSection from './components/AddSection';
import withConfig from 'components/ConfigProvider/withConfig';
import { setLanguage } from 'actions/appActions';
import {
	pushTempContent,
	getTempLanguageKey,
	filterOverwrites,
} from 'utils/string';
import { filterThemes } from 'utils/color';
import { getIconByKey, getAllIconsArray } from 'utils/icon';
import withEdit from 'components/EditProvider/withEdit';

const { TabPane } = Tabs;
const { TextArea } = Input;
const TAB_KEYS = ['head', 'body'];

class OperatorControls extends Component {
	constructor(props) {
		super(props);

		const { themeOptions, injected_html = { head: '', body: '' } } = this.props;

		const strings = localStorage.getItem('strings') || '{}';
		const icons = localStorage.getItem('icons') || '{}';
		const color = localStorage.getItem('color') || '{}';
		const overwrites = JSON.parse(strings);
		const iconsOverwrites = JSON.parse(icons);
		const colorOverwrites = JSON.parse(color);
		const languageKeys = getValidLanguages();
		const languageOptions = LANGUAGES.filter(({ value }) =>
			languageKeys.includes(value)
		);
		const selectedLanguages = this.getSelectedLanguages(languageKeys);
		const selectedThemes = this.getSelectedThemes(themeOptions);

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
			iconSearchResults: [],
			iconSearchValue: '',
			source: false,
			isStringsSettingsOpen: false,
			isAddLanguageModalOpen: false,
			isExitConfirmationOpen: false,
			isExitConsoleConfirmationOpen: false,
			isPublishConfirmationOpen: false,
			isUploadIconOpen: false,
			isThemeSettingsOpen: false,
			isAddThemeOpen: false,
			isSectionsModalOpen: false,
			isAddSectionOpen: false,
			selectedTheme: '',
			iconsOverwrites,
			colorOverwrites,
			editableIconIds: [],
			isAllIconsModalOpen: false,
			selectedThemes,
			allIconsArray: [],
			injected_html,
		};
	}

	componentDidMount() {
		const {
			initialData: {
				query: { stringSettings = false, themeSettings = false } = {},
			} = {},
		} = this.props;
		this.setupAdminListeners();

		if (stringSettings) {
			this.toggleEditMode();
			this.openStringSettingsModal();
		} else if (themeSettings) {
			this.toggleEditMode();
			this.openThemeSettings();
		}
	}

	componentWillUnmount() {
		this.removeAdminListeners();
	}

	UNSAFE_componentWillUpdate(_, nextState) {
		const { languageKeys } = this.state;
		if (
			JSON.stringify(languageKeys) !== JSON.stringify(nextState.languageKeys)
		) {
			const languageOptions = LANGUAGES.filter(({ value }) =>
				nextState.languageKeys.includes(value)
			);
			const selectedLanguages = this.getSelectedLanguages(
				nextState.languageKeys
			);
			this.setState({
				languageOptions,
				selectedLanguages,
			});
		}
	}

	getSelectedLanguages = (languageKeys) => {
		const isENAvailable = !!languageKeys.find((lang) => lang === 'en');
		const languageCount = languageKeys.length;
		const hasMultipleLanguages = languageCount > 1;
		let selectedLanguages = [];

		if (isENAvailable && hasMultipleLanguages) {
			selectedLanguages[0] = 'en';
			selectedLanguages[1] = languageKeys.filter((lang) => lang !== 'en')[
				languageCount - 2
			];
		} else if (hasMultipleLanguages) {
			selectedLanguages[0] = languageKeys[0];
			selectedLanguages[1] = languageKeys[languageCount - 1];
		} else {
			selectedLanguages = new Array(2).fill(languageKeys[0]);
		}

		return selectedLanguages;
	};

	getSelectedThemes = (themeOptions) => {
		const themeKeys = themeOptions.map(({ value }) => value);
		const isDarkAvailable = !!themeKeys.find((theme) => theme === 'dark');
		const themeCount = themeKeys.length;
		const hasMultipleThemes = themeCount > 1;
		let selectedThemes = [];

		if (isDarkAvailable && hasMultipleThemes) {
			selectedThemes[0] = 'dark';
			selectedThemes[1] = themeKeys.filter((theme) => theme !== 'dark')[
				themeCount - 2
			];
		} else if (hasMultipleThemes) {
			selectedThemes[0] = themeKeys[0];
			selectedThemes[1] = themeKeys[themeCount - 1];
		} else {
			selectedThemes = new Array(2).fill(themeKeys[0]);
		}

		return selectedThemes;
	};

	setupAdminListeners = () => {
		const hasEditPermission = this.getEditPermission();
		if (hasEditPermission) {
			window.addEventListener('click', this.handleEditButton);
		}
	};

	removeAdminListeners = () => {
		const hasEditPermission = this.getEditPermission();
		if (hasEditPermission) {
			window.removeEventListener('click', this.handleEditButton);
		}
	};

	getEditPermission = () => {
		return true;
	};

	handleEditButton = ({ target: { dataset = {} } }, source) => {
		const { isEditModalOpen, isUploadIconOpen } = this.state;
		const { isEditMode } = this.props;
		const { stringId, iconId, sectionId } = dataset;

		if (isEditMode && !isEditModalOpen && !isUploadIconOpen) {
			const string_ids_array = stringId ? stringId.split(',') : [];
			const icon_ids_array = iconId ? iconId.split(',') : [];

			this.setState(
				{
					editableElementIds: string_ids_array,
					editableIconIds: icon_ids_array,
				},
				() => {
					if (stringId) {
						if (source) {
							this.closeAllStringsModal();
							this.openEditModal(source);
						} else {
							this.openEditModal();
						}
					} else if (iconId) {
						this.openUploadIcon();
					} else if (sectionId) {
						this.openSectionsModal();
					}
				}
			);
		}
	};

	openEditModal = (source = false) => {
		const { editableElementIds, languageKeys } = this.state;
		const editData = {};

		if (editableElementIds.length > 0) {
			languageKeys.forEach((lang) => {
				editData[lang] = {};
				editableElementIds.forEach((key) => {
					editData[lang][key] = getStringByKey(key, lang);
				});
			});

			this.setState({
				source,
				editData,
				isEditModalOpen: true,
			});
		}
	};

	closeEditModal = () => {
		const { source } = this.state;
		this.setState(
			{
				editableElementIds: [],
				editData: {},
				isEditModalOpen: false,
				isSaveEnabled: false,
			},
			() => {
				if (source) {
					this.openAllStringsModal();
				}
			}
		);
	};

	handleInputChange = ({ target: { value, name } }) => {
		const [key, lang] = name.split('-');
		this.updateEditData(value, key, lang);
	};

	updateEditData = (value, key, lang) => {
		const { editData } = this.state;
		this.setState((prevState) => ({
			...prevState,
			isSaveEnabled: true,
			editData: {
				...prevState.editData,
				[lang]: {
					...editData[lang],
					[key]: value,
				},
			},
		}));
	};

	handleSave = () => {
		const { editData, overwrites, languageKeys, source } = this.state;
		const processedData = { ...editData };

		const saveData = {};
		languageKeys.forEach((lang) => {
			saveData[lang] = {
				...overwrites[lang],
				...processedData[lang],
			};
		});

		languageKeys.forEach((lang) => {
			Object.entries(saveData[lang]).forEach(([key, string]) => {
				const isEnglish = lang === 'en';
				const isUnchangedString = string === getStringByKey(key, lang, CONTENT);
				const isEqualToDefault = string === getStringByKey(key, 'en', CONTENT);
				const hasInvalidPlaceholders =
					string && !this.validateString(string, key);
				const hasDeletedEnglish = !string && isEnglish;
				if (
					isUnchangedString ||
					isEqualToDefault ||
					hasInvalidPlaceholders ||
					hasDeletedEnglish
				) {
					delete saveData[lang][key];
				}
			});
		});

		this.setState(
			{
				overwrites: saveData,
				isEditModalOpen: false,
				isSaveEnabled: false,
				editData: {},
				editableElementIds: [],
			},
			() => {
				initializeStrings(saveData);
				this.forceRender();
				this.enablePublish();
				if (source) {
					this.openAllStringsModal();
				}
			}
		);
	};

	countPlaceholders = (string = '') => {
		const matches = string.match(/{(.*?)}/);
		return matches ? matches.length : 0;
	};

	validateString = (string, key) => {
		const benchmarkLanguage = 'en';
		const benchmarkPlaceholders = this.countPlaceholders(
			getStringByKey(key, benchmarkLanguage, CONTENT)
		);
		const placeholders = this.countPlaceholders(string);

		return placeholders === benchmarkPlaceholders;
	};

	handlePublish = () => {
		const { isEditMode, isInjectMode } = this.props;

		if (isEditMode) {
			const {
				overwrites,
				iconsOverwrites: icons,
				colorOverwrites,
				languageKeys,
			} = this.state;

			const { defaults, sections } = this.props;

			const valid_languages = languageKeys.join();
			const strings = filterOverwrites(overwrites);
			const color = filterThemes(colorOverwrites);

			const configs = {
				defaults,
				color,
				strings,
				icons,
				valid_languages,
				sections,
			};

			publish(configs)
				.then(this.reload)
				.catch((err) => {
					const error = err && err.data ? err.data.message : err.message;
					message.error(error);
				});
		} else if (isInjectMode) {
			const { injected_html } = this.state;
			updateInjectedHTML(injected_html)
				.then(this.reload)
				.catch((err) => {
					const error = err && err.data ? err.data.message : err.message;
					message.error(error);
				});
		}
	};

	reload = () => window.location.reload(false);

	enablePublish = (isPublishEnabled = true) => {
		this.setState({
			isPublishEnabled,
		});
	};

	toggleEditMode = () => {
		const { handleEditMode, isEditMode, isInjectMode } = this.props;
		if (!isInjectMode) {
			if (!isEditMode) {
				handleEditMode();
			} else {
				this.openExitConfirmationModal();
			}
		}
	};

	toggleInjectMode = () => {
		const { handleInjectMode, isEditMode, isInjectMode } = this.props;
		const { injected_html } = this.state;
		if (!isEditMode) {
			if (!isInjectMode || isEqual(injected_html, this.props.injected_html)) {
				handleInjectMode();
			} else {
				this.openExitConsoleConfirmationModal();
			}
		}
	};

	exitEditMode = () => {
		const { isPublishEnabled } = this.state;
		const { handleEditMode } = this.props;
		handleEditMode();
		this.closeExitConfirmationModal();

		if (isPublishEnabled) {
			this.reload();
		}
	};

	exitInjectMode = () => {
		const { handleInjectMode, injected_html } = this.props;
		this.setState({ injected_html }, () => {
			handleInjectMode();
			this.closeExitConsoleConfirmationModal();
		});
	};

	getLanguageLabel = (key) => {
		const { label } = LANGUAGES.find(({ value }) => value === key);
		return label;
	};

	getDefaultString = (key, lang) => {
		const defaultString = getStringByKey(key, lang, CONTENT);
		this.updateEditData(defaultString, key, lang);
	};

	openAllStringsModal = () => {
		const { languageKeys } = this.state;
		const allStrings = getAllStrings(languageKeys);

		this.setState(
			{
				allStrings,
				isAllStringsModalOpen: true,
			},
			this._doSearch
		);
	};

	openAllIconsModal = () => {
		const { themeOptions, allIcons } = this.props;
		const themeKeys = themeOptions.map(({ value }) => value);
		const allIconsArray = getAllIconsArray(themeKeys, allIcons);

		this.setState(
			{
				allIconsArray,
				isAllIconsModalOpen: true,
			},
			this._doIconSearch
		);
	};

	closeAllIconsModal = () => {
		this.setState({
			isAllIconsModalOpen: false,
		});
	};

	closeAllStringsModal = () => {
		this.setState({
			isAllStringsModalOpen: false,
		});
	};

	openStringSettingsModal = () => {
		this.closeAllStringsModal();
		this.setState({
			isStringsSettingsOpen: true,
		});
	};

	closeStringSettingsModal = (source) => {
		this.setState(
			{
				isStringsSettingsOpen: false,
			},
			() => {
				if (source) {
					this.openAllStringsModal();
				}
			}
		);
	};

	openAddLanguageModal = () => {
		this.closeStringSettingsModal();
		this.setState({
			isAddLanguageModalOpen: true,
		});
	};

	closeAddLanguageModal = () => {
		this.setState(
			{
				isAddLanguageModalOpen: false,
			},
			() => {
				this.openStringSettingsModal();
			}
		);
	};

	doSearch = debounce(() => this._doSearch(), 300);

	_doSearch = () => {
		const { searchValue, allStrings, selectedLanguages } = this.state;
		const [l1, l2] = selectedLanguages;
		const searchTerm = searchValue.toLowerCase().trim();
		const searchResults = [];
		allStrings.forEach((stringObject) => {
			if (
				stringObject[l1] &&
				stringObject[l1].toLowerCase().includes(searchTerm)
			) {
				searchResults.push(stringObject);
			} else if (
				stringObject[l2] &&
				stringObject[l2].toLowerCase().includes(searchTerm)
			) {
				searchResults.push(stringObject);
			} else if (stringObject.key.toLowerCase().includes(searchTerm)) {
				searchResults.push(stringObject);
			}
		});

		this.setState({ searchResults });
	};

	handleSearch = ({ target: { value: searchValue } }) => {
		this.setState({ searchValue }, () => {
			this.doSearch();
		});
	};

	doIconSearch = debounce(() => this._doIconSearch(), 300);

	_doIconSearch = () => {
		const { iconSearchValue, allIconsArray } = this.state;

		const searchTerm = iconSearchValue.toLowerCase().trim();
		const iconSearchResults = [];

		allIconsArray.forEach((iconObject = {}) => {
			if (iconObject.key.toLowerCase().includes(searchTerm)) {
				iconSearchResults.push(iconObject);
			}
		});

		this.setState({ iconSearchResults });
	};

	handleIconSearch = ({ target: { value: iconSearchValue } }) => {
		this.setState({ iconSearchValue }, () => {
			this.doIconSearch();
		});
	};

	setSelectedLanguages = (value, index) => {
		this.setState((prevState) => {
			let selection = prevState.selectedLanguages;
			selection[index] = value;

			return {
				...prevState,
				selectedLanguages: selection,
			};
		});
	};

	setSelectedThemes = (value, index) => {
		this.setState((prevState) => {
			let selection = prevState.selectedThemes;
			selection[index] = value;

			return {
				...prevState,
				selectedThemes: selection,
			};
		});
	};

	addLanguage = (key) => {
		const { languageKeys: prevLanguageKeys } = this.state;
		const languageKeys = [...prevLanguageKeys, key];

		this.setState(
			{
				languageKeys,
			},
			() => {
				this.closeAddLanguageModal();
			}
		);
	};

	confirmStringSettings = (keys = [], language) => {
		const { updateDefaults } = this.props;
		this.setState(
			(prevState) => ({
				...prevState,
				languageKeys: prevState.languageKeys.filter(
					(key) => !keys.includes(key)
				),
			}),
			() => {
				updateDefaults({ language });
				this.closeStringSettingsModal(true);
				this.enablePublish();
			}
		);
	};

	openExitConfirmationModal = () => {
		this.setState({ isExitConfirmationOpen: true });
	};

	closeExitConfirmationModal = () => {
		this.setState({ isExitConfirmationOpen: false });
	};

	openExitConsoleConfirmationModal = () => {
		this.setState({ isExitConsoleConfirmationOpen: true });
	};

	closeExitConsoleConfirmationModal = () => {
		this.setState({ isExitConsoleConfirmationOpen: false });
	};

	openPublishConfirmationModal = () => {
		this.setState({ isPublishConfirmationOpen: true });
	};

	closePublishConfirmationModal = () => {
		this.setState({ isPublishConfirmationOpen: false });
	};

	addIcons = (icons = {}, updateSearchResults = false) => {
		const { updateIcons } = this.props;
		this.setState(
			(prevState) => ({
				iconsOverwrites: merge({}, prevState.iconsOverwrites, icons),
			}),
			() => {
				updateIcons(icons);
				this.forceRender();
				this.closeUploadIcon();
				this.enablePublish();
				// FIXME
				if (updateSearchResults) {
					setTimeout(() => this.openAllIconsModal(), 2500);
				}
			}
		);
	};

	forceRender = () => {
		const { activeLanguage, changeLanguage } = this.props;
		pushTempContent(activeLanguage);
		changeLanguage(getTempLanguageKey(activeLanguage));
		setTimeout(() => changeLanguage(activeLanguage), 300);
	};

	openUploadIcon = () => {
		const { allIcons } = this.props;
		const { editableIconIds } = this.state;
		const iconsEditData = {};

		if (editableIconIds.length > 0) {
			Object.keys(allIcons).forEach((theme) => {
				iconsEditData[theme] = {};
				editableIconIds.forEach((key) => {
					iconsEditData[theme][key] = getIconByKey(key, theme, allIcons);
				});
			});

			this.setState({
				iconsEditData,
				isUploadIconOpen: true,
			});
		}
	};

	closeUploadIcon = () => {
		this.setState({
			editableIconIds: [],
			isUploadIconOpen: false,
		});
	};

	removeIcon = (key) => {
		const { removeIcon } = this.props;
		const { iconsOverwrites } = this.state;
		const { [key]: iconKey, ...restIcons } = iconsOverwrites;
		this.setState(
			{
				iconsOverwrites: restIcons,
			},
			() => {
				removeIcon(key);
			}
		);
	};

	openThemeSettings = () => {
		this.setState({
			isThemeSettingsOpen: true,
		});
	};

	closeThemeSettings = () => {
		this.setState({
			isThemeSettingsOpen: false,
		});
	};

	addTheme = (themeKey, theme) => {
		const { updateColor } = this.props;
		this.setState(
			(prevState) => ({
				...prevState,
				colorOverwrites: {
					...prevState.colorOverwrites,
					[themeKey]: theme,
				},
			}),
			() => {
				const { colorOverwrites } = this.state;
				updateColor(colorOverwrites);
				this.enablePublish();
				this.closeAddTheme();
			}
		);
	};

	confirmThemeSettings = (keys = [], theme) => {
		const { colorOverwrites: prevColorOverwrites } = this.state;
		const { removeTheme, updateDefaults } = this.props;
		const colorOverwrites = {};

		Object.entries(prevColorOverwrites).forEach(([themeKey, theme]) => {
			if (!keys.includes(themeKey)) {
				colorOverwrites[themeKey] = theme;
			}
		});

		this.setState(
			{
				colorOverwrites,
			},
			() => {
				removeTheme(keys);
				updateDefaults({ theme });
				this.closeThemeSettings();
				this.enablePublish();
			}
		);
	};

	openAddTheme = (selectedTheme = '') => {
		this.closeThemeSettings();
		this.setState({
			isAddThemeOpen: true,
			selectedTheme,
		});
	};

	closeAddTheme = () => {
		this.setState(
			{
				isAddThemeOpen: false,
			},
			this.openThemeSettings
		);
	};

	updateSectionsOrder = (sections) => {
		const { updateSections } = this.props;
		updateSections(sections);
		this.enablePublish();
		this.closeSectionsModal();
	};

	updateSections = (sections) => {
		const { updateSections } = this.props;
		updateSections(sections);
		this.enablePublish();
		this.closeAddSectionModal();
	};

	openSectionsModal = () => {
		this.setState({
			isSectionsModalOpen: true,
		});
	};

	closeSectionsModal = () => {
		this.setState({
			isSectionsModalOpen: false,
		});
	};

	openAddSectionModal = () => {
		this.setState({
			isAddSectionOpen: true,
		});
	};

	closeAddSectionModal = () => {
		this.setState(
			{
				isAddSectionOpen: false,
			},
			this.openSectionsModal
		);
	};

	handleTextAreaChange = ({ target: { name, value } }) => {
		this.setState((prevState) => ({
			...prevState,
			injected_html: {
				...prevState.injected_html,
				[name]: value,
			},
		}));
	};

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
			isExitConsoleConfirmationOpen,
			isAddLanguageModalOpen,
			isPublishConfirmationOpen,
			iconsEditData,
			isUploadIconOpen,
			editableIconIds,
			isThemeSettingsOpen,
			isAddThemeOpen,
			selectedTheme,
			isAllIconsModalOpen,
			selectedThemes,
			iconSearchValue,
			iconSearchResults,
			isSectionsModalOpen,
			isAddSectionOpen,
			injected_html,
		} = this.state;
		const {
			isEditMode,
			color: themes,
			themeOptions,
			sections,
			isInjectMode,
		} = this.props;

		return (
			<div
				className={classnames('operator-controls__wrapper', {
					open: isEditMode || isInjectMode,
				})}
			>
				<div className="operator-controls__buttons-wrapper">
					<div
						className={classnames('operator-controls__button', {
							disabled: isInjectMode,
						})}
						onClick={this.toggleEditMode}
					>
						<EditFilled />
						<span className="pl-1">
							{`${isEditMode ? 'Exit' : 'Enter'} edit mode`}
						</span>
					</div>
					<div
						className={classnames('operator-controls__button', {
							disabled: isEditMode || isInjectMode,
						})}
					>
						{!isEditMode && !isInjectMode ? (
							<Link to="/admin">
								<SettingFilled />
								<span className="pl-1">Operator controls</span>
							</Link>
						) : (
							<div>
								<SettingFilled />
								<span className="pl-1">Operator controls</span>
							</div>
						)}
					</div>
					<div
						className={classnames('operator-controls__button', {
							disabled: isEditMode,
						})}
						onClick={this.toggleInjectMode}
					>
						<span>{`</>`}</span>
						<span className="pl-1">Console</span>
					</div>
				</div>
				<div
					className={classnames('operator-controls__panel', {
						deep: isInjectMode,
					})}
				>
					{isEditMode && !isInjectMode && (
						<Fragment>
							<div className="operator-controls__panel-list">
								<div
									className="operator-controls__panel-item"
									onClick={this.openAllStringsModal}
								>
									All strings
								</div>
								<div
									className="operator-controls__panel-item"
									onClick={this.openThemeSettings}
								>
									Themes
								</div>
								<div
									className="operator-controls__panel-item"
									onClick={this.openAllIconsModal}
								>
									All graphics
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
						</Fragment>
					)}
					{isInjectMode && !isEditMode && (
						<div className="w-100 h-100">
							<div className="d-flex justify-content-end">
								<div className="d-flex align-items-center">
									<Button
										type="primary"
										onClick={this.openPublishConfirmationModal}
										className="operator-controls__publish-button small bold"
										disabled={isEqual(injected_html, this.props.injected_html)}
										style={{ zIndex: 1 }}
									>
										Publish
									</Button>
								</div>
							</div>
							<Tabs className="w-100 h-100">
								{TAB_KEYS.map((key) => {
									const title = `${'<'}${key.toUpperCase()}${'>'}`;
									const placeholder = `${'<'}!-- In this section you can insert any HTML code to the ${title} of your website --${'>'}`;
									return (
										<TabPane className="w-100 h-100" tab={title} key={key}>
											<div className="w-100 h-100">
												<TextArea
													name={key}
													placeholder={placeholder}
													onChange={this.handleTextAreaChange}
													value={injected_html[key]}
													style={{ resize: 'none' }}
													className="w-100 h-100"
												/>
											</div>
										</TabPane>
									);
								})}
							</Tabs>
						</div>
					)}
				</div>

				<Modal
					isOpen={isEditMode && isEditModalOpen}
					label="operator-controls-modal"
					className="operator-controls__modal"
					disableTheme={true}
					onCloseDialog={this.closeEditModal}
					shouldCloseOnOverlayClick={true}
					showCloseText={true}
					bodyOpenClassName="operator-controls__modal-open"
				>
					<div className="operator-controls__modal-title pb-3">Edit string</div>
					{isEditMode &&
						isEditModalOpen &&
						editableElementIds.map((key) => {
							return (
								<div className="pb-3" key={key}>
									<Divider orientation="left">
										<span className="operator-controls__string-key">
											<KeyOutlined /> {key}
										</span>
									</Divider>
									{languageKeys.map((lang) => {
										return (
											<div className="p-1" key={lang}>
												<label>{this.getLanguageLabel(lang)}:</label>
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
										);
									})}
								</div>
							);
						})}
					<div
						className="underline-text pointer pl-2 pt-4"
						onClick={() => {
							this.closeEditModal();
							this.openAllStringsModal();
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
				{isAllIconsModalOpen && (
					<AllIconsModal
						isOpen={isEditMode && isAllIconsModalOpen}
						icons={iconSearchResults}
						onCloseDialog={this.closeAllIconsModal}
						onSearch={this.handleIconSearch}
						searchValue={iconSearchValue}
						themeOptions={themeOptions}
						onSelect={this.setSelectedThemes}
						selectedThemes={selectedThemes}
						onRowClick={this.handleEditButton}
						// onSettingsClick={this.openStringSettingsModal}
						onSave={this.addIcons}
					/>
				)}
				{isAllStringsModalOpen && (
					<AllStringsModal
						isOpen={isEditMode && isAllStringsModalOpen}
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
				)}
				<StringSettingsModal
					isOpen={isEditMode && isStringsSettingsOpen}
					onCloseDialog={this.closeStringSettingsModal}
					languages={languageOptions}
					onAddLanguageClick={this.openAddLanguageModal}
					onConfirm={this.confirmStringSettings}
					defaultLanguage={this.props.defaults.language}
				/>
				{isAddLanguageModalOpen && (
					<AddLanguageModal
						isOpen={isEditMode && isAddLanguageModalOpen}
						onCloseDialog={this.closeAddLanguageModal}
						languages={LANGUAGES.filter(
							({ value }) => !languageKeys.includes(value)
						)}
						onSave={this.addLanguage}
					/>
				)}
				{isUploadIconOpen && (
					<UploadIcon
						iconsEditData={iconsEditData}
						themeOptions={themeOptions}
						editId={editableIconIds}
						isOpen={isUploadIconOpen}
						onCloseDialog={this.closeUploadIcon}
						onSave={this.addIcons}
						onReset={this.removeIcon}
					/>
				)}
				{isThemeSettingsOpen && (
					<ThemeSettings
						isOpen={isEditMode && isThemeSettingsOpen}
						onCloseDialog={this.closeThemeSettings}
						themes={themeOptions}
						onAddThemeClick={this.openAddTheme}
						onConfirm={this.confirmThemeSettings}
						defaultTheme={this.props.defaults.theme}
					/>
				)}
				{isAddThemeOpen && (
					<AddTheme
						isOpen={isEditMode && isAddThemeOpen}
						onCloseDialog={this.closeAddTheme}
						selectedTheme={selectedTheme}
						themes={themes}
						onSave={this.addTheme}
					/>
				)}

				{isSectionsModalOpen && (
					<SectionsModal
						isOpen={isEditMode && isSectionsModalOpen}
						onCloseDialog={this.closeSectionsModal}
						sections={sections}
						onSave={this.updateSectionsOrder}
						onLinkClick={this.openAddSectionModal}
					/>
				)}

				{isAddSectionOpen && (
					<AddSection
						isOpen={isEditMode && isAddSectionOpen}
						onCloseDialog={this.closeAddSectionModal}
						sections={sections}
						onSave={this.updateSections}
					/>
				)}

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
					<div className="operator-controls__modal-title">Exit</div>
					<div className="pt-3" style={{ width: '292px' }}>
						You are about to exit edit mode with some unpublished changes on
						your exchange
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
					isOpen={isExitConsoleConfirmationOpen}
					label="operator-controls-modal"
					className="operator-controls__modal"
					disableTheme={true}
					onCloseDialog={this.closeExitConsoleConfirmationModal}
					shouldCloseOnOverlayClick={true}
					showCloseText={true}
					bodyOpenClassName="operator-controls__modal-open"
				>
					<div className="operator-controls__modal-title">Exit</div>
					<div className="pt-3" style={{ width: '292px' }}>
						You are about to close the console with some unpublished changes.
					</div>
					<footer className="d-flex justify-content-end pt-4">
						<Button
							block
							className="mr-1 bold"
							onClick={this.closeExitConsoleConfirmationModal}
						>
							Cancel
						</Button>
						<Button
							block
							className="ml-1 bold"
							type="primary"
							onClick={this.exitInjectMode}
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
					<div className="operator-controls__modal-title">Publish</div>
					<div className="pt-3" style={{ width: '292px' }}>
						Publishing will apply all changes to the live website. Are you sure
						you want to publish the changes?
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

const mapStateToProps = (state) => ({
	activeLanguage: state.app.language,
	injected_html: state.app.injected_html,
});

const mapDispatchToProps = (dispatch) => ({
	changeLanguage: bindActionCreators(setLanguage, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withEdit(withConfig(OperatorControls)));
