import React from 'react';
import IconTitle from '../IconTitle';
import Button from '../Button';
import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

const StakeToken = ({ onBack }) => {
    return (
        <div className='invite_friends_wrapper'>
            <IconTitle
                stringId="STAKE_TOKEN.TITLE"
                text={STRINGS["STAKE_TOKEN.TITLE"]}
                iconId="STAKETOKEN_ICON"
                iconPath={ICONS["STAKETOKEN_ICON"]}
                textType="title"
                useSvg={true}
                underline={true}
            />
            <div>
                <div className='my-2 stake_txt'>
                    <div className="mt-3">{STRINGS["STAKE_TOKEN.INFO_TXT1"]}</div>
                    <div className="mt-3">{STRINGS["STAKE_TOKEN.INFO_TXT2"]}</div>
                    <div className="mt-3">{STRINGS["STAKE_TOKEN.INFO_TXT3"]}</div>
                </div>
                <div className="d-flex my-5 mt-5">
                    <Button
                        label={STRINGS["BACK_TEXT"]}
                        className="mr-5"
                        onClick={onBack}
                    />
                    <a
                        className="exir-button mdc-button mdc-button--unelevated exir-button-font"
                        href="https://info.hollaex.com/hc/en-us/articles/360040097453-How-can-I-stake-collateralize-HollaEx-Token-XHT"
                        target='blank'>
                        <Button
                            label={STRINGS["STAKE_TOKEN.BUTTON_TXT"]}
                            onClick={() => { }}
                        />
                    </a>
                </div>
            </div>
        </div>
    )
}

export default StakeToken;
