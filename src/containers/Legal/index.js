import React from 'react';

import { Legal } from '../../components';

const LegalPage = ({ route: { content = '' } }) => {
  return (
    <div className="legal-container">
      {content && <Legal type={content} />}
    </div>
  );
}

export default LegalPage;
