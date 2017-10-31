import React from 'react';

const TableHeader = ({ headers }) => (
  <thead className="table_header-wrapper">
    <tr className="table_header-row">
      {headers.map(({ label }, index) => <th key={index}>{label}</th>)}
    </tr>
  </thead>
);

export default TableHeader;
