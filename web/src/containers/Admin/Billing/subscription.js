import React from 'react';
import { STATIC_ICONS } from 'config/icons';
import { ReactSVG } from 'react-svg';
// import Image from 'components/Image'

const Subscription = () => {
	return (
		<div className="subscription-container">
			{/* <Image
                iconId={`STATIC_ICONS['CARD_SECTION_ICON_1']`}
                icon={STATIC_ICONS['CARD_SECTION_ICON_1']}
                wrapperClassName={'card_section_logo'}
            /> */}
			<div className="card-icon">
				<ReactSVG
					src={STATIC_ICONS['CLOUD_BASIC']}
					className="cloud-background"
				/>
				<ReactSVG src={STATIC_ICONS['CLOUD_CRYPTO']} className="cloud-icon" />
			</div>
			<div>
				<p>PLAN SUBSCRIBTION</p>
				<p className="f-16">Crypto Pro</p>
				<p>HollaEx Monthly Cloud Hosting</p>
			</div>
			<div className="exchange-text">
				<span>
					<div className="exchange-name"></div>
				</span>
				<p>exchange-name</p>
			</div>
			<div>
				<p className="f-20">Monthly Payment:</p>
				<p className="f-20">$2,800 USDT</p>
			</div>
		</div>
	);
};

export default Subscription;
