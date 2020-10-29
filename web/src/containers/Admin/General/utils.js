import React from 'react';
import { Select } from 'antd';

import { CurrencyBall } from '../../../components';

import LANGUAGES from '../../../config/languages';

const renderCoinOptions = (coins = {}) => (
    Object.keys(coins).map((symbol, index) => {
        const coinData = coins[symbol];
        return (
            <Select.Option key={index} value={symbol}>
                <div className='asset-list'>
                    <CurrencyBall symbol={symbol} name={symbol} size='m' />
                    <div className='select-coin-text'>
                        {coinData.fullname}
                    </div>
                </div>
            </Select.Option>
        );
    })
);

export const getGeneralFields = (coins) => ({
    section_1: {
        exchange_name: {
            type: 'text',
            placeholder: 'enter exchange name'
        }
    },
    section_2: {
        language: {
            type: 'select',
            mode: 'multiple',
            options: LANGUAGES
        }
    },
    section_3: {
        theme: {
            type: 'select',
            mode: 'multiple',
            options: [
                { label: 'White', value: 'white' },
                { label: 'Dark', value: 'dark' }
            ]
        }
    },
    section_4: {
        native_currency: {
            type: 'select',
            options: coins,
            renderOptions: () => renderCoinOptions(coins)
        }
    },

});
