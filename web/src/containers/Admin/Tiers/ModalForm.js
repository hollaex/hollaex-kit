import React, { Component } from 'react';
import { Button, Input } from 'antd';
import ReactSVG from 'react-svg';
import { WarningFilled, ExclamationCircleOutlined } from '@ant-design/icons';

import { ICONS } from '../../../config/constants';

const { TextArea } = Input;

export const NewTierConfirmation = ({ onTypeChange }) => (
    <div>
        <h3>Add tier</h3>
        <div className="d-flex mb-3">
            <div>
                <WarningFilled style={{ color: 'red', fontSize: '25px', marginRight: '10px' }} />
            </div>
            <div>
                Once a new user account tier has been added it can't be easily removed. Are you sure you want to add a new tier?
                </div>
        </div>
        <div>
            <Button className="green-btn" onClick={() => onTypeChange('new-tier-form')}>
                Yes, create new tier
                </Button>
        </div>
    </div>
);

export default class NewTierForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            requirements: [
                { id: 1, point: '' }
            ],
            tierData: this.props.editData || {}
        }
    }

    componentDidMount() {
        this.setState({ tierData: this.props.editData || {} });
    }

    handleChangeFile = (event) => {
        if (event.target.files) {
            this.setState({
                tierData: {
                    ...this.state.tierData,
                    [event.target.name]: event.target.files[0]
                }
            });
        }
    };

    handleRequirementChange = (event, data) => {
        this.setState({
            requirements: this.state.requirements.map(requirement => {
                if (requirement.id === data.id) {
                    return {
                        ...requirement,
                        point: event.target.value
                    }
                }
                return requirement;
            })
        });
    };

    handleChange = (e) => {
        this.setState({
            tierData: {
                ...this.state.tierData,
                [e.target.name]: e.target.value
            }
        });
    };

    saveForm = () => {
        console.log('this.state', this.state.tierData);
    };

    render() {
        const { tierData } = this.state;
        const { tierLevel = 1 } = this.props;
        return (
            <div className="new-tier-form">
                <h3>Account tier details</h3>
                <div>
                    <div>Name</div>
                    <Input
                        name="name"
                        placeholder="Tier name"
                        onChange={this.handleChange}
                        value={tierData.name}
                    />
                </div>
                <div className="requirement-divider"></div>
                <div className='file-wrapper'>
                    <div className="file-container">
                        <img
                            src={tierData.icon || ICONS[`LEVEL_ACCOUNT_ICON_${tierLevel}`]}
                            alt='icon'
                            className='icon-img'
                        />
                        <label>
                            <span className="anchor">Upload</span>
                            <input
                                type="file"
                                onChange={this.handleChangeFile}
                                name={'icon'}
                            />
                        </label>
                    </div>
                </div>
                <div className="requirement-divider"></div>
                <div>
                    <div className="sub-title">Description</div>
                    <TextArea
                        rows={3}
                        name='description'
                        placeholder="Write a description here..."
                        onChange={this.handleChange}
                        value={tierData.description}
                    />
                </div>
                <div className="requirement-divider"></div>
                <div>
                    <div className="sub-title">Requirement bullet point</div>
                    {this.state.requirements.map((requirement, index) => (
                        <div key={index} className="my-1">
                            <Input
                                name={requirement.id}
                                placeholder="Requirement bullet point"
                                value={requirement.point}
                                onChange={(e) => this.handleRequirementChange(e, requirement)}
                            />
                        </div>
                    ))}
                    <div className="my-2">
                        <Button
                            type="primary"
                            onClick={() => this.setState({
                                requirements: [
                                    ...this.state.requirements,
                                    {
                                        id: (this.state.requirements.length + 1),
                                        point: ''
                                    }
                                ]
                            })}
                        >
                            + Add bullet point
                        </Button>
                    </div>
                </div>
                <div className="requirement-divider"></div>
                <div>
                    <div className="sub-title">Default maker trading fee</div>
                    <Input name="maker_fee" value={tierData.maker_fee} onChange={this.handleChange} />
                </div>
                <div className="requirement-divider"></div>
                <div>
                    <div className="sub-title">Taker trading fee</div>
                    <Input name="taker_fee" value={tierData.taker_fee} onChange={this.handleChange} />
                </div>
                <div className="requirement-divider"></div>
                <div className='d-flex align-items-center'>
                    <div>
                        <ExclamationCircleOutlined style={{ fontSize: '44px', marginRight: '10px' }} />
                    </div>
                    <div>
                        The default trading fee will be applied to all trading pairs. You'll be able to define each pairs trading fees in the fees section once this tier has been created.
                    </div>
                </div>
                <Button type="primary" className="green-btn" onClick={this.saveForm}>
                    Next
                </Button>
            </div>
        );
    }
}

export const Preview = ({ tierData = {} }) => {
    return (
        <div className="d-flex tiers-container">
            <div>
                {tierData.icon
                    ? <img src={tierData.icon} className="tier-icon" alt={`Account Tier ${tierData.id}`} />
                    : <ReactSVG path={ICONS[`LEVEL_ACCOUNT_ICON_${tierData.id}`]} wrapperClassName="tier-icon" />
                }
            </div>
            <div className="mx-3 f-1">
                <div>
                    <div>Account Tier {tierData.id}</div>
                    <div className="description">{tierData.description}</div>
                </div>
                <div className="requirement-divider"></div>
                <div>
                    <div>Requirements</div>
                    <div className="description">{tierData.requirements}</div>
                </div>
            </div>
        </div>
    );
};
