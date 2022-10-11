import React from 'react';
import { withKit } from 'components/KitContext';

const Form = ({
  strings: STRINGS,
  generateId
}) => {
    return (
      <div>
        <div className="bold my-4 py-4">
          {STRINGS.formatString(STRINGS[generateId('content')], STRINGS[generateId('title')])}
        </div>
      </div>
    )
}

const mapContextToProps = ({ strings, activeLanguage, generateId }) => ({
  strings,
  activeLanguage,
  generateId,
});

export default withKit(mapContextToProps)(Form);