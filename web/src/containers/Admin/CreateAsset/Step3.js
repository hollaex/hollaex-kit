import React, { Fragment } from 'react';
import { Radio,  Button } from 'antd';

// import Coins from '../../components/Coins';

const radioStyle = {
    display: 'flex',
    alignItems: 'center',
    height: '30px',
    lineHeight: '1.2',
    padding: '24px 0',
    margin: 0,
    paddingLeft: '1px',
    whiteSpace: 'normal',
    letterSpacing: '-0.15px',
};

const Step3 = ({
    coinFormData = {},
    isConfigureEdit,
    isEdit,
    handleChange,
    handleNext,
    handleScreenChange,
    onClose,
    activeTab,
    setCurrentPageAssets
}) => {
    return (
        <Fragment>
            <div className="title">Create or add a new coin</div>
            <div className="preview-coin-container">
                <div className="left-content blockchain">
                    <div className="no-icon">
                        {/* <Coins
                            md
                            small
                            color="#000"
                            type={'?'}
                        /> */}
                    </div>
                </div>
                <div className="right-content">
                    <div className="sub-title">Select asset type</div>
                    <Radio.Group
                        name="type"
                        onChange={(e) => handleChange(e.target.value, e.target.name)}
                        value={coinFormData.type}
                    >
                        <Radio style={radioStyle} value={'blockchain'}>
                            Blockchain
                        </Radio>
                        <Radio style={radioStyle} value={'fiat'}>
                            Fiat (e.g. USD, EUR)
                        </Radio>
                        {/* <Radio style={radioStyle} value={'other'}>
                            other
                        </Radio> */}
                    </Radio.Group>
                </div>
            </div>
            <div className="btn-wrapper">
                <Button
                    type="primary"
                    onClick={() => {
                        if (isConfigureEdit || isEdit) {
                            onClose();
                        } else {
                            handleScreenChange('step1');
                            setCurrentPageAssets(activeTab);
                        }
                    }}
                    className="green-btn"
                >
                    Back
                </Button>
                <div className="separator"></div>
                <Button
                    type="primary"
                    className="green-btn"
                    disabled={!coinFormData.type}
                    onClick={handleNext}
                >
                    Next
                </Button>
            </div>
        </Fragment>
    );
}

export default Step3;
