import { SOCIAL_ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

const {
  FOOTER_LEGAL,
  FOOTER_COPYRIGHT,
  FOOTER_LANGUAGE_TEXT,
  FOOTER_LANGUAGE_LANGUAGES,
  SECTIONS,
} = STRINGS.FOOTER;

export const TEXTS = {
  SECTIONS: [
    {
      TITLE: SECTIONS.SECTION_1_TITLE,
      LINKS: [
        { text: SECTIONS.SECTION_1_LINK_1, link: '' },
        { text: SECTIONS.SECTION_1_LINK_2, link: '' },
        { text: SECTIONS.SECTION_1_LINK_3, link: '' },
        { text: SECTIONS.SECTION_1_LINK_4, link: '' },
        { text: SECTIONS.SECTION_1_LINK_5, link: '' },
      ]
    },
    {
      TITLE: SECTIONS.SECTION_2_TITLE,
      LINKS: [
        { text: SECTIONS.SECTION_2_LINK_1, link: '' },
        { text: SECTIONS.SECTION_2_LINK_2, link: '' },
        { text: SECTIONS.SECTION_2_LINK_3, link: '' },
        { text: SECTIONS.SECTION_2_LINK_4, link: '' },
        { text: SECTIONS.SECTION_2_LINK_5, link: '' },
      ]
    },
    {
      TITLE: SECTIONS.SECTION_3_TITLE,
      LINKS: [
        { text: SECTIONS.SECTION_3_LINK_1, link: '' },
        { text: SECTIONS.SECTION_3_LINK_2, link: '' },
        { text: SECTIONS.SECTION_3_LINK_3, link: '' },
        { text: SECTIONS.SECTION_3_LINK_4, link: '' },
        { text: SECTIONS.SECTION_3_LINK_5, link: '' },
        { text: SECTIONS.SECTION_3_LINK_6, link: '' },
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
        { text: SECTIONS.SECTION_4_LINK_7, link: '' },
      ]
    },
  ],
  PUBLIC: {
    TEXTS: FOOTER_LEGAL,
    LINKS: [
      { icon: SOCIAL_ICONS.FACEBOOK, link: '', type: 'facebook' },
      { icon: SOCIAL_ICONS.TWIITER, link: '', type: 'twitter' },
      { icon: SOCIAL_ICONS.LINKEDIN, link: '', type: 'linkedin' },
    ]
  },
  LANGUAGE: {
    TEXT: FOOTER_LANGUAGE_TEXT,
    LANGUAGES: FOOTER_LANGUAGE_LANGUAGES,
  },
  COPYRIGHT: FOOTER_COPYRIGHT,
}
