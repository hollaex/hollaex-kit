import React from 'react';
import IconTitle from '../IconTitle';
import Button from '../Button';
import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

const StakeToken = ({ data, onBack }) => {
    const { handleDashLink } = data;
    return (
        <div className='invite_friends_wrapper'>
            <IconTitle
                text={STRINGS.STAKE_TOKEN.TITLE}
                iconPath={ICONS.STAKETOKEN_ICON}
                textType="title"
                useSvg={true}
                underline={true}
            />
            <div>
                <div className='my-2 stake_txt'>
                    <div className="mt-3">{STRINGS.STAKE_TOKEN.INFO_TXT1}</div>
                    <div className="mt-3">{STRINGS.STAKE_TOKEN.INFO_TXT2}</div>
                    <div className="mt-3">{STRINGS.STAKE_TOKEN.INFO_TXT3}</div>
                </div>
                <div className="d-flex my-5 mt-5">
                    <Button
                        label={STRINGS.BACK_TEXT}
                        className="mr-5"
                        onClick={onBack}
                    />
                    <Button
                        label={STRINGS.STAKE_TOKEN.BUTTON_TXT}
                        onClick={handleDashLink}
                    />
                </div>
            </div>
        </div>
    )
}

export default StakeToken;
