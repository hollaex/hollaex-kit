import React from 'react';
import classnames from 'classnames';

import { SOCIAL_ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

const LINKS = [
	{
		icon: SOCIAL_ICONS.FACEBOOK,
		link: 'https://facebook.com/bitholla',
		type: 'facebook'
	},
	{
		icon: SOCIAL_ICONS.TWIITER,
		link: 'https://twitter.com/bitholla',
		type: 'twitter'
	}
];

const generateSectionsText = (strings) => {
	const { SECTIONS } = strings.FOOTER;
	return [
		{
			TITLE: SECTIONS.SECTION_1_TITLE,
			LINKS: [
				{
					text: SECTIONS.SECTION_1_LINK_1,
					link: 'https://bitholla.com/about'
				},
				{
					text: SECTIONS.SECTION_1_LINK_2,
					link: 'https://bitholla.com/terms-of-use/'
				},
				{
					text: SECTIONS.SECTION_1_LINK_3,
					link: 'https://bitholla.com/privacy-policy/'
				}
			]
		},
		{
			TITLE: SECTIONS.SECTION_2_TITLE,
			LINKS: [
				{
					text: SECTIONS.SECTION_2_LINK_1,
					link: 'https://blog.bitholla.com'
				},
				{
					text: SECTIONS.SECTION_2_LINK_2,
					link: 'https://bitholla.com/contact'
				},
				{
					text: SECTIONS.SECTION_2_LINK_3,
					link: 'https://bitholla.com/career'
				},
				{
					text: SECTIONS.SECTION_3_LINK_2,
					link: 'https://forum.bitholla.com'
				},
			]
		},
		{
			TITLE: SECTIONS.SECTION_3_TITLE,
			LINKS: [
				{
					text: SECTIONS.SECTION_3_LINK_1,
					link: 'https://docs.bitholla.com'
				},
				{
					text: SECTIONS.SECTION_3_LINK_3,
					link: 'https://github.com/bitholla/hollaex-kit'
				},
				{
					text: SECTIONS.SECTION_3_LINK_5,
					link: 'https://apidocs.hollaex.com'
				},
				{
					text: SECTIONS.SECTION_3_LINK_4,
					link: 'https://www.npmjs.com/package/hollaex-node-lib'
				},
			]
		},
		{
			TITLE: SECTIONS.SECTION_4_TITLE,
			LINKS: [
				{ text: SECTIONS.SECTION_4_LINK_1, link: '' },
				{ text: SECTIONS.SECTION_4_LINK_2, link: '' },
				{ text: SECTIONS.SECTION_4_LINK_3, link: '' },
				{ text: SECTIONS.SECTION_4_LINK_4, link: '' },
				{ text: SECTIONS.SECTION_4_LINK_5, link: '' },
				{ text: SECTIONS.SECTION_4_LINK_6, link: '' },
				{ text: SECTIONS.SECTION_4_LINK_7, link: '' }
			]
		}
	];
};

const Footer = ({
	title,
	status,
	className,
	onChangeLanguage,
	activeLanguage
}) => {
	return (
		<div
			className={classnames(
				'footer-container',
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
					{generateSectionsText(STRINGS).map(({ TITLE, LINKS }, index) => (
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
								{LINKS.map(({ link, text }, indexLink) => (
									<a
										href={link || '#'}
										key={indexLink}
										target="_blank"
										rel="noopener noreferrer"
									>
										{text}
									</a>
								))}
							</div>
						</div>
					))}
				</div>

				<div
					className={classnames(
						'd-flex',
						'justify-content-center',
						'footer-public-section',
						'flex-column'
					)}
				>
					<div className="footer-public-texts">
						{STRINGS.FOOTER.FOOTER_LEGAL.map((text, index) => (
							<div key={index} className="footer-public-texts-text">
								{text}
							</div>
						))}
					</div>
					<div className="footer-public-links d-flex">
						{LINKS.map(({ icon, link, type }, index) => (
							<a href={link || '#'} key={index}>
								<img
									src={icon}
									alt={type}
									className="footer-public-links-icon"
								/>
							</a>
						))}
					</div>
				</div>
			</div>
			<div
				className={classnames(
					'd-flex',
					'justify-content-between',
					'footer-row-bottom',
					'f-1',
					'direction_ltr'
				)}
			>
				<div className="d-flex" />
				<div>{STRINGS.FOOTER.FOOTER_COPYRIGHT}</div>
			</div>
		</div>
	);
};

Footer.defaultProps = {
	className: '',
	onChangeLanguage: () => () => {},
	activeLanguage: ''
};

export default Footer;
