import React from 'react';
import classnames from 'classnames';
import Image from 'components/Image';
import { FLEX_CENTER_CLASSES } from '../../config/constants';
import withConfig from 'components/ConfigProvider/withConfig';

const ThemeSwitcher = ({ selected, options = [], toggle, icons: ICONS }) => {
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
                    <div className={classnames('selected', selected)}>
                        <div
                            className={'app-bar-account-content app-bar-account-moon-content'}
                        >
                            <Image
                                icon={ICONS["SUN_THEME"]}
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
                    <div className={classnames('selected', selected)}>
                        <div
                            className={'app-bar-account-content app-bar-account-moon-content'}
                        >
                            <Image
                                iconId="SUN_THEME,MOON_THEME"
                                icon={ICONS["MOON_THEME"]}
                                wrapperClassName="app-bar-account-moon-icon"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withConfig(ThemeSwitcher);