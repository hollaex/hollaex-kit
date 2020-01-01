import React from 'react';
import classnames from 'classnames';
import ReactSVG from 'react-svg';
import { FLEX_CENTER_CLASSES } from '../../config/constants';
import { ICONS } from '../../config/constants';

const ThemeSwitcher = ({ selected, options = [], toggle }) => {
    return (
        <div>
            <div className={classnames('toggle_button-wrapper', 'd-flex')}>
                <div
                    className={classnames(
                        'toggle-content',
                        'f-0',
                        ...FLEX_CENTER_CLASSES,
                        'direction_ltr'
                    )}
                >
                    <div className={classnames({ selected: options[0].value === 'white' })}>
                        <div
                            className={'app-bar-account-content app-bar-account-moon-content'}
                        >
                            <ReactSVG
                                path={ICONS.SUN_THEME}
                                wrapperClassName="app-bar-account-moon-icon"
                            />
                        </div>
                    </div>
                    <div
                        onClick={toggle}
                        className={classnames('toggle-action_button', {
                            left: options[0].value === selected,
                            right: options[1].value === selected
                        })}
                    >
                        <div className="toggle-action_button-display" />
                    </div>
                    <div className={classnames({ selected: options[1].value === 'dark' })}>
                        <div
                            className={'app-bar-account-content app-bar-account-moon-content'}
                        >
                            <ReactSVG
                                path={ICONS.MOON_THEME}
                                wrapperClassName="app-bar-account-moon-icon"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ThemeSwitcher;