import React from 'react';
import classnames from 'classnames';
import { isMobile } from 'react-device-detect';
import STRINGS from '../../config/localizedStrings';
import { PUBLIC_URL } from '../../config/constants';
import withConfig from 'components/ConfigProvider/withConfig';
import Image from 'components/Image';
import withEdit from 'components/EditProvider/withEdit';

const generateSectionsText = (strings, theme, links = {}, ICONS) => {
	const {
		api,
		contact,
		facebook,
		github,
		// helpdesk,
		information,
		instagram,
		linkedin,
		youtube,
		privacy,
		telegram,
		terms,
		twitter,
		website,
		whitepaper,
	} = links;

	let sectionsText = [
		{
			TITLE: strings['FOOTER.SECTIONS.SECTION_4_TITLE'],
			LINKS: [
				{
					text: strings['FOOTER.SECTIONS.SECTION_4_LINK_1'],
					link: `${PUBLIC_URL}/login`,
				},
				{
					text: strings['FOOTER.SECTIONS.SECTION_4_LINK_2'],
					link: `${PUBLIC_URL}/signup`,
				},
			],
		},
		(contact || terms || privacy || website) && {
			TITLE: strings['FOOTER.SECTIONS.SECTION_1_TITLE'],
			LINKS: [
				contact && {
					text: strings['FOOTER.SECTIONS.SECTION_1_LINK_4'],
					link: contact,
				},
				terms && {
					text: strings['FOOTER.SECTIONS.SECTION_1_LINK_2'],
					link: terms,
				},
				privacy && {
					text: strings['FOOTER.SECTIONS.SECTION_1_LINK_3'],
					link: privacy,
				},
				website && {
					text: strings['FOOTER.SECTIONS.SECTION_6_LINK_6'],
					link: website,
				},
			],
		},
		(github || api || information) && {
			TITLE: strings['FOOTER.SECTIONS.SECTION_3_TITLE'],
			LINKS: [
				github && {
					text: strings['FOOTER.SECTIONS.SECTION_5_LINK_3'],
					link: github,
				},
				api && {
					text: strings['FOOTER.SECTIONS.SECTION_3_LINK_6'],
					link: api,
				},
				information && {
					text: strings['FOOTER.SECTIONS.SECTION_6_LINK_8'],
					link: information,
				},
				// {
				// 	text: strings["FOOTER.SECTIONS.SECTION_3_LINK_7"],
				// 	link: 'https://www.npmjs.com/package/hollaex-node-lib'
				// },
				// {
				// 	text: strings["FOOTER.SECTIONS.SECTION_3_LINK_8"],
				// 	link: 'https://docs.bitholla.com'
				// }
			],
		},
		whitepaper && {
			TITLE: strings['FOOTER.SECTIONS.SECTION_5_TITLE'],
			LINKS: [
				whitepaper && {
					text: strings['FOOTER.SECTIONS.SECTION_5_LINK_1'],
					link: whitepaper,
				},
				// {
				// 	text: strings["FOOTER.SECTIONS.SECTION_5_LINK_2"],
				// 	link: 'http://bitholla.com/xht'
				// },
				// {
				// 	text: strings["FOOTER.SECTIONS.SECTION_3_LINK_2"],
				// 	link: 'https://forum.bitholla.com'
				// }
			],
		},
		(twitter || telegram || facebook || instagram || linkedin || youtube) && {
			TITLE: strings['FOOTER.SECTIONS.SECTION_6_TITLE'],
			LINKS: [
				twitter && {
					text: strings['FOOTER.SECTIONS.SECTION_6_LINK_1'],
					icon: ICONS['SOCIAL_TWITTER'],
					link: twitter,
				},
				telegram && {
					text: strings['FOOTER.SECTIONS.SECTION_6_LINK_2'],
					icon: ICONS['SOCIAL_TELEGRAM'],
					link: telegram,
				},
				facebook && {
					text: strings['FOOTER.SECTIONS.SECTION_6_LINK_3'],
					icon: ICONS['SOCIAL_FACEBOOK'],
					link: facebook,
				},
				instagram && {
					text: strings['FOOTER.SECTIONS.SECTION_6_LINK_4'],
					icon: ICONS['SOCIAL_INSTAGRAM'],
					link: instagram,
				},
				linkedin && {
					text: strings['FOOTER.SECTIONS.SECTION_6_LINK_5'],
					icon: ICONS['SOCIAL_LINKEDIN'],
					link: linkedin,
				},
				youtube && {
					text: strings['FOOTER.SECTIONS.SECTION_6_LINK_9'],
					icon: ICONS['SOCIAL_YOUTUBE'],
					link: youtube,
				},
			],
		},
	];

	sectionsText = sectionsText.filter((item) => !!item);
	return sectionsText.map(({ TITLE, LINKS }) => {
		let obj = {
			TITLE,
			LINKS: LINKS.filter((link) => {
				return !!link;
			}),
		};
		return obj;
	});
};

const AppFooter = ({
	className,
	theme,
	constants = { description: '' },
	icons: ICONS,
	isEditMode,
}) => {
	return (
		<div
			className={classnames(
				'app_footer-container',
				'd-flex',
				'flex-column',
				'apply_rtl',
				{ 'deep-footer': isEditMode },
				className
			)}
		>
			<div
				className={classnames(
					'd-flex',
					'justify-content-around',
					'footer-row-content',
					'mx-auto'
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
					<div
						className={classnames('d-flex', 'flex-1', {
							'flex-column': isMobile,
						})}
					>
						{generateSectionsText(STRINGS, theme, constants.links, ICONS).map(
							({ TITLE, LINKS }, index) => (
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
													<div
														className={classnames('d-flex', 'f-1', 'flex-row')}
													>
														<div>
															{icon ? (
																<img
																	src={icon}
																	className="social_icon"
																	alt="social_icons"
																/>
															) : null}
														</div>
														<span>{text}</span>
													</div>
												</a>
											</div>
										))}
									</div>
								</div>
							)
						)}
						<div className="footer_separter">
							<div className="footer-content">
								<div className="d-flex">
									<Image
										iconId="EXCHANGE_LOGO"
										icon={ICONS['EXCHANGE_LOGO']}
										wrapperClassName="footer-logo"
									/>
								</div>
								<div className="footer-txt">
									{constants.description || ''}
									{/* {STRINGS.formatString(
										STRINGS["FOOTER.XHT_DESCRIPTION"],
										<a
											href={
												'https://info.hollaex.com/hc/en-us/articles/360040098633-What-is-the-Wave-Auction-'
											}
											target="_blank"
											rel="noopener noreferrer"
											className="blue-link pointer"
										>
											{' '}
											{STRINGS["FOOTER.CLICK_HERE"]}{' '}
										</a>,
										<a
											href={'https://bitholla.com/hollaex-kit/'}
											target="_blank"
											rel="noopener noreferrer"
											className="blue-link pointer"
										>
											{STRINGS["FOOTER.VISIT_HERE"]}
										</a>
									)} */}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className={classnames('footer-row-bottom')}>
				<div className="d-flex my-2" />
				<div>{STRINGS['FOOTER.FOOTER_COPYRIGHT']}</div>
			</div>
		</div>
	);
};

AppFooter.defaultProps = {
	className: '',
	onChangeLanguage: () => () => {},
	activeLanguage: '',
};

export default withEdit(withConfig(AppFooter));
