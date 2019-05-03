import React from 'react';

import Trade from './Trade';

const generateContent = ({ type, ...rest }) => {
    switch (type) {
        case 'trade':
            return <Trade {...rest} />
        default:
            return <div style={{ height: '2rem', width: '100%', color: '#fff' }} >{rest.content}</div>;
    }
}

const SnackDialog = (props) => {
    return (
        <div className="notification-wrapper">
            {generateContent(props)}
        </div>
    );
};

export default SnackDialog;