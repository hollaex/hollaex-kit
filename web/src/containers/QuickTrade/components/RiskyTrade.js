import React, { useEffect, useState } from 'react';
import STRINGS from 'config/localizedStrings';

export const RiskyTrade = ({ setShowRisky }) => {
    return (
        <div>
            <div>
                <div className="mb-4">
                    // continue code here
                </div>
                <footer className="d-flex pt-4">
                    <Button
                        label={isExpired ? STRINGS['BACK'] : STRINGS['CLOSE_TEXT']}
                        onClick={onCloseDialog}
                        className="mr-2"
                    />
                    <Button
                        label={STRINGS['CONFIRM_TEXT']}
                        onClick={onExecuteTrade}
                        className="ml-2"
                        disabled={disabled || isExpired}
                    />
                </footer>
            </div>
        </div>
    )
};