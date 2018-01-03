import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import { setLanguage } from '../../actions/appActions';

const LanguageSelector = ({ activeLanguage, changeLanguage }) => (
	<div className="language_selector-wrapper d-flex justify-content-between">
		<div
			className={classnames('language_selector-flag flag-ir', {
				selected: activeLanguage === 'fa'
			})}
			onClick={() => changeLanguage('fa')}
		/>
		<div className="flag-separator" />
		<div
			className={classnames('language_selector-flag flag-en', {
				selected: activeLanguage === 'en'
			})}
			onClick={() => changeLanguage('en')}
		/>
	</div>
);

const mapStateToProps = (state) => ({
	activeLanguage: state.app.language
});

const mapDispatchToProps = (dispatch) => ({
	changeLanguage: bindActionCreators(setLanguage, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelector);
