import React, { Fragment } from 'react';
import { EditWrapper, IconTitle } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { LoadingOutlined } from '@ant-design/icons';
import { DEFAULT_COIN_DATA } from 'config/constants';

const LoadingContent = ({ symbol, coins }) => {
	const { display_name } = coins[symbol] || DEFAULT_COIN_DATA;
	return (
		<Fragment>
			<div className="dialog-content">
				<div className="d-flex content-center pt-4 mt-4 staking-loader">
					<LoadingOutlined />
				</div>
				<IconTitle
					text={''}
					textType="stake_popup__title"
					underline={false}
					className="w-100"
				/>
			</div>
			<div className="dialog-content bottom">
				<div className="text-align-center secondary-text">
					<EditWrapper stringId="STAKE.CHECKING_ALLOWANCE">
						{STRINGS.formatString(
							STRINGS['STAKE.CHECKING_ALLOWANCE'],
							display_name
						)}
					</EditWrapper>
				</div>
			</div>
		</Fragment>
	);
};

export default withConfig(LoadingContent);
