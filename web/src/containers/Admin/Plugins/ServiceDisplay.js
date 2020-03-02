import React from 'react';
import { Button } from 'antd';

const ServiceDisplay = ({ title = 'Service', constants = {}, services, handleForm, disconnectService }) => {
    const secrets = constants.secrets || {};
    return (
        <div>
            <div className="plugin-service my-3 d-flex align-items-center justify-content-between p-1">
                <div className="d-flex align-items-center w-25 service-heading">
                    <h2>{title}</h2>
                </div>
                <div>
                    {secrets[services]
                        ? <div>
                            <div className="service-connected">
                                Connected
                            </div>
                            <div className="link pointer" onClick={disconnectService}>
                                Disconnect
                            </div>
                        </div>
                        : <Button className='service-button-warning' onClick={handleForm}>
                            Not connected
                        </Button>
                    }
                </div>
            </div>
        </div>
    )
}

export default ServiceDisplay;
