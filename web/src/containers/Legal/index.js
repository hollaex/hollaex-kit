import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { Legal } from '../../components';
import { getClasesForLanguage } from '../../utils/string';
import withConfig from 'components/ConfigProvider/withConfig';

const LegalPage = ({
	route: { content = '' },
	activeLanguage,
	constants = {},
	icons: ICONS,
}) => {
	return (
		<div
			className={classnames(
				'legal-container',
				getClasesForLanguage(activeLanguage)
			)}
		>
			{content && (
				<Legal
					type={content}
					constants={constants}
					logoPath={ICONS['EXCHANGE_LOGO']}
				/>
			)}
		</div>
	);
};

const mapStateToProps = (store) => ({
	activeLanguage: store.app.language,
	constants: store.app.constants,
});

export default connect(mapStateToProps)(withConfig(LegalPage));
