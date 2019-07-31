import React, { Component } from 'react';
import classnames from 'classnames';

import TermsForm from './TermsOfService';
import DepositFunds from './DepositFunds';
import { requiredWithCustomMessage } from '../../components/Form/validations';
import { FLEX_CENTER_CLASSES } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

export default class TermsOfServices extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isAgreed: false
        }
    }
    

    onSubmitTerms = (formValues) => {
        if (formValues.agreeTerms && formValues.agreeRisk) {
            localStorage.setItem('termsAccepted', true);
            this.setState({ isAgreed: true });
        }
    };

    gotoWallet = () => {
        this.props.router.push('/wallet');
    };

    render() {
        const formFields = {
            agreeTerms: {
                type: 'checkbox',
                fullWidth: true,
                validate: [requiredWithCustomMessage(STRINGS.VALIDATIONS.ACCEPT_TERMS)],
                label: STRINGS.TERMS_OF_SERVICES.AGREE_TERMS_LABEL
            },
            agreeRisk: {
                type: 'checkbox',
                fullWidth: true,
                validate: [requiredWithCustomMessage(STRINGS.VALIDATIONS.ACCEPT_TERMS)],
                label: STRINGS.TERMS_OF_SERVICES.RISK_INVOLVED_LABEL
            }
        };
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
                    {this.state.isAgreed
                        ? <DepositFunds gotoWallet={this.gotoWallet} />
                        : <TermsForm formFields={formFields} onSubmitTerms={this.onSubmitTerms} />
                    }
                </div>
            </div>
        )
    }
}
