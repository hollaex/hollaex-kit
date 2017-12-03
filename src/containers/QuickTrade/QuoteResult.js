import React from 'react';
import { Loader, IconTitle, Button } from '../../components';

import STRINGS from '../../config/localizedStrings';
import { CURRENCIES, ICONS } from '../../config/constants';

const QuoteResult = ({ name, onClose, ...props }) => {
  const { fetching, completed, error, data } = props.data;

  if (fetching) {
    return <Loader relative={true} background={false} />;
  } else if (error) {
    return <div>{error}</div>;
  } else {
    return (
      <div>
        <IconTitle
          iconPath={ICONS.SQUARE_DOTS}
          text={STRINGS.QUOTE_SUCCESS_REVIEW_TITLE}
          underline={true}
          className="w-100"
        />
        <div className="quote-success-review-text">
          {STRINGS.formatString(
            STRINGS.QUOTE_SUCCESS_REVIEW_MESSAGE,
            STRINGS.SIDES_VALUES[data.side],
            data.size,
            name,
            data.price,
            STRINGS.FIAT_NAME,
          )}
        </div>
        {onClose &&
          <Button
            label={STRINGS.CLOSE_TEXT}
            onClick={onClose}
          />
        }
      </div>
    );
  }
}

export default QuoteResult;
