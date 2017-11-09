import React from 'react';

import { Legal } from '../../components';

const LegalPage = ({ route: { content = '' } }) => {
  return (
    <div style={{ width: '100%' }}>
      {content && <Legal type={content} />}
    </div>
  );
}

export default LegalPage;
