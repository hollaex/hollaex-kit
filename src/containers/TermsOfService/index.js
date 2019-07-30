import React, { Component } from 'react';
import classnames from 'classnames';

import { Button } from '../../components';
import { FLEX_CENTER_CLASSES } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

export default class TermsOfServices extends Component {
    render() {
        return (
            <div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'f-1')}>
				<div
					className={classnames(
						...FLEX_CENTER_CLASSES,
						'flex-column',
						'auth_wrapper',
						'w-100'
					)}
				>
                    <div className='title_wrapper mb-3'>{STRINGS.TERMS_OF_SERVICES.TITLE}</div>
                    <div className='agreement_wrapper mb-3 p-3'>
                        {STRINGS.TERMS_OF_SERVICES.SERVICE_AGREEMENT}
                    </div>
                    <Button
                        label={STRINGS.TERMS_OF_SERVICES.PROCEED}
                        onClick={() => this.props.router.push('/account')}
                    />
                </div>
            </div>
        )
    }
}
