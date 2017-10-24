import React from 'react';
import classnames from 'classnames';
import { ActionNotification } from '../';
import { ICONS } from '../../config/constants';

const TEXT_PREVIOUS_PAGE = 'previous page';
const TEXT_NEXT_PAGE = 'next page';

const renderPageCount = (currentPage, totalPages) => {
  if (totalPages > 0) {
    return <div>{currentPage} / {totalPages}</div>;
  }
}

const Paginator = ({ goToPreviousPage, goToNextPage, currentPage, count, pageSize }) => {
  const totalPages = Math.ceil(count / pageSize);
  const previousIsDisabled = currentPage <= 1;
  const nextIsDisabled = currentPage >= totalPages;
  return (
    <div className="table_controllers-wrapper d-flex justify-content-between align-items-center">
      <div
        onClick={!previousIsDisabled ? goToPreviousPage : undefined}
        className={classnames({ disabled: previousIsDisabled, pointer: !previousIsDisabled })}
      >
        <ActionNotification
          text={TEXT_PREVIOUS_PAGE}
          status="information"
          iconPath={ICONS.RED_ARROW}
          textPosition="left"
          iconPosition="left"
          reverseImage={true}
        />
      </div>
      {renderPageCount(currentPage, totalPages)}
      <div
        onClick={!nextIsDisabled ? goToNextPage : undefined}
        className={classnames({ disabled: nextIsDisabled, pointer: !nextIsDisabled })}
      >
        <ActionNotification
          text={TEXT_NEXT_PAGE}
          status="information"
          iconPath={ICONS.RED_ARROW}
        />
      </div>
    </div>
  );
}

export default Paginator;
