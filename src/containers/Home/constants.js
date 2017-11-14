import { ICONS, FLEX_CENTER_CLASSES } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

const {
  SECTION_1_TITLE,
  SECTION_1_TEXT_1,
  SECTION_1_TEXT_2,
  SECTION_1_BUTTON_1,
  SECTION_3_TITLE,
  SECTION_3_CARD_1_TITLE,
  SECTION_3_CARD_1_TEXT,
  SECTION_3_CARD_2_TITLE,
  SECTION_3_CARD_2_TEXT,
  SECTION_3_CARD_3_TITLE,
  SECTION_3_CARD_3_TEXT,
  SECTION_3_CARD_4_TITLE,
  SECTION_3_CARD_4_TEXT,
  SECTION_3_CARD_5_TITLE,
  SECTION_3_CARD_5_TEXT,
  SECTION_3_CARD_6_TITLE,
  SECTION_3_CARD_6_TEXT,
  SECTION_3_BUTTON_1,
} = STRINGS.HOME;
const { REGISTER_TEXT } = STRINGS;

export const TEXTS = {
  SECTION_1: {
    TITLE: SECTION_1_TITLE,
    TEXT_1: SECTION_1_TEXT_1,
    TEXT_2: SECTION_1_TEXT_2,
    BUTTON_1: SECTION_1_BUTTON_1,
    BUTTON_2: REGISTER_TEXT,
  },
  SECTION_3 : {
    TITLE: SECTION_3_TITLE,
    CARDS: [
      {
        icon: ICONS.CHECK,
        title: SECTION_3_CARD_1_TITLE,
        text: SECTION_3_CARD_1_TEXT,
      },
      {
        icon: ICONS.CHECK,
        title: SECTION_3_CARD_2_TITLE,
        text: SECTION_3_CARD_2_TEXT,
      },
      {
        icon: ICONS.CHECK,
        title: SECTION_3_CARD_3_TITLE,
        text: SECTION_3_CARD_3_TEXT,
      },
      {
        icon: ICONS.CHECK,
        title: SECTION_3_CARD_4_TITLE,
        text: SECTION_3_CARD_4_TEXT,
      },
      {
        icon: ICONS.CHECK,
        title: SECTION_3_CARD_5_TITLE,
        text: SECTION_3_CARD_5_TEXT,
      },
      {
        icon: ICONS.CHECK,
        title: SECTION_3_CARD_6_TITLE,
        text: SECTION_3_CARD_6_TEXT,
      },
    ],
    BUTTON_1: SECTION_3_BUTTON_1,
    BUTTON_2: REGISTER_TEXT,
  }
}

export const BUTTONS_CLASSES = ['buttons-section--button', ...FLEX_CENTER_CLASSES];
