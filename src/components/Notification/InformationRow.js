import React from 'react';

export default ({ label, value }) => (
  <div className="d-flex">
    <div className="f-1 text_disabled">{label}:</div>
    <div className="f-1">{value}</div>
  </div>
);
