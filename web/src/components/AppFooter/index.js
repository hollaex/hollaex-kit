import React from 'react';
import classnames from 'classnames';
import ReactSvg from 'react-svg'
import { isMobile } from 'react-device-detect';
import { SOCIAL_ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import { HOLLAEX_LOGO } from '../../config/constants';

// const LINKS = [
//     {
//         icon: SOCIAL_ICONS.FACEBOOK,
//         link: 'https://facebook.com/bitholla',
//         type: 'facebook'
//     },
//     {
//         icon: SOCIAL_ICONS.TWITTER,
//         link: 'https://twitter.com/bitholla',
//         type: 'twitter'
//     },
// ];

const generateSectionsText = (strings, theme) => {
    const { SECTIONS } = strings.FOOTER;
    return [
        {
            TITLE: SECTIONS.SECTION_4_TITLE,
            LINKS: [
                { text: SECTIONS.SECTION_4_LINK_1, link: 'https://hollaex.com/login' },
                { text: SECTIONS.SECTION_4_LINK_2, link: 'https://hollaex.com/signup' }
            ]
        },
        {
            TITLE: SECTIONS.SECTION_1_TITLE,
            LINKS: [
                {
                    text: SECTIONS.SECTION_1_LINK_4,
                    link: 'https://info.hollaex.com/hc/en-us/articles/360039155994-Contact-Us'
                },
                {
                    text: SECTIONS.SECTION_1_LINK_2,
                    link: 'https://info.hollaex.com/hc/en-us/articles/360038833974-Terms-of-Service'
                },
            ]
        },
        {
            TITLE: SECTIONS.SECTION_3_TITLE,
            LINKS: [
                {
                    text: SECTIONS.SECTION_3_LINK_6,
                    link: 'https://apidocs.hollaex.com'
                },
                {
                    text: SECTIONS.SECTION_3_LINK_7,
                    link: 'https://www.npmjs.com/package/hollaex-node-lib'
                },
                {
                    text: SECTIONS.SECTION_3_LINK_8,
                    link: 'https://status.hollaex.com'
                },
            ]
        },
        {
            TITLE: SECTIONS.SECTION_5_TITLE,
            LINKS: [
                {
                    text: SECTIONS.SECTION_5_LINK_1,
                    link: 'https://hollaex.com/docs/whitepaper.html'
                },
                {
                    text: SECTIONS.SECTION_5_LINK_2,
                    link: 'http://bitholla.com/hex'
                },
                {
                    text: SECTIONS.SECTION_5_LINK_3,
                    link: 'https://github.com/bitholla/hollaex-kit'
                },
            ]
        },
        {
            TITLE: SECTIONS.SECTION_6_TITLE,
            LINKS: [
                {
                    text: SECTIONS.SECTION_6_LINK_1,
                    icon: SOCIAL_ICONS.TWITTER_DARK,
                    link: ' https://twitter.com/hollaex'
                },
                {
                    text: SECTIONS.SECTION_6_LINK_2,
                    icon: SOCIAL_ICONS.TELEGRAM_BLUE,
                    link: 'https://t.me/hollaex'
                },
            ]
        },


    ];
};

const AppFooter = ({
    className,
    theme
}) => {
    return (
        <div
            className={classnames(
                'app_footer-container',
                'd-flex',
                'flex-column',
                className
            )}
        >
            <div
                className={classnames(
                    'd-flex',
                    'justify-content-around',
                    'footer-row-content'
                )}
            >
                <div
                    className={classnames(
                        'd-flex',
                        'justify-content-center',
                        'align-items-start',
                        'footer-links-section'
                    )}
                >
                    <div className={classnames('d-flex', 'flex-1', {'flex-column': isMobile } )}>
                        {generateSectionsText(STRINGS, theme).map(({ TITLE, LINKS }, index) => (
                            <div
                                key={index}
                                className={classnames(
                                    'd-flex',
                                    'flex-column',
                                    'footer-links-group'
                                )}
                            >
                                <div className="footer-links-section--title">{TITLE}</div>
                                <div
                                    className={classnames(
                                        'd-flex',
                                        'flex-column',
                                        'footer-links-section--list'
                                    )}
                                >
                                    {LINKS.map(({ link, text, icon }, indexLink) => (
                                        <div key={indexLink} className="link-section d-flex">
                                            <a
                                                href={link || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <div className={classnames(
                                                    'd-flex',
                                                    'f-1',
                                                    'flex-row')}>
                                                    <div>
                                                        {icon ?
                                                            <img
                                                                src={icon}
                                                                className="social_icon"
                                                                alt="social_icons"
                                                            /> : null
                                                        }
                                                    </div>
                                                    <span>
                                                        {text}
                                                    </span>
                                                </div>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div className="footer_separter" >
                            <div className="footer-content">
                                <div>
                                    <ReactSvg path={HOLLAEX_LOGO} wrapperClassName="footer-logo" />
                                </div>
                                <div className="footer-txt">
                                    {STRINGS.formatString(STRINGS.FOOTER.XHT_DESCRIPTION,
                                        <a
                                            href={'https://hollaex.com/docs/wave-auction.pdf'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="blue-link pointer"
                                        > {STRINGS.FOOTER.CLICK_HERE} </a>,
                                        <a
                                            href={'https://bitholla.com/hollaex-kit/'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="blue-link pointer">
                                            {STRINGS.FOOTER.VISIT_HERE}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={classnames(
                    'footer-row-bottom',
                )}
            >
                <div className="d-flex my-2" />
                <div>{STRINGS.FOOTER.FOOTER_COPYRIGHT}</div>
            </div>
        </div>
    );
};

AppFooter.defaultProps = {
    className: '',
    onChangeLanguage: () => () => { },
    activeLanguage: ''
};

export default AppFooter;
