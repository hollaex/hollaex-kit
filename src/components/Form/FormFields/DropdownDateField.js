import React, { Component } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import momentJ from 'moment-jalaali';
import EventListener from 'react-event-listener';
import { range } from 'lodash';
import FieldWrapper, { FieldContent } from './FieldWrapper';
import { TIMESTAMP_FORMAT, TIMESTAMP_FORMAT_FA } from '../../../config/constants';
import { ActionNotification } from '../../';
import DropdownDateOption from './DropdownDateOption';
import { ICONS } from '../../../config/constants';
import STRINGS from '../../../config/localizedStrings';

const FIELDS = [
  { key: 'year', label: 'Year' },
  { key: 'month', label: 'Month' },
  { key: 'day', label: 'Day' },
];
const LIMIT_YEARS = 100;
const DEFAULT_LANGUAGE = 'en';
const FARSI_LANGUAGE = 'fa';

const FORMATS = {
  en: {
    year: 'YYYY',
    month: 'MM',
    day: 'DD',
  },
  fa: {
    year: 'jYYYY',
    month: 'jMM',
    day: 'jDD'
  },
}

const generateDateLimits = (limit = LIMIT_YEARS) => {
  const nowMoment = momentJ();
  return {
    en: {
      maxYears: nowMoment.year(),
      minYears: nowMoment.year() - LIMIT_YEARS,
      year: range(nowMoment.year() - LIMIT_YEARS, nowMoment.year() + 1).reverse(),
    },
    fa: {
      maxYears: nowMoment.jYear(),
      minYears: nowMoment.jYear() - LIMIT_YEARS,
      year: range(nowMoment.jYear() - LIMIT_YEARS, nowMoment.jYear() + 1).reverse(),
    }
  }
}

class DropdownDateField extends Component {
  state = {
    language: DEFAULT_LANGUAGE,
    focused: false,
    display: {
      year: '',
      month: '',
      day: '',
    },
    date: moment(),
    unixtime: 0,
    limits: {},
  }

  componentWillMount() {
    const limits = generateDateLimits();
    this.setLimits(limits);
    this.setDisplay(limits, this.props.input.value, this.props.language)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.language !== this.props.language) {
      this.setDisplay(this.state.limits, nextProps.input.value, nextProps.language);
    }
  }

  setLimits = (limits) => {
    this.setState({ limits: limits || generateDateLimits() });
  }

  setDisplay = (limits, dateString = '', language = DEFAULT_LANGUAGE) => {
    const display = {};
    let dateUnixtime = moment(dateString || new Date()).valueOf();
    moment.locale(language)
    const date = momentJ(dateUnixtime);
    moment.locale(DEFAULT_LANGUAGE)
    display.en = {
      ...limits.en,
      month: moment.months(),
      day: range(1, date.daysInMonth() + 1),
    }

    momentJ.locale(FARSI_LANGUAGE)
    display.fa = {
      ...limits.fa,
      month: momentJ.months(),
      day: range(1, momentJ.jDaysInMonth(date.jYear(), date.jMonth()) + 1),
    }

    moment.locale(language)
    this.setState({ display, date, unixtime: date.valueOf(), language })
  }

  onChangeOption = (key) => (index, value) => {
    const { language, input } = this.props;
    const { unixtime, limits } = this.state;

    const date = momentJ(unixtime);
    if (key === 'year') {
      if (language === FARSI_LANGUAGE) {
        date.jYear(value)
      } else {
        date.year(value);
      }
    } else if (key === 'month') {
      if (language === FARSI_LANGUAGE) {
        date.jMonth(index)
      } else {
        date.month(index)
      }
    } else if (key === 'day') {
      if (language === FARSI_LANGUAGE) {
        date.jDate(value)
      } else {
        date.date(value)
      }
    }

    this.setDisplay(limits, date.format(), language);
    input.onChange(date.format());
  }

  renderFields = (date, options, valid = false, formats, languageProps, languageState) => {
    return (
      <div className="datefield-values-wrapper" >
        {FIELDS.map(({ key, format }, index) => {
          return (
            <DropdownDateOption
              date={date}
              format={formats[key]}
              valid={valid}
              id={key}
              key={key}
              options={options[key]}
              onChange={this.onChangeOption(key)}
            />
          )
        })}
        {languageProps === DEFAULT_LANGUAGE &&
          <div className={classnames('datefield-toogle', languageState)}>
            <ActionNotification
              text={languageState === DEFAULT_LANGUAGE ?
                STRINGS.DATEFIELD_TOOGLE_DATE_GR :
                STRINGS.DATEFIELD_TOOGLE_DATE_PE
              }
              status="information"
              iconPath={ICONS.COPY_NEW}
              className="no_bottom pr-0 pl-0"
              onClick={this.toogleLanguage}
            />
          </div>
        }
      </div>
    )
  }

  toogleLanguage = () => {
    if (this.state.language === DEFAULT_LANGUAGE) {
      this.setDisplay(this.state.limits, this.props.input.value, FARSI_LANGUAGE);
    } else {
      this.setDisplay(this.state.limits, this.props.input.value, this.props.language);
    }
  }

  render() {
    const { display, date, language } = this.state;
    const {
      input: {
        value,
      },
      meta: {
        invalid
      },
    } = this.props;
    const languageProps = this.props.language;
    return (
      <FieldWrapper
        {...this.props}
        valid={!invalid}
        hideUnderline={true}
        className="datefield-wrapper"
      >
        {display[language] &&
          this.renderFields(date, display[language], !invalid, FORMATS[language], languageProps, language)
        }
      </FieldWrapper>
    )
  }
}

export default DropdownDateField;
