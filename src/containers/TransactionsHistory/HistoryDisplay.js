import React, { Component } from 'react';
import classnames from 'classnames';

import { TEXT_DOWNLOAD, TABLE_PAGE_SIZE } from './constants';
import { ICONS, } from '../../config/constants';
import { ActionNotification, Table, CsvDownload, Loader } from '../../components';

const HistoryDisplay = (props) => {
  const { symbol, title, headers, data: { data, count, loading }, filename} = props;

  return (
    <div className="history_block-wrapper">
      <div className="title text-capitalize">
        {title}
        {count > 0 &&
          <CsvDownload
            data={data}
            headers={headers}
            filename={filename}
          >
            <ActionNotification
              text={TEXT_DOWNLOAD}
              iconPath={ICONS.LETTER}
            />
          </CsvDownload>
        }
      </div>
      {loading ?
        <Loader /> :
        <Table
          data={data}
          count={count}
          headers={headers}
          withIcon={true}
          pageSize={TABLE_PAGE_SIZE}
        />
      }
    </div>
  );
}

export default HistoryDisplay;
