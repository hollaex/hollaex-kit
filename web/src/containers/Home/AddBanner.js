import React from 'react';
import { SingleBanner } from './SingleBanner';

const img1 =
	'https://image.freepik.com/free-vector/crypto-currency-bitcoin-blue-background-digital-web-money-modern-technology-banner-with-copy-spac_48369-13790.jpg';
export const AddBanner = () => {
	return (
		<>
			<div className={'bg-white'}>
				<div className="container">
					<div className={'row addBanner'}>
						<div className="col-md-3">
							<SingleBanner img={img1} />
						</div>
						<div className="col-md-3">
							<SingleBanner img={img1} />
						</div>
						<div className="col-md-3">
							<SingleBanner img={img1} />
						</div>
						<div className="col-md-3">
							<SingleBanner img={img1} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
