import React from 'react';
import { Button } from 'antd';

const WelcomeScreen = ({ onChangeStep }) => {
    return (
        <div className="welcome-screen">
            <div className="content">
                <div className="logo"></div>
                <div className="body-content">
                    <div className="header">
                        First-time exchange operator detected Proceed with administrator account creation
                    </div>
                    <div className="description">
                        This procedure must only be completed by the exchange owner. When creating your operator administrators account it is important to memorize the details as it will be unrecoverable upon creation.
                    </div>
                    <div className="btn-container">
                        <Button onClick={() => onChangeStep('email')}>Begin account creation</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelcomeScreen;
