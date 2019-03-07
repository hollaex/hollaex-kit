import React from 'react';

import { Accordion, Table } from '../../components';
import STRINGS from '../../config/localizedStrings';

export const generateHeaders = (onAdjustPortfolio) => {
	return [
		{
			label: STRINGS.USER_SETTINGS.RISK_MANAGEMENT.PORTFOLIO,
			key: 'percentage',
			renderCell: ({ id, percentage }, key, index) => (
				<td key={`${key}-${id}-percentage`}>
					{percentage}
				</td>
			)
		},
		{
			label: STRINGS.USER_SETTINGS.RISK_MANAGEMENT.TOMAN_ASSET,
			key: 'assetValue',
			renderCell: ({ id, assetValue }, key, index) => (
				<td key={`${key}-${id}-assetValue`}>
					{assetValue}
				</td>
			)
		},
		{
			label: '',
			key: 'adjust',
			className: 'text-center',
			renderCell: ({ id }, key, index) => (
				<td key={`${key}-${id}-adjusted`} className="text-center pointer blue-link" onClick={onAdjustPortfolio}>
					{STRINGS.USER_SETTINGS.RISK_MANAGEMENT.ADJUST}
				</td>
			)
		}
	];
};

const RiskForm = ({ onAdjustPortfolio, totalAssets, percentageOfPortfolio}) => {
	const assetData = [
		{ id: 1, percentage: percentageOfPortfolio, assetValue: totalAssets }
	];
    const sections = [
        {
            title: STRINGS.USER_SETTINGS.CREATE_ORDER_WARING,
            content: <div>
                <p>{STRINGS.USER_SETTINGS.RISK_MANAGEMENT.INFO_TEXT}</p>
				<p>{STRINGS.formatString(STRINGS.USER_SETTINGS.RISK_MANAGEMENT.INFO_TEXT_1, totalAssets).join('')}</p>
                <Table
                    rowClassName="pt-2 pb-2"
					headers={generateHeaders(onAdjustPortfolio)}
                    data={assetData}
                    count={1}
                    displayPaginator= {false}
                />
            </div>
        }
    ]
    return <Accordion sections={sections} />;
};

export default RiskForm;